import express from 'express';
import * as achievementController from '../controllers/achievementController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all achievements for user
router.get('/', achievementController.getAchievements);

// Check for new achievements
router.post('/check', achievementController.checkAchievements);

// Admin route to manually award achievement
router.post('/award', achievementController.awardAchievement);

export default router;