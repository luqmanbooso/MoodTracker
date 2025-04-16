import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  url: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  categories: [{
    type: String,
    enum: ['anxiety', 'depression', 'stress', 'sleep', 'mindfulness', 'crisis', 'general']
  }],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Resource', ResourceSchema);