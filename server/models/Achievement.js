import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  achievementId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  category: {
    type: String,
    enum: ['Mood', 'Habit', 'Challenge', 'Streak', 'Engagement', 'Special']
  },
  pointsAwarded: {
    type: Number,
    default: 20
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    current: Number,
    target: Number
  },
  isSecret: {
    type: Boolean,
    default: false
  }
});

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;