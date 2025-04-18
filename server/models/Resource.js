import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['meditation', 'exercise', 'reading', 'nutrition', 'therapy', 'sleep', 'community', 'other']
  },
  content: {
    type: String
  },
  imageUrl: {
    type: String
  },
  link: {
    type: String
  },
  tags: [String],
  duration: String,
  featured: {
    type: Boolean,
    default: false
  },
  pointsForCompletion: {
    type: Number,
    default: 5
  },
  recommendedFor: [String], // mood types this resource is good for
  viewCount: {
    type: Number,
    default: 0
  },
  completionCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);