import mongoose from 'mongoose';

const MoodSchema = new mongoose.Schema({
  mood: {
    type: String,
    required: true,
    enum: ['Great', 'Good', 'Okay', 'Bad', 'Terrible']
  },
  customMood: {
    type: String,
    maxlength: 30
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  note: {
    type: String,
    required: false,
    maxlength: 500
  },
  activities: [{
    type: String
  }],
  tags: [{
    type: String,
    maxlength: 20
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Mood', MoodSchema);