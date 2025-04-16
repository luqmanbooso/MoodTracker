import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['physical', 'mindfulness', 'health', 'social', 'environment'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Challenge', ChallengeSchema);