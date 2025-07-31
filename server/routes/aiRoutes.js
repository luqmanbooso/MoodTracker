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
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Legacy chat endpoint (requires authentication)
router.post('/chat', verifyToken, getAIResponse);

// Enhanced wellness coaching endpoint (requires authentication)
router.post('/wellness-coach', verifyToken, generateWellnessResponse);

// Mood insights and analysis (requires authentication)
router.post('/mood-insights', verifyToken, generateMoodInsights);

// Personalized recommendations (requires authentication)
router.post('/recommendations', verifyToken, generateRecommendations);

// Weekly wellness summary (requires authentication)
router.post('/weekly-summary', verifyToken, generateWeeklySummary);

// Habit suggestions (requires authentication)
router.post('/habit-suggestions', verifyToken, generateHabitSuggestions);

// Goal recommendations (requires authentication)
router.post('/goal-recommendations', verifyToken, generateGoalRecommendations);

export default router;