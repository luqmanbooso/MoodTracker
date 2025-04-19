import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  type: {
    type: String,
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
    min: 1,
    max: 5,
    default: 1
  },
  points: {
    type: Number,
    default: 0
  },
  iconName: {
    type: String,
    default: 'award'
  },
  earnedDate: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

const Achievement = mongoose.model('Achievement', AchievementSchema);

export default Achievement;