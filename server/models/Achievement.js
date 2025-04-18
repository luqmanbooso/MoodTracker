import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['mood_entries', 'streaks', 'habit_completion', 'goal_completion', 'resource_usage', 'category_variety'],
    required: true
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
  earnedDate: {
    type: Date,
    default: Date.now
  },
  iconName: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);