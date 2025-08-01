import mongoose from 'mongoose';

const pointHistorySchema = new mongoose.Schema({
  points: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'mood_entry', 
      'challenge_complete', 
      'habit_complete', 
      'goal_progress', 
      'goal_complete', 
      'streak', 
      'resource_complete', 
      'achievement',
      'wellness_check_in',
      'wellness_insight',
      'self_care_activity',
      'mental_health_goal',
      'stress_management',
      'mindfulness_practice',
      'emotional_awareness',
      'positive_habit',
      'wellness_reflection',
      'coping_strategy',
      'social_connection',
      'physical_wellness'
    ]
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
  habitCompletionCount: {
    type: Number,
    default: 0
  },
  goalCompletionCount: {
    type: Number,
    default: 0
  },
  goalProgressCount: {
    type: Number,
    default: 0
  },
  challengeCompletionCount: {
    type: Number,
    default: 0
  },
  resourceViewCount: {
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
    type: Date
  },
  pointsHistory: [pointHistorySchema],
  weeklyProgress: [{
    week: String, // Format: YYYY-WW
    moodEntries: Number,
    habitsCompleted: Number,
    goalsProgressed: Number,
    pointsEarned: Number
  }],
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }]
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;