import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'milestone', 'special'],
    required: true
  },
  requirements: {
    count: {
      type: Number,
      required: true
    },
    action: {
      type: String,
      required: true
    }
  },
  points: {
    type: Number,
    required: true
  },
  difficultyLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  duration: {
    type: Number, // number of days
    default: null
  },
  icon: {
    type: String,
    default: 'star'
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Challenge', ChallengeSchema);