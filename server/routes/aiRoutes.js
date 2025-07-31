import express from 'express';
import { 
  getAIResponse,
  generateWellnessResponse,
  generateMoodInsights,
  generateRecommendations,
  generateWeeklySummary,
  generateHabitSuggestions,
  generateGoalRecommendations
} from '../controllers/aiController.js';

const router = express.Router();

// Legacy chat endpoint
router.post('/chat', getAIResponse);

// Enhanced wellness coaching endpoint
router.post('/wellness-coach', generateWellnessResponse);

// Mood insights and analysis
router.post('/mood-insights', generateMoodInsights);

// Personalized recommendations
router.post('/recommendations', generateRecommendations);

// Weekly wellness summary
router.post('/weekly-summary', generateWeeklySummary);

// Habit suggestions
router.post('/habit-suggestions', generateHabitSuggestions);

// Goal recommendations
router.post('/goal-recommendations', generateGoalRecommendations);

export default router;