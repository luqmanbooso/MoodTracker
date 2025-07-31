import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  user: {
    type: String,
    default: '000000000000000000000000' // Default user since no auth
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['mindfulness', 'exercise', 'social', 'self-care', 'wellness', 'nutrition', 'sleep'],
    default: 'wellness'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  estimatedTime: {
    type: String,
    default: '15 minutes'
  },
  pointsReward: {
    type: Number,
    default: 10
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  wellnessImpact: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'positive'
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Todo', todoSchema); 