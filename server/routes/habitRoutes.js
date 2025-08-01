import express from 'express';
import { getHabits, createHabit, completeHabit, updateHabit, deleteHabit } from '../controllers/habitController.js';
// Import the mock user middleware (optional)
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Add mock user to all requests (optional)
router.use(authenticateUser);

// No authentication required routes
router.get('/', getHabits);
router.post('/', createHabit);
router.post('/:habitId/complete', completeHabit);
router.put('/:habitId', updateHabit);
router.delete('/:habitId', deleteHabit);

export default router;