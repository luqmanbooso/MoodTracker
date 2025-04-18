import Progress from '../models/Progress.js';
import Achievement from '../models/Achievement.js';
import mongoose from 'mongoose';

// Get user progress including points, level, and other stats
export const getUserProgress = async (req, res) => {
  try {
    // Use a default user ID for development
    const userId = '000000000000000000000000';
    
    // Find or create progress record
    let progress = await Progress.findOne({ user: userId });
    if (!progress) {
      progress = new Progress({ user: userId });
      await progress.save();
    }
    
    // Calculate level information
    const levelInfo = calculateLevelInfo(progress.points);
    
    // Get recent achievements
    const recentAchievements = await Achievement.find({ user: userId })
      .sort({ earnedDate: -1 })
      .limit(5);
    
    // Format the response
    const response = {
      ...progress.toObject(),
      levelInfo,
      recentAchievements
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Error fetching user progress' });
  }
};

// Get all achievements for the current user
export const getAchievements = async (req, res) => {
  try {
    // Use a default user ID for development
    const userId = '000000000000000000000000';
    
    const achievements = await Achievement.find({ user: userId })
      .sort({ earnedDate: -1 });
    
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Error fetching achievements' });
  }
};

// Get detailed user stats and insights
export const getUserStats = async (req, res) => {
  try {
    // Use a default user ID for development
    const userId = '000000000000000000000000';
    
    // Get user progress
    const progress = await Progress.findOne({ user: userId });
    
    // Create stats object
    const stats = {
      totalEntries: progress?.moodEntryCount || 0,
      moodDistribution: {
        "Great": Math.floor(Math.random() * 10),
        "Good": Math.floor(Math.random() * 15),
        "Neutral": Math.floor(Math.random() * 8),
        "Bad": Math.floor(Math.random() * 6),
        "Awful": Math.floor(Math.random() * 3)
      },
      mostFrequentMood: "Good",
      moodTrend: "improving",
      streak: {
        current: progress?.currentStreak || 0,
        longest: progress?.longestStreak || 0
      },
      completions: {
        challenges: progress?.challengeCompletionCount || 0
      },
      points: progress?.points || 0,
      level: progress?.level || 1
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user stats' });
  }
};

// Award points to the user
export const awardPoints = async (req, res) => {
  try {
    // Use a default user ID for development
    const userId = '000000000000000000000000';
    
    const { points, reason, description } = req.body;
    
    if (!points || !reason) {
      return res.status(400).json({ message: 'Points and reason are required' });
    }
    
    // Find or create progress record
    let progress = await Progress.findOne({ user: userId });
    if (!progress) {
      progress = new Progress({ user: userId });
    }
    
    // Add points
    progress.points += points;
    
    // Increment appropriate counters based on reason
    if (reason === 'mood_entry') {
      progress.moodEntryCount += 1;
    } else if (reason === 'challenge_complete') {
      progress.challengeCompletionCount += 1;
    }
    
    // Update streak if appropriate
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastActiveDate = progress.lastActive ? new Date(progress.lastActive) : null;
    
    if (lastActiveDate) {
      const isToday = today.toDateString() === lastActiveDate.toDateString();
      const isYesterday = yesterday.toDateString() === lastActiveDate.toDateString();
      
      if (!isToday && isYesterday) {
        // User was active yesterday, increment streak
        progress.currentStreak += 1;
        
        // Update longest streak if needed
        if (progress.currentStreak > progress.longestStreak) {
          progress.longestStreak = progress.currentStreak;
        }
      } else if (!isToday && !isYesterday) {
        // User wasn't active yesterday, reset streak
        progress.currentStreak = 1;
      }
    } else {
      // First activity, set streak to 1
      progress.currentStreak = 1;
    }
    
    // Update last active date
    progress.lastActive = today;
    
    // Update level
    const levelInfo = calculateLevelInfo(progress.points);
    progress.level = levelInfo.current;
    
    // Add to history
    progress.pointsHistory.unshift({
      points,
      reason,
      description,
      date: new Date()
    });
    
    // Keep history to last 100 entries
    if (progress.pointsHistory.length > 100) {
      progress.pointsHistory = progress.pointsHistory.slice(0, 100);
    }
    
    await progress.save();
    
    // Check for new achievements
    await checkForAchievements(userId, progress);
    
    // Send back updated data
    res.json({
      points: progress.points,
      level: progress.level,
      levelInfo,
      currentStreak: progress.currentStreak,
      pointsAwarded: points,
      message: 'Points awarded successfully'
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    res.status(500).json({ message: 'Error awarding points' });
  }
};

// Helper function to calculate level information
const calculateLevelInfo = (points) => {
  // Level thresholds
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
  
  // Find current level
  let currentLevel = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (points >= thresholds[i]) {
      currentLevel = i + 1;
    } else {
      break;
    }
  }
  
  // Calculate progress to next level
  const currentThreshold = thresholds[currentLevel - 1];
  const nextThreshold = thresholds[currentLevel] || currentThreshold + 1000;
  
  const pointsInCurrentLevel = points - currentThreshold;
  const pointsNeededForNextLevel = nextThreshold - currentThreshold;
  const progressPercentage = Math.floor((pointsInCurrentLevel / pointsNeededForNextLevel) * 100);
  
  return {
    current: currentLevel,
    progress: progressPercentage,
    pointsForNextLevel: nextThreshold - points,
    nextLevel: currentLevel + 1
  };
};

// Function to check and award new achievements
const checkForAchievements = async (userId, progress) => {
  try {
    // Get existing achievements
    const existingAchievements = await Achievement.find({ user: userId });
    const existingTypes = new Set(existingAchievements.map(a => a.type + '-' + a.level));
    
    // Define achievement criteria
    const achievementCriteria = [
      // Mood entry achievements
      {
        type: 'mood_entries',
        level: 1,
        threshold: 5,
        title: 'Mood Tracker',
        description: 'Log 5 moods',
        points: 15,
        check: () => progress.moodEntryCount >= 5
      },
      {
        type: 'mood_entries',
        level: 2,
        threshold: 20,
        title: 'Mood Master',
        description: 'Log 20 moods',
        points: 30,
        check: () => progress.moodEntryCount >= 20
      },
      
      // Streak achievements
      {
        type: 'streaks',
        level: 1,
        threshold: 3,
        title: '3-Day Streak',
        description: 'Log your mood for 3 days in a row',
        points: 15,
        check: () => progress.currentStreak >= 3
      },
      {
        type: 'streaks',
        level: 2,
        threshold: 7,
        title: 'Weekly Warrior',
        description: 'Log your mood for 7 days in a row',
        points: 30,
        check: () => progress.currentStreak >= 7
      },
      
      // Challenge achievements
      {
        type: 'challenge_completion',
        level: 1,
        threshold: 5,
        title: 'Challenge Accepted',
        description: 'Complete 5 daily challenges',
        points: 20,
        check: () => progress.challengeCompletionCount >= 5
      }
    ];
    
    // Check for new achievements
    for (const criteria of achievementCriteria) {
      const key = criteria.type + '-' + criteria.level;
      
      // If the achievement doesn't exist yet and condition is met
      if (!existingTypes.has(key) && criteria.check()) {
        // Create new achievement
        const achievement = new Achievement({
          user: userId,
          type: criteria.type,
          level: criteria.level,
          title: criteria.title,
          description: criteria.description,
          points: criteria.points
        });
        
        await achievement.save();
        
        // Add points for earning achievement
        await Progress.findOneAndUpdate(
          { user: userId },
          { 
            $inc: { points: criteria.points },
            $push: { 
              pointsHistory: {
                points: criteria.points,
                reason: 'achievement',
                description: `Earned achievement: ${criteria.title}`,
                date: new Date()
              } 
            }
          }
        );
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};