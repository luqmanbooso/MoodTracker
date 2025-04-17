import Habit from '../models/Habit.js';
import Streak from '../models/Streak.js';
import Achievement from '../models/Achievement.js';
import { calculateStreak, checkStreakAchievements } from '../utils/streakUtils.js';

// Get all habits for a user
export const getHabits = async (req, res) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.find({ userId });
    res.json(habits);
  } catch (error) {
    console.error('Error getting habits:', error);
    res.status(500).json({ message: 'Server error fetching habits' });
  }
};

// Create a new habit
export const createHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, icon, category, frequency, targetDays, pointsPerCompletion } = req.body;
    
    const habit = new Habit({
      userId,
      name,
      description,
      icon: icon || '✅',
      category: category || 'Other',
      frequency: frequency || 'Daily',
      targetDays: targetDays || [0, 1, 2, 3, 4, 5, 6],
      pointsPerCompletion: pointsPerCompletion || 5
    });
    
    const savedHabit = await habit.save();
    
    res.status(201).json(savedHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Server error creating habit' });
  }
};

// Mark a habit as completed for today
export const completeHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;
    
    // Find the habit
    const habit = await Habit.findOne({ _id: habitId, userId });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if already completed today
    const alreadyCompletedToday = habit.completedDates.some(date => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
    
    if (alreadyCompletedToday) {
      return res.status(400).json({ message: 'Habit already completed today' });
    }
    
    // Add today to completed dates
    habit.completedDates.push(new Date());
    habit.lastCompletedAt = new Date();
    
    // Calculate current streak
    const { currentStreak, longestStreak } = calculateStreak(habit.completedDates);
    habit.currentStreak = currentStreak;
    habit.longestStreak = Math.max(longestStreak, habit.longestStreak);
    
    // Calculate points earned
    let pointsEarned = habit.pointsPerCompletion;
    
    // Streak bonus
    if (habit.currentStreak >= 3) {
      pointsEarned += habit.streakBonus;
    }
    
    // Save habit
    await habit.save();
    
    // Check for streak-related achievements
    const unlockedAchievements = await checkStreakAchievements(userId, 'Habit', habitId, habit.currentStreak);
    
    res.json({
      message: 'Habit completed',
      habit,
      pointsEarned,
      unlockedAchievements
    });
  } catch (error) {
    console.error('Error completing habit:', error);
    res.status(500).json({ message: 'Server error completing habit' });
  }
};

// Get habit statistics
export const getHabitStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Aggregate stats
    const habits = await Habit.find({ userId });
    
    const stats = {
      total: habits.length,
      active: habits.filter(h => h.status === 'Active').length,
      completedToday: 0,
      longestStreak: 0,
      totalCompleted: 0,
      completionRate: 0
    };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    habits.forEach(habit => {
      // Check if completed today
      const completedToday = habit.completedDates.some(date => {
        const completedDate = new Date(date);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === today.getTime();
      });
      
      if (completedToday) {
        stats.completedToday++;
      }
      
      // Track longest streak
      stats.longestStreak = Math.max(stats.longestStreak, habit.longestStreak);
      
      // Count total completions
      stats.totalCompleted += habit.completedDates.length;
    });
    
    // Calculate completion rate (for last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });
    
    const activeHabits = habits.filter(h => h.status === 'Active');
    if (activeHabits.length > 0) {
      let possibleCompletions = 0;
      let actualCompletions = 0;
      
      activeHabits.forEach(habit => {
        last7Days.forEach(day => {
          const dayOfWeek = new Date(day).getDay();
          // Check if this habit should be done on this day
          if (habit.targetDays.includes(dayOfWeek)) {
            possibleCompletions++;
            
            // Check if it was completed
            const wasCompleted = habit.completedDates.some(date => {
              const completedDate = new Date(date);
              completedDate.setHours(0, 0, 0, 0);
              return completedDate.getTime() === day;
            });
            
            if (wasCompleted) {
              actualCompletions++;
            }
          }
        });
      });
      
      stats.completionRate = possibleCompletions > 0 
        ? Math.round((actualCompletions / possibleCompletions) * 100)
        : 0;
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting habit stats:', error);
    res.status(500).json({ message: 'Server error fetching habit statistics' });
  }
};

// Delete a habit
export const deleteHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;
    
    const result = await Habit.findOneAndDelete({ _id: habitId, userId });
    
    if (!result) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Server error deleting habit' });
  }
};

// Update a habit
export const updateHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;
    const updates = req.body;
    
    // Find the habit and update it
    const habit = await Habit.findOneAndUpdate(
      { _id: habitId, userId },
      updates,
      { new: true }
    );
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    res.json(habit);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ message: 'Server error updating habit' });
  }
};