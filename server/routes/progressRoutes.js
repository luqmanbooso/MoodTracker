import express from 'express';
import { 
  getProgress, 
  awardPoints, 
  getActivities,
  getAchievements,
  getStats
} from '../controllers/progressController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Add mock user to all requests (optional)
router.use(authenticateUser);

// Get user progress
router.get('/', getProgress);

// Award points to user
router.post('/points', awardPoints);

// Get user's recent activities
router.get('/activities', getActivities);

// Get user achievements
router.get('/achievements', getAchievements);

// Get user stats
router.get('/stats', getStats);

export default router;