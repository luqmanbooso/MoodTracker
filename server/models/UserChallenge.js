import mongoose from 'mongoose';

const UserChallengeSchema = new mongoose.Schema({
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  title: String,
  description: String,
  isCompleted: {
    type: Boolean,
    default: false
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  completedDate: Date
});

export default mongoose.model('UserChallenge', UserChallengeSchema);