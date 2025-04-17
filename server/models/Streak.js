import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['MoodLogging', 'Habit', 'Challenge', 'Login'],
    required: true
  },
  targetId: {
    type: String, // habitId or challengeId if applicable
    default: null
  },
  currentStreak: {
    type: Number,
    default: 1
  },
  longestStreak: {
    type: Number,
    default: 1
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  streakHistory: [
    {
      date: Date,
      count: Number
    }
  ]
});

const Streak = mongoose.model('Streak', streakSchema);
export default Streak;