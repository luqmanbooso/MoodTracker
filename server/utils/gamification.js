import UserProgress from '../models/UserProgress.js';
import Achievement from '../models/Achievement.js';

/**
 * Update user points and return updated user progress
 */
export const updatePoints = async (userId, points, reason, description) => {
  try {
    // Get or create user progress
    let userProgress = await UserProgress.findOne({ user: userId });
    if (!userProgress) {
      userProgress = new UserProgress({ user: userId });
    }
    
    // Add points
    userProgress.points += points;
    
    // Track points history
    userProgress.pointsHistory.push({
      points,
      reason,
      description,
      date: new Date()
    });
    
    // Update level based on points
    userProgress.level = calculateLevel(userProgress.points);
    
    // Update weekly progress
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const weekKey = `${now.getFullYear()}-${currentWeek.toString().padStart(2, '0')}`;
    
    const weekIndex = userProgress.weeklyProgress.findIndex(w => w.week === weekKey);
    if (weekIndex >= 0) {
      userProgress.weeklyProgress[weekIndex].pointsEarned += points;
    } else {
      userProgress.weeklyProgress.push({
        week: weekKey,
        moodEntries: 0,
        habitsCompleted: 0,
        goalsProgressed: 0,
        pointsEarned: points
      });
    }
    
    await userProgress.save();
    return userProgress;
  } catch (error) {
    console.error('Error updating points:', error);
    throw error;
  }
};

/**
 * Calculate user level based on points
 */
export const calculateLevel = (points) => {
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
  
  return currentLevel;
};

/**
 * Calculate points needed for next level
 */
export const pointsForNextLevel = (points) => {
  const level = calculateLevel(points);
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
  
  if (level >= thresholds.length) {
    // Max level reached, return a value 1000 points higher than current
    return points + 1000;
  }
  
  return thresholds[level] - points;
};

/**
 * Check for and award achievements
 */
export const checkForAchievements = async (userId, type) => {
  try {
    const userProgress = await UserProgress.findOne({ user: userId });
    if (!userProgress) return;
    
    const earnedAchievements = [];
    
    switch (type) {
      case 'mood_entry':
        // Mood entry milestones
        const moodMilestones = [1, 5, 10, 25, 50, 100, 200, 365];
        const count = userProgress.moodEntryCount;
        
        for (const milestone of moodMilestones) {
          if (count === milestone) {
            const achievement = await createAchievement(userId, 'mood_entries', 
              `${milestone} Mood Entries`, 
              `You've tracked ${milestone} moods! Keep it up!`,
              calculateAchievementLevel(milestone),
              calculateAchievementPoints(milestone),
              'mood-tracking'
            );
            
            if (achievement) earnedAchievements.push(achievement);
          }
        }
        break;
        
      case 'streak':
        // Streak milestones
        const streakMilestones = [3, 7, 14, 30, 60, 90, 180, 365];
        const currentStreak = userProgress.currentStreak;
        
        for (const milestone of streakMilestones) {
          if (currentStreak === milestone) {
            const achievement = await createAchievement(userId, 'streaks', 
              `${milestone} Day Streak`, 
              `You've maintained a ${milestone} day streak! Amazing consistency!`,
              calculateAchievementLevel(milestone),
              calculateAchievementPoints(milestone),
              'streak'
            );
            
            if (achievement) earnedAchievements.push(achievement);
          }
        }
        break;
        
      case 'habit_completion':
        // Habit completion milestones
        const habitMilestones = [1, 10, 25, 50, 100, 200, 500];
        const habitCount = userProgress.habitCompletionCount;
        
        for (const milestone of habitMilestones) {
          if (habitCount === milestone) {
            const achievement = await createAchievement(userId, 'habit_completion', 
              `${milestone} Habits Completed`, 
              `You've completed ${milestone} habits! Great discipline!`,
              calculateAchievementLevel(milestone),
              calculateAchievementPoints(milestone),
              'habit-master'
            );
            
            if (achievement) earnedAchievements.push(achievement);
          }
        }
        break;
        
      case 'goal_completion':
        // Goal completion milestones
        const goalMilestones = [1, 3, 5, 10, 20, 50];
        const goalCount = userProgress.goalCompletionCount;
        
        for (const milestone of goalMilestones) {
          if (goalCount === milestone) {
            const achievement = await createAchievement(userId, 'goal_completion', 
              `${milestone} Goals Completed`, 
              `You've completed ${milestone} goals! Amazing progress!`,
              calculateAchievementLevel(milestone),
              calculateAchievementPoints(milestone),
              'goal-achievement'
            );
            
            if (achievement) earnedAchievements.push(achievement);
          }
        }
        break;
        
      case 'resource_usage':
        // Resource usage milestones
        const resourceMilestones = [1, 5, 15, 30, 50];
        const resourceCount = userProgress.resourcesViewedCount;
        
        for (const milestone of resourceMilestones) {
          if (resourceCount === milestone) {
            const achievement = await createAchievement(userId, 'resource_usage', 
              `${milestone} Resources Explored`, 
              `You've explored ${milestone} wellness resources! Keep learning!`,
              calculateAchievementLevel(milestone),
              calculateAchievementPoints(milestone),
              'resource-explorer'
            );
            
            if (achievement) earnedAchievements.push(achievement);
          }
        }
        break;
    }
    
    return earnedAchievements;
  } catch (error) {
    console.error('Error checking for achievements:', error);
    throw error;
  }
};

/**
 * Create a new achievement if it doesn't exist yet
 */
const createAchievement = async (userId, type, title, description, level, points, iconName) => {
  try {
    // Check if achievement already exists
    const existing = await Achievement.findOne({ 
      user: userId,
      type,
      title
    });
    
    if (existing) return null;
    
    // Create new achievement
    const achievement = new Achievement({
      user: userId,
      type,
      title,
      description,
      level,
      points,
      iconName
    });
    
    await achievement.save();
    
    // Award points for earning achievement
    await updatePoints(userId, points, 'achievement', `Earned achievement: ${title}`);
    
    return achievement;
  } catch (error) {
    console.error('Error creating achievement:', error);
    return null;
  }
};

/**
 * Calculate achievement level based on milestone
 */
const calculateAchievementLevel = (milestone) => {
  if (milestone <= 5) return 1;
  if (milestone <= 25) return 2;
  if (milestone <= 100) return 3;
  return 4;
};

/**
 * Calculate points for an achievement based on level
 */
const calculateAchievementPoints = (milestone) => {
  const level = calculateAchievementLevel(milestone);
  return level * 10 + 5;
};

/**
 * Get week number in year
 */
export const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};