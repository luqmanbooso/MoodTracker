import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String, 
    required: true
  },
  description: String,
  icon: {
    type: String,
    default: '✅'
  },
  category: {
    type: String,
    enum: ['Health', 'Productivity', 'Social', 'Self-Care', 'Other'],
    default: 'Other'
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Custom'],
    default: 'Daily'
  },
  targetDays: {
    type: [Number], // 0-6 representing days of week (0 = Sunday)
    default: [0, 1, 2, 3, 4, 5, 6]
  },
  pointsPerCompletion: {
    type: Number,
    default: 5
  },
  streakBonus: {
    type: Number,
    default: 2 // Additional points per day after 3-day streak
  },
  completedDates: [Date],
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Archived'],
    default: 'Active'
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastCompletedAt: Date
});

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;