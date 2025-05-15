import mongoose from 'mongoose';

const UserChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // Add this index to improve query performance
    index: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Add a validator for the user field to handle invalid ObjectIds gracefully
UserChallengeSchema.path('user').validate(function(value) {
  // If the value is already an ObjectId, it's valid
  if (value instanceof mongoose.Types.ObjectId) return true;
  
  // Otherwise check if it can be cast to a valid ObjectId
  try {
    new mongoose.Types.ObjectId(value.toString());
    return true;
  } catch (error) {
    return false;
  }
});

export default mongoose.model('UserChallenge', UserChallengeSchema);