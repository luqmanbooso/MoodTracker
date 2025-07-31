import express from 'express';
import { 
  getProgress, 
  awardPoints, 
  getActivities,
  getAchievements,
  getStats
} from '../controllers/progressController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// All progress routes require authentication
router.use(verifyToken);

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