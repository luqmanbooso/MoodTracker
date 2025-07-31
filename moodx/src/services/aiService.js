import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai';

// Enhanced AI service for wellness coaching and insights
export const aiService = {
  // Generate personalized wellness response
  async generateWellnessResponse(userMessage, userContext) {
    try {
      console.log('Attempting to call AI backend...');
      const response = await axios.post(`${API_URL}/wellness-coach`, {
        message: userMessage,
        context: {
          moods: userContext.moods || [],
          habits: userContext.habits || [],
          goals: userContext.goals || [],
          recentActivity: userContext.recentActivity || [],
          wellnessScore: userContext.wellnessScore || 0,
          interactionCount: userContext.interactionCount || 0,
          needsIntervention: userContext.needsIntervention || false
        }
      });
      console.log('AI backend response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating wellness response:', error);
      throw new Error('AI service is currently unavailable. Please try again later.');
    }
  },

  // Generate mood insights and analysis
  async generateMoodInsights(moods, habits, goals) {
    try {
      const response = await axios.post(`${API_URL}/mood-insights`, {
        moods,
        habits,
        goals
      });
      return response.data;
    } catch (error) {
      console.error('Error generating mood insights:', error);
      throw new Error('Unable to generate insights at this time.');
    }
  },

  // Generate personalized recommendations
  async generateRecommendations(userData) {
    try {
      const response = await axios.post(`${API_URL}/recommendations`, {
        currentMood: userData.currentMood,
        moodHistory: userData.moodHistory,
        habits: userData.habits,
        goals: userData.goals,
        triggers: userData.triggers,
        activities: userData.activities
      });
      return response.data;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Unable to generate recommendations at this time.');
    }
  },

  // Generate weekly wellness summary
  async generateWeeklySummary(moods, habits, goals) {
    try {
      const response = await axios.post(`${API_URL}/weekly-summary`, {
        moods,
        habits,
        goals
      });
      return response.data;
    } catch (error) {
      console.error('Error generating weekly summary:', error);
      throw new Error('Unable to generate weekly summary at this time.');
    }
  },

  // Generate habit suggestions
  async generateHabitSuggestions(userProfile) {
    try {
      const response = await axios.post(`${API_URL}/habit-suggestions`, {
        currentHabits: userProfile.habits,
        goals: userProfile.goals,
        moodPatterns: userProfile.moodPatterns,
        lifestyle: userProfile.lifestyle
      });
      return response.data;
    } catch (error) {
      console.error('Error generating habit suggestions:', error);
      throw new Error('Unable to generate habit suggestions at this time.');
    }
  },

  // Generate goal recommendations
  async generateGoalRecommendations(userProfile) {
    try {
      const response = await axios.post(`${API_URL}/goal-recommendations`, {
        currentGoals: userProfile.goals,
        moodHistory: userProfile.moodHistory,
        habits: userProfile.habits,
        interests: userProfile.interests
      });
      return response.data;
    } catch (error) {
      console.error('Error generating goal recommendations:', error);
      throw new Error('Unable to generate goal recommendations at this time.');
    }
  }
};

export default aiService;