import Progress from '../models/Progress.js';

// Get user progress
export const getProgress = async (req, res) => {
  try {
    // Get user ID from auth (required)
    const userId = req.userId;
    
    let progress = await Progress.findOne({ user: userId });
    
    // If no progress record exists yet, create one
    if (!progress) {
      progress = new Progress({
        user: userId
      });
      await progress.save();
    }
    
    // Return the progress data
    res.json({
      points: progress.points,
      level: progress.level,
      pointsToNextLevel: (progress.level * 100) - progress.points,
      moodEntryCount: progress.moodEntryCount,
      habitCompletionCount: progress.habitCompletionCount,
      goalCompletionCount: progress.goalCompletionCount,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Award points to user
export const awardPoints = async (req, res) => {
  try {
    console.log('Received points award request:', req.body);
    
    const { points, type, description } = req.body;
    
    // Validate required fields
    if (!points || !type || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['points', 'type', 'description'],
        received: req.body
      });
    }
    
    // Get user ID from auth (required)
    const userId = req.userId;
    
    let progress = await Progress.findOne({ user: userId });
    
    // If no progress record exists yet, create one
    if (!progress) {
      progress = new Progress({
        user: userId
      });
    }
    
    // Calculate new values
    const pointsNum = parseInt(points);
    const newPoints = progress.points + pointsNum;
    const oldLevel = progress.level;
    const newLevel = Math.floor(newPoints / 100) + 1;
    
    // Update counters based on type
    switch(type) {
      case 'mood_entry':
        progress.moodEntryCount += 1;
        break;
      case 'habit_complete':
        progress.habitCompletionCount += 1;
        break;
      case 'goal_complete':
        progress.goalCompletionCount += 1;
        break;
      case 'goal_progress':
        progress.goalProgressCount += 1;
        break;
    }
    
    // Add to point history
    progress.pointsHistory.push({
      points: pointsNum,
      reason: type,
      description,
      date: new Date()
    });
    
    // Update total points and level
    progress.points = newPoints;
    progress.level = newLevel;
    
    // Update last active time
    progress.lastActive = new Date();
    
    // Save changes
    await progress.save();
    
    // Return updated progress
    res.json({
      points: progress.points,
      level: progress.level,
      leveledUp: newLevel > oldLevel,
      pointsAwarded: pointsNum,
      pointsToNextLevel: (newLevel * 100) - newPoints
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user activities
export const getActivities = async (req, res) => {
  try {
    const defaultUserId = '000000000000000000000000';
    const progress = await Progress.findOne({ user: defaultUserId });
    
    if (!progress) {
      return res.json([]);
    }
    
    const recentActivities = progress.pointsHistory
      .sort((a, b) => b.date - a.date)
      .slice(0, 10);
    
    res.json(recentActivities);
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user achievements
export const getAchievements = async (req, res) => {
  try {
    const defaultUserId = '000000000000000000000000';
    const progress = await Progress.findOne({ user: defaultUserId });
    
    if (!progress) {
      return res.json([]);
    }
    
    // Generate achievements based on progress
    const achievements = [];
    
    // Mood entry achievements
    if (progress.moodEntryCount >= 1) achievements.push({ id: 'first_mood', name: 'First Entry', description: 'Logged your first mood', earned: true });
    if (progress.moodEntryCount >= 7) achievements.push({ id: 'week_streak', name: 'Week Warrior', description: 'Logged moods for 7 days', earned: true });
    if (progress.moodEntryCount >= 30) achievements.push({ id: 'month_master', name: 'Month Master', description: 'Logged moods for 30 days', earned: true });
    
    // Level achievements
    if (progress.level >= 2) achievements.push({ id: 'level_2', name: 'Getting Started', description: 'Reached level 2', earned: true });
    if (progress.level >= 5) achievements.push({ id: 'level_5', name: 'Halfway There', description: 'Reached level 5', earned: true });
    if (progress.level >= 10) achievements.push({ id: 'level_10', name: 'Master Tracker', description: 'Reached level 10', earned: true });
    
    // Streak achievements
    if (progress.currentStreak >= 3) achievements.push({ id: 'streak_3', name: 'Consistent', description: '3-day mood streak', earned: true });
    if (progress.currentStreak >= 7) achievements.push({ id: 'streak_7', name: 'Dedicated', description: '7-day mood streak', earned: true });
    if (progress.longestStreak >= 14) achievements.push({ id: 'streak_14', name: 'Unstoppable', description: '14-day mood streak', earned: true });
    
    res.json(achievements);
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user stats
export const getStats = async (req, res) => {
  try {
    const defaultUserId = '000000000000000000000000';
    const progress = await Progress.findOne({ user: defaultUserId });
    
    if (!progress) {
      return res.json({
        totalMoodEntries: 0,
        averageMoodScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
        level: 1,
        completionRate: 0
      });
    }
    
    // Calculate stats
    const stats = {
      totalMoodEntries: progress.moodEntryCount,
      averageMoodScore: progress.moodEntryCount > 0 ? Math.round(progress.points / progress.moodEntryCount) : 0,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      totalPoints: progress.points,
      level: progress.level,
      completionRate: progress.moodEntryCount > 0 ? Math.round((progress.moodEntryCount / (progress.moodEntryCount + 10)) * 100) : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};