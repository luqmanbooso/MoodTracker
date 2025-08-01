import WellnessJourney from '../models/WellnessJourney.js';
import { updatePoints } from '../utils/gamification.js';

// Get all wellness journey entries for a user
export const getWellnessJourney = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, sort = '-date' } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: 'aiInsights'
    };

    const entries = await WellnessJourney.find({ userId })
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await WellnessJourney.countDocuments({ userId });

    res.json({
      entries: entries.map(entry => entry.toPublicJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching wellness journey:', error);
    res.status(500).json({
      message: 'Failed to fetch wellness journey entries',
      error: error.message
    });
  }
};

// Create a new wellness journey entry
export const createWellnessEntry = async (req, res) => {
  try {
    const { userId } = req.params;
    const entryData = {
      ...req.body,
      userId
    };

    const entry = new WellnessJourney(entryData);
    await entry.save();

    // Award points for wellness check-in
    await updatePoints(userId, 15, 'wellness_check_in', 'Completed wellness check-in');

    // Award bonus points for detailed entries
    if (entry.notes && entry.notes.length > 50) {
      await updatePoints(userId, 5, 'wellness_insight', 'Detailed wellness reflection');
    }

    if (entry.activities && entry.activities.length > 0) {
      await updatePoints(userId, 5, 'self_care_activity', 'Logged wellness activities');
    }

    res.status(201).json({
      message: 'Wellness entry created successfully',
      entry: entry.toPublicJSON()
    });
  } catch (error) {
    console.error('Error creating wellness entry:', error);
    res.status(500).json({
      message: 'Failed to create wellness entry',
      error: error.message
    });
  }
};

// Update a wellness journey entry
export const updateWellnessEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const updateData = req.body;

    const entry = await WellnessJourney.findByIdAndUpdate(
      entryId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        message: 'Wellness entry not found'
      });
    }

    res.json({
      message: 'Wellness entry updated successfully',
      entry: entry.toPublicJSON()
    });
  } catch (error) {
    console.error('Error updating wellness entry:', error);
    res.status(500).json({
      message: 'Failed to update wellness entry',
      error: error.message
    });
  }
};

// Delete a wellness journey entry
export const deleteWellnessEntry = async (req, res) => {
  try {
    const { entryId } = req.params;

    const entry = await WellnessJourney.findByIdAndDelete(entryId);

    if (!entry) {
      return res.status(404).json({
        message: 'Wellness entry not found'
      });
    }

    res.json({
      message: 'Wellness entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting wellness entry:', error);
    res.status(500).json({
      message: 'Failed to delete wellness entry',
      error: error.message
    });
  }
};

// Get wellness analytics
export const getWellnessAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get entries for the period
    const entries = await WellnessJourney.find({
      userId,
      date: { $gte: startDate, $lte: now }
    }).sort({ date: 1 });

    if (entries.length === 0) {
      return res.json({
        analytics: {
          totalEntries: 0,
          averageWellnessScore: 0,
          moodDistribution: {},
          activityAnalysis: {},
          trends: {},
          insights: []
        }
      });
    }

    // Calculate analytics
    const analytics = calculateWellnessAnalytics(entries);

    res.json({
      analytics
    });
  } catch (error) {
    console.error('Error fetching wellness analytics:', error);
    res.status(500).json({
      message: 'Failed to fetch wellness analytics',
      error: error.message
    });
  }
};

// Helper function to calculate wellness analytics
const calculateWellnessAnalytics = (entries) => {
  const totalEntries = entries.length;
  
  // Average wellness score
  const averageWellnessScore = entries.reduce((sum, entry) => sum + entry.wellnessScore, 0) / totalEntries;
  
  // Mood distribution
  const moodDistribution = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});
  
  // Activity analysis
  const activityAnalysis = entries.reduce((acc, entry) => {
    if (entry.activities) {
      entry.activities.forEach(activity => {
        acc[activity] = (acc[activity] || 0) + 1;
      });
    }
    return acc;
  }, {});
  
  // Top activities
  const topActivities = Object.entries(activityAnalysis)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([activity, count]) => ({ activity, count }));
  
  // Trends analysis
  const trends = analyzeTrends(entries);
  
  // Generate insights
  const insights = generateInsights(entries, averageWellnessScore, moodDistribution, topActivities);
  
  return {
    totalEntries,
    averageWellnessScore: averageWellnessScore.toFixed(1),
    moodDistribution,
    activityAnalysis,
    topActivities,
    trends,
    insights
  };
};

// Helper function to analyze trends
const analyzeTrends = (entries) => {
  if (entries.length < 2) return {};
  
  const recentEntries = entries.slice(-7); // Last 7 entries
  const olderEntries = entries.slice(-14, -7); // Previous 7 entries
  
  const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.wellnessScore, 0) / recentEntries.length;
  const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.wellnessScore, 0) / olderEntries.length;
  
  const trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
  const change = Math.abs(recentAvg - olderAvg).toFixed(1);
  
  return {
    trend,
    change,
    recentAverage: recentAvg.toFixed(1),
    olderAverage: olderAvg.toFixed(1)
  };
};

// Helper function to generate insights
const generateInsights = (entries, averageScore, moodDistribution, topActivities) => {
  const insights = [];
  
  // Wellness score insights
  if (averageScore >= 7) {
    insights.push({
      type: 'positive',
      message: 'Your wellness score is excellent! Keep up the great work.',
      icon: '🌟'
    });
  } else if (averageScore >= 5) {
    insights.push({
      type: 'neutral',
      message: 'Your wellness is in a good range. Consider adding more self-care activities.',
      icon: '💪'
    });
  } else {
    insights.push({
      type: 'improvement',
      message: 'Your wellness could use some attention. Try incorporating more positive activities.',
      icon: '🌱'
    });
  }
  
  // Mood insights
  const mostCommonMood = Object.entries(moodDistribution)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (mostCommonMood) {
    if (['Great', 'Good'].includes(mostCommonMood[0])) {
      insights.push({
        type: 'positive',
        message: `You're mostly feeling ${mostCommonMood[0].toLowerCase()}. That's wonderful!`,
        icon: '😊'
      });
    } else {
      insights.push({
        type: 'improvement',
        message: `Your most common mood is ${mostCommonMood[0]}. Consider what might help improve this.`,
        icon: '🤔'
      });
    }
  }
  
  // Activity insights
  if (topActivities.length > 0) {
    const topActivity = topActivities[0];
    insights.push({
      type: 'info',
      message: `Your most common activity is ${topActivity.activity}. This seems to be working well for you!`,
      icon: '🎯'
    });
  }
  
  // Consistency insights
  const daysBetweenEntries = entries.slice(1).map((entry, i) => {
    const prevEntry = entries[i];
    return (entry.date - prevEntry.date) / (1000 * 60 * 60 * 24);
  });
  
  const averageDaysBetween = daysBetweenEntries.reduce((sum, days) => sum + days, 0) / daysBetweenEntries.length;
  
  if (averageDaysBetween <= 1) {
    insights.push({
      type: 'positive',
      message: 'You\'re checking in very consistently! This regular reflection is great for your wellness.',
      icon: '📅'
    });
  } else if (averageDaysBetween <= 3) {
    insights.push({
      type: 'neutral',
      message: 'You\'re checking in regularly. Consider daily check-ins for even better insights.',
      icon: '📊'
    });
  } else {
    insights.push({
      type: 'improvement',
      message: 'Try checking in more frequently to get better wellness insights.',
      icon: '⏰'
    });
  }
  
  return insights;
};

// Get wellness journey statistics
export const getWellnessStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const totalEntries = await WellnessJourney.countDocuments({ userId });
    const entries = await WellnessJourney.find({ userId }).sort({ date: -1 }).limit(100);
    
    if (totalEntries === 0) {
      return res.json({
        stats: {
          totalEntries: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageWellnessScore: 0,
          mostCommonMood: null,
          topActivities: []
        }
      });
    }
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });
      
      if (hasEntry) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < entries.length - 1; i++) {
      const currentDate = new Date(entries[i].date);
      const nextDate = new Date(entries[i + 1].date);
      const daysDiff = (currentDate - nextDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    // Calculate average wellness score
    const averageWellnessScore = entries.reduce((sum, entry) => sum + entry.wellnessScore, 0) / entries.length;
    
    // Most common mood
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
    
    // Top activities
    const activityCounts = entries.reduce((acc, entry) => {
      if (entry.activities) {
        entry.activities.forEach(activity => {
          acc[activity] = (acc[activity] || 0) + 1;
        });
      }
      return acc;
    }, {});
    
    const topActivities = Object.entries(activityCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([activity]) => activity);
    
    res.json({
      stats: {
        totalEntries,
        currentStreak,
        longestStreak,
        averageWellnessScore: averageWellnessScore.toFixed(1),
        mostCommonMood,
        topActivities
      }
    });
  } catch (error) {
    console.error('Error fetching wellness stats:', error);
    res.status(500).json({
      message: 'Failed to fetch wellness statistics',
      error: error.message
    });
  }
}; 