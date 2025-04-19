import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
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
    required: true,
    enum: ['daily', 'weekly', 'milestone', 'habit', 'special']
  },
  requirements: {
    count: { type: Number, required: true }, // Number of actions required
    action: { type: String, required: true }, // Type of action (log_mood, use_feature, etc)
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed } // Additional requirements
  },
  points: {
    type: Number,
    default: 10
  },
  duration: { // Time limit to complete (in days)
    type: Number,
    default: null
  },
  difficultyLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  icon: {
    type: String,
    default: 'star'
  },
  relatedAchievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;