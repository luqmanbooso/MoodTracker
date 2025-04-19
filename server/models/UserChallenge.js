import mongoose from 'mongoose';

const userChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Compound index to ensure a user can only have one active instance of each challenge
userChallengeSchema.index({ user: 1, challenge: 1 }, { unique: true });

const UserChallenge = mongoose.model('UserChallenge', userChallengeSchema);

export default UserChallenge;