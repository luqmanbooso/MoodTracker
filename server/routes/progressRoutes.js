import express from 'express';
import { 
  getUserProgress, 
  getAchievements, 
  getUserStats,
  awardPoints
} from '../controllers/progressController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Add mock user to all requests (optional)
router.use(authenticateUser);

// Get user progress
router.get('/', getUserProgress);

// Get all user achievements
router.get('/achievements', getAchievements);

// Get user stats
router.get('/stats', getUserStats);

// Award points to user
router.post('/points', awardPoints);

export default router;