import axios from 'axios';

const API_URL = 'http://localhost:5000/api/progress';

/**
 * Get user progress including points, level, etc.
 */
export const getProgress = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error getting user progress:', error);
    // Return default values to prevent UI errors
    return {
      points: 0,
      level: 1,
      pointsToNextLevel: 100,
      moodEntryCount: 0,
      habitCompletionCount: 0,
      goalCompletionCount: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }
};

/**
 * Award points to the user
 */
export const awardPoints = async (points, reason, description) => {
  try {
    console.log('Awarding points payload:', { points, reason, description });

    const payload = {
      points,
      type: reason, // Server expects "type" rather than "reason"
      description,
    };

    const response = await axios.post(`${API_URL}/points`, payload);
    return response.data;
  } catch (error) {
    console.error('Error awarding points:', error);

    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }

    throw new Error(`Failed to award points: ${error.response?.status || error.message}`);
  }
};

/**
 * Get user's achievements
 */
export const getAchievements = async () => {
  try {
    const response = await axios.get(`${API_URL}/achievements`);
    return response.data;
  } catch (error) {
    console.error('Error getting achievements:', error);
    return []; // Return empty array to prevent UI errors
  }
};

/**
 * Get user stats (detailed statistics for dashboard)
 */
export const getStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error getting user stats:', error);
    // Return default stats to prevent UI errors
    return {
      totalEntries: 0,
      streak: { current: 0, longest: 0 },
      completions: { habits: 0, goals: 0, challenges: 0 },
      points: 0,
      level: 1,
      weeklyData: [],
    };
  }
};

/**
 * Get user's recent activities
 */
export const getRecentActivities = async () => {
  try {
    const response = await axios.get(`${API_URL}/activities`);
    return response.data;
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return []; // Return empty array to prevent UI errors
  }
};