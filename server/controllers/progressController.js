import Progress from '../models/Progress.js';
import Achievement from '../models/Achievement.js';
import { getWeekNumber, calculateLevel } from '../utils/gamification.js';

// Get user progress including points, level, and other stats
export const getUserProgress = async (req, res) => {
  try {
    // Use a default user ID for development
    const userId = req.user?.id || '000000000000000000000000';
    
    // Find or create progress record
    let progress = await Progress.findOne({ user: userId });
    if (!progress) {
      progress = new Progress({ user: userId });
      await progress.save();
    }
    
    // Calculate level information
    const levelInfo = calculateLevelInfo(progress.points);
    
    // Get recent history
    const recentHistory = progress.pointsHistory.slice(0, 10);
    
    // Format the response
    const response = {
      points: progress.points,
      level: levelInfo.current,
      nextLevel: levelInfo.nextLevel,
      progress: levelInfo.progress,
      pointsForNextLevel: levelInfo.pointsForNextLevel,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      recentHistory,
      stats: {
        moodEntryCount: progress.moodEntryCount,
        habitCompletionCount: progress.habitCompletionCount,
        goalCompletionCount: progress.goalCompletionCount,
        challengeCompletionCount: progress.challengeCompletionCount
      }
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
    const userId = req.user?.id || '000000000000000000000000';
    
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
    const userId = req.user?.id || '000000000000000000000000';
    
    // Get user progress
    const progress = await Progress.findOne({ user: userId });
    
    if (!progress) {
      return res.status(404).json({ message: 'User progress not found' });
    }
    
    // Get weekly data
    const weeklyData = progress.weeklyProgress.slice(-8); // Last 8 weeks
    
    const stats = {
      totalEntries: progress.moodEntryCount,
      streak: {
        current: progress.currentStreak,
        longest: progress.longestStreak
      },
      completions: {
        habits: progress.habitCompletionCount,
        goals: progress.goalCompletionCount,
        challenges: progress.challengeCompletionCount
      },
      points: progress.points,
      level: calculateLevel(progress.points),
      weeklyData
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
    const userId = req.user?.id || '000000000000000000000000';
    
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
    switch(reason) {
      case 'mood_entry':
        progress.moodEntryCount += 1;
        updateStreak(progress);
        break;
      case 'challenge_complete':
        progress.challengeCompletionCount += 1;
        break;
      case 'habit_complete':
        progress.habitCompletionCount += 1;
        break;
      case 'goal_progress':
        progress.goalProgressCount += 1;
        break;
      case 'goal_complete':
        progress.goalCompletionCount += 1;
        break;
      case 'resource_complete':
        progress.resourceViewCount += 1;
        break;
    }
    
    // Update weekly progress
    updateWeeklyProgress(progress, points, reason);
    
    // Calculate level information
    const levelInfo = calculateLevelInfo(progress.points);
    
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
    const newAchievements = await checkForAchievements(userId, progress);
    
    // Send back updated data
    res.json({
      points: progress.points,
      level: levelInfo.current,
      levelInfo,
      currentStreak: progress.currentStreak,
      pointsAwarded: points,
      newAchievements,
      message: 'Points awarded successfully'
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    res.status(500).json({ message: 'Error awarding points' });
  }
};

// Helper function to update user streak
const updateStreak = (progress) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastActiveDate = progress.lastActive ? new Date(progress.lastActive) : null;
  
  if (lastActiveDate) {
    // Check if user was active yesterday or today already
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
    // If already logged today, don't change streak
  } else {
    // First activity, set streak to 1
    progress.currentStreak = 1;
  }
  
  // Update last active date
  progress.lastActive = today;
};

// Helper function to update weekly progress
const updateWeeklyProgress = (progress, points, reason) => {
  const now = new Date();
  const weekNumber = getWeekNumber(now);
  const weekKey = `${now.getFullYear()}-${weekNumber.toString().padStart(2, '0')}`;
  
  let weekRecord = progress.weeklyProgress.find(w => w.week === weekKey);
  
  if (!weekRecord) {
    weekRecord = {
      week: weekKey,
      moodEntries: 0,
      habitsCompleted: 0,
      goalsProgressed: 0,
      pointsEarned: 0
    };
    progress.weeklyProgress.push(weekRecord);
  }
  
  weekRecord.pointsEarned += points;
  
  switch(reason) {
    case 'mood_entry':
      weekRecord.moodEntries++;
      break;
    case 'habit_complete':
      weekRecord.habitsCompleted++;
      break;
    case 'goal_progress':
    case 'goal_complete':
      weekRecord.goalsProgressed++;
      break;
  }
  
  // Keep only the last 12 weeks of data
  if (progress.weeklyProgress.length > 12) {
    progress.weeklyProgress = progress.weeklyProgress.slice(-12);
  }
};

// Helper function to calculate level information
const calculateLevelInfo = (points) => {
  // Level thresholds - exponential curve
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
  
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
  const nextThreshold = thresholds[currentLevel] || thresholds[thresholds.length - 1] + 1000;
  
  const pointsInCurrentLevel = points - currentThreshold;
  const pointsNeededForNextLevel = nextThreshold - currentThreshold;
  const progressPercentage = Math.floor((pointsInCurrentLevel / pointsNeededForNextLevel) * 100);
  
  return {
    current: currentLevel,
    nextLevel: currentLevel + 1,
    progress: progressPercentage,
    pointsForNextLevel: nextThreshold - points
  };
};

// Function to check and award new achievements
const checkForAchievements = async (userId, progress) => {
  try {
    // Get existing achievements
    const existingAchievements = await Achievement.find({ user: userId });
    const existingTypes = new Set(existingAchievements.map(a => `${a.type}-${a.level}`));
    
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
      {
        type: 'mood_entries',
        level: 3,
        threshold: 50,
        title: 'Mood Expert',
        description: 'Log 50 moods',
        points: 50,
        check: () => progress.moodEntryCount >= 50
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
      {
        type: 'streaks',
        level: 3,
        threshold: 30,
        title: 'Monthly Master',
        description: 'Log your mood for 30 days in a row',
        points: 100,
        check: () => progress.currentStreak >= 30
      },
      
      // Habit achievements
      {
        type: 'habit_completion',
        level: 1,
        threshold: 10,
        title: 'Habit Former',
        description: 'Complete 10 habits',
        points: 20,
        check: () => progress.habitCompletionCount >= 10
      },
      
      // Goal achievements
      {
        type: 'goal_completion',
        level: 1,
        threshold: 1,
        title: 'Goal Getter',
        description: 'Complete your first goal',
        points: 25,
        check: () => progress.goalCompletionCount >= 1
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
    const newAchievements = [];
    
    for (const criteria of achievementCriteria) {
      const key = `${criteria.type}-${criteria.level}`;
      
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
        newAchievements.push(achievement);
        
        // Add achievement reference to progress
        progress.achievements = progress.achievements || [];
        progress.achievements.push(achievement._id);
        
        // Add points for earning achievement
        progress.points += criteria.points;
        progress.pointsHistory.unshift({
          points: criteria.points,
          reason: 'achievement',
          description: `Earned achievement: ${criteria.title}`,
          date: new Date()
        });
      }
    }
    
    if (newAchievements.length > 0) {
      await progress.save();
    }
    
    return newAchievements;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};