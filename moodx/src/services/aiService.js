import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai';

// Create an axios instance with auth token
const createAuthenticatedAxios = () => {
  const token = localStorage.getItem('token');
  const instance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });
  return instance;
};

// Enhanced AI service for wellness coaching and insights
export const aiService = {
  // Generate personalized wellness response
  async generateWellnessResponse(userMessage, userContext) {
    try {
      console.log('Attempting to call AI backend...');
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.post(`${API_URL}/wellness-coach`, {
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
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.post(`${API_URL}/mood-insights`, {
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
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.post(`${API_URL}/recommendations`, {
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
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.post(`${API_URL}/weekly-summary`, {
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
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.post(`${API_URL}/habit-suggestions`, {
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
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.post(`${API_URL}/goal-recommendations`, {
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
  },

  // Get all todos
  async getTodos() {
    try {
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.get(`/api/todos`);
      return response.data;
    } catch (error) {
      console.error('Error getting todos:', error);
      throw new Error('Unable to get todos at this time.');
    }
  },

  // Add a new todo
  async addTodo(todoData) {
    try {
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.post(`/api/todos`, todoData);
      return response.data;
    } catch (error) {
      console.error('Error adding todo:', error);
      throw new Error('Unable to add todo at this time.');
    }
  },

  // Generate personalized todo recommendations
  async generateTodoRecommendations(userContext) {
    try {
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.post(`/api/todos/todo-recommendations`, {
        moods: userContext.moods || [],
        habits: userContext.habits || [],
        goals: userContext.goals || [],
        wellnessScore: userContext.wellnessScore || 0,
        currentTodos: userContext.currentTodos || []
      });
      return response.data;
    } catch (error) {
      console.error('Error generating todo recommendations:', error);
      throw new Error('Unable to generate todo recommendations at this time.');
    }
  },

  // Track todo completion for AI analysis
  async trackTodoCompletion(data) {
    try {
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.post(`/api/todos/track-todo-completion`, {
        todoId: data.todoId,
        completedAt: data.completedAt,
        userContext: data.userContext
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking todo completion:', error);
      throw new Error('Unable to track todo completion at this time.');
    }
  },

  // Delete a todo
  async deleteTodo(todoId) {
    try {
      const axiosInstance = createAuthenticatedAxios();
      const response = await axiosInstance.delete(`/api/todos/${todoId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw new Error('Unable to delete todo at this time.');
    }
  }
};

export default aiService;