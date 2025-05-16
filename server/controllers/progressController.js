import Progress from '../models/Progress.js';

// Get user progress
export const getProgress = async (req, res) => {
  try {
    // Since we're not implementing auth, use default user
    const defaultUserId = '000000000000000000000000';
    
    let progress = await Progress.findOne({ user: defaultUserId });
    
    // If no progress record exists yet, create one
    if (!progress) {
      progress = new Progress({
        user: defaultUserId
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
    
    // Since we're not implementing auth, use default user
    const defaultUserId = '000000000000000000000000';
    
    let progress = await Progress.findOne({ user: defaultUserId });
    
    // If no progress record exists yet, create one
    if (!progress) {
      progress = new Progress({
        user: defaultUserId
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