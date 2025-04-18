import mongoose from 'mongoose';

const pointHistorySchema = new mongoose.Schema({
  points: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['mood_entry', 'challenge_complete', 'streak', 'resource_complete', 'achievement']
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: '000000000000000000000000' // Default user ID for development
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
  challengeCompletionCount: {
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
  lastActive: {
    type: Date,
    default: Date.now
  },
  pointsHistory: [pointHistorySchema]
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;