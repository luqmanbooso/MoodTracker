import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: '000000000000000000000000' // Default user ID for development
  },
  type: {
    type: String,
    required: true,
    enum: ['mood_entries', 'streaks', 'habit_completion', 'goal_completion', 'challenge_completion', 'resource_usage']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  points: {
    type: Number,
    required: true,
    default: 10
  },
  iconName: {
    type: String,
    default: 'trophy'
  },
  earnedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;