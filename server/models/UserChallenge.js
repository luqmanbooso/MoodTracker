import mongoose from 'mongoose';

const UserChallengeSchema = new mongoose.Schema({
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
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  assignedDate: {
    type: Date,
    default: Date.now
  }
});

const UserChallenge = mongoose.models.UserChallenge || mongoose.model('UserChallenge', UserChallengeSchema);
export default UserChallenge;