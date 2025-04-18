import express from 'express';
import { getGoals, createGoal, updateProgress, updateGoal, deleteGoal } from '../controllers/goalController.js';
// Import the mock user middleware (optional)
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Add mock user to all requests (optional)
router.use(authenticateUser);

// No authentication required routes
router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:goalId/progress', updateProgress);
router.put('/:goalId', updateGoal);
router.delete('/:goalId', deleteGoal);

export default router;