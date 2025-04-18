import express from 'express';
import { getMoods, createMood, updateMood, deleteMood } from '../controllers/moodController.js';
// Import the mock user middleware (optional)
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Add mock user to all requests (optional)
router.use(authenticateUser);

// No authentication required routes
router.get('/', getMoods);
router.post('/', createMood);
router.put('/:id', updateMood);
router.delete('/:id', deleteMood);

export default router;