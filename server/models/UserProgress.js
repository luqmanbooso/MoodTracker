import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  moodEntryCount: {
    type: Number,
    default: 0
  },
  habitCompletionCount: {
    type: Number,
    default: 0
  },
  goalCompletionCount: {
    type: Number,
    default: 0
  },
  resourcesViewedCount: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastMoodEntry: {
    type: Date
  },
  pointsHistory: [
    {
      points: Number,
      reason: String,
      description: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  weeklyProgress: [
    {
      week: String, // Format: YYYY-WW (e.g., 2025-16)
      moodEntries: {
        type: Number,
        default: 0
      },
      habitsCompleted: {
        type: Number,
        default: 0
      },
      goalsProgressed: {
        type: Number,
        default: 0
      },
      pointsEarned: {
        type: Number,
        default: 0
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model('UserProgress', userProgressSchema);