import express from 'express';
import { getUserProgress, getAchievements, getUserStats } from '../controllers/progressController.js';
// Import the mock user middleware (optional)
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Add mock user to all requests (optional)
router.use(authenticateUser);

// No authentication required routes
router.get('/', getUserProgress);
router.get('/achievements', getAchievements);
router.get('/stats', getUserStats);

export default router;