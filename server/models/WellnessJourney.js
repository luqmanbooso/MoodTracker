import mongoose from 'mongoose';

const wellnessJourneySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: String,
    required: true,
    enum: ['Great', 'Good', 'Okay', 'Bad', 'Terrible']
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  activities: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  wellnessScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  sleepQuality: {
    type: Number,
    min: 1,
    max: 10
  },
  socialConnections: {
    type: Number,
    min: 1,
    max: 10
  },
  selfCareActivities: [{
    type: String,
    trim: true
  }],
  challenges: [{
    type: String,
    trim: true
  }],
  gratitude: [{
    type: String,
    trim: true
  }],
  goals: [{
    type: String,
    trim: true
  }],
  insights: {
    type: String,
    maxlength: 500,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  weather: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  aiInsights: {
    summary: String,
    recommendations: [String],
    patterns: [String],
    moodTrend: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
wellnessJourneySchema.index({ userId: 1, date: -1 });
wellnessJourneySchema.index({ userId: 1, mood: 1 });
wellnessJourneySchema.index({ userId: 1, 'activities': 1 });

// Virtual for formatted date
wellnessJourneySchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Method to calculate wellness score
wellnessJourneySchema.methods.calculateWellnessScore = function() {
  const moodScores = {
    'Great': 9,
    'Good': 7,
    'Okay': 5,
    'Bad': 3,
    'Terrible': 1
  };
  
  let score = moodScores[this.mood] || 5;
  
  // Adjust based on intensity
  if (this.intensity >= 8) score += 1;
  else if (this.intensity <= 3) score -= 1;
  
  // Adjust based on activities
  if (this.activities && this.activities.length > 0) {
    const positiveActivities = ['Exercise', 'Meditation', 'Reading', 'Social', 'Creative'];
    const positiveCount = this.activities.filter(activity => 
      positiveActivities.some(pos => activity.toLowerCase().includes(pos.toLowerCase()))
    ).length;
    score += positiveCount * 0.5;
  }
  
  // Adjust based on notes length (engagement)
  if (this.notes && this.notes.length > 50) score += 0.5;
  
  return Math.min(10, Math.max(0, score));
};

// Pre-save middleware to calculate wellness score
wellnessJourneySchema.pre('save', function(next) {
  if (this.isModified('mood') || this.isModified('intensity') || this.isModified('activities') || this.isModified('notes')) {
    this.wellnessScore = this.calculateWellnessScore();
  }
  next();
});

// Method to get public data
wellnessJourneySchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    date: this.date,
    formattedDate: this.formattedDate,
    mood: this.mood,
    intensity: this.intensity,
    activities: this.activities,
    notes: this.notes,
    tags: this.tags,
    wellnessScore: this.wellnessScore,
    energyLevel: this.energyLevel,
    stressLevel: this.stressLevel,
    sleepQuality: this.sleepQuality,
    socialConnections: this.socialConnections,
    selfCareActivities: this.selfCareActivities,
    challenges: this.challenges,
    gratitude: this.gratitude,
    goals: this.goals,
    insights: this.insights,
    location: this.location,
    weather: this.weather,
    aiInsights: this.aiInsights,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const WellnessJourney = mongoose.model('WellnessJourney', wellnessJourneySchema);

export default WellnessJourney; 