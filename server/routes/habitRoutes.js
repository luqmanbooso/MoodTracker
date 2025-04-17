import express from 'express';
import * as habitController from '../controllers/habitController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all habits for user
router.get('/', habitController.getHabits);

// Create a new habit
router.post('/', habitController.createHabit);

// Mark a habit as complete
router.post('/:habitId/complete', habitController.completeHabit);

// Get habit statistics
router.get('/stats', habitController.getHabitStats);

// Update a habit
router.put('/:habitId', habitController.updateHabit);

// Delete a habit
router.delete('/:habitId', habitController.deleteHabit);

export default router;