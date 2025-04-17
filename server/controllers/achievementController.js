import Achievement from '../models/Achievement.js';
import Habit from '../models/Habit.js';
import Mood from '../models/Mood.js';
import Streak from '../models/Streak.js';

// Get all achievements for a user
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const achievements = await Achievement.find({ userId });
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error fetching achievements' });
  }
};

// Check for available achievements
export const checkAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's data
    const moods = await Mood.find({ userId });
    const habits = await Habit.find({ userId });
    const streaks = await Streak.find({ userId });
    const existingAchievements = await Achievement.find({ userId });
    
    const newAchievements = [];
    
    // Define achievement criteria
    const availableAchievements = [
      {
        id: 'mood-logger-1',
        name: 'Beginner Mood Logger',
        description: 'Log your first mood',
        category: 'Mood',
        icon: '📝',
        points: 10,
        condition: () => moods.length >= 1
      },
      {
        id: 'mood-logger-10',
        name: 'Consistent Mood Logger',
        description: 'Log your mood 10 times',
        category: 'Mood',
        icon: '📊',
        points: 30,
        condition: () => moods.length >= 10
      },
      {
        id: 'mood-logger-30',
        name: 'Mood Master',
        description: 'Log your mood 30 times',
        category: 'Mood',
        icon: '🏆',
        points: 50,
        condition: () => moods.length >= 30
      },
      {
        id: 'habit-starter',
        name: 'Habit Starter',
        description: 'Create your first habit',
        category: 'Habit',
        icon: '🌱',
        points: 15,
        condition: () => habits.length >= 1
      },
      {
        id: 'habit-streak-3',
        name: 'Building Momentum',
        description: 'Maintain a 3-day streak for any habit',
        category: 'Streak',
        icon: '🔥',
        points: 25,
        condition: () => habits.some(h => h.currentStreak >= 3)
      },
      {
        id: 'habit-streak-7',
        name: 'Habit Builder',
        description: 'Maintain a 7-day streak for any habit',
        category: 'Streak',
        icon: '⚡',
        points: 40,
        condition: () => habits.some(h => h.currentStreak >= 7)
      },
      {
        id: 'mood-variety',
        name: 'Emotional Awareness',
        description: 'Track 5 different moods',
        category: 'Mood',
        icon: '🎭',
        points: 20,
        condition: () => {
          const uniqueMoods = new Set(moods.map(m => m.mood));
          return uniqueMoods.size >= 5;
        }
      },
      {
        id: 'complete-all-habits',
        name: 'Perfect Day',
        description: 'Complete all active habits in a single day',
        category: 'Habit',
        icon: '🌟',
        points: 35,
        condition: () => {
          if (habits.filter(h => h.status === 'Active').length === 0) return false;
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const activeHabits = habits.filter(h => h.status === 'Active');
          const completedToday = activeHabits.filter(h => 
            h.completedDates.some(date => {
              const completedDate = new Date(date);
              completedDate.setHours(0, 0, 0, 0);
              return completedDate.getTime() === today.getTime();
            })
          );
          
          return completedToday.length === activeHabits.length && activeHabits.length > 0;
        }
      }
    ];
    
    // Check for new achievements
    for (const achievement of availableAchievements) {
      // Skip if already unlocked
      const alreadyUnlocked = existingAchievements.some(a => a.achievementId === achievement.id);
      if (alreadyUnlocked) continue;
      
      // Check if conditions are met
      if (achievement.condition()) {
        // Award the achievement
        const newAchievement = new Achievement({
          userId,
          achievementId: achievement.id,
          name: achievement.name,
          description: achievement.description,
          category: achievement.category,
          icon: achievement.icon,
          pointsAwarded: achievement.points,
          unlockedAt: new Date()
        });
        
        await newAchievement.save();
        newAchievements.push(newAchievement);
      }
    }
    
    res.json({
      newAchievements,
      totalAchievements: existingAchievements.length + newAchievements.length,
      totalPoints: [...existingAchievements, ...newAchievements].reduce((sum, a) => sum + a.pointsAwarded, 0)
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({ message: 'Server error checking achievements' });
  }
};

// Manually award an achievement (admin only)
export const awardAchievement = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const { userId, achievementId, name, description, category, icon, points } = req.body;
    
    // Check if already awarded
    const existing = await Achievement.findOne({ userId, achievementId });
    if (existing) {
      return res.status(400).json({ message: 'Achievement already awarded' });
    }
    
    const achievement = new Achievement({
      userId,
      achievementId,
      name,
      description,
      category,
      icon,
      pointsAwarded: points,
      unlockedAt: new Date()
    });
    
    await achievement.save();
    
    res.status(201).json(achievement);
  } catch (error) {
    console.error('Error awarding achievement:', error);
    res.status(500).json({ message: 'Server error awarding achievement' });
  }
};