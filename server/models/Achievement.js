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
    enum: ['mood_entries', 'streaks', 'challenge_completion', 'resource_usage']
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
    default: 1
  },
  points: {
    type: Number,
    default: 10
  },
  iconName: {
    type: String,
    default: 'emoji_events'
  },
  earnedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;