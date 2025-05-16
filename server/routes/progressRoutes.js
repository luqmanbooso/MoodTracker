import express from 'express';
import { 
  getProgress, 
  awardPoints, 
  getActivities 
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

export default router;