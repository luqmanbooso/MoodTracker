import express from 'express';
import { getMoods, createMood, updateMood, deleteMood } from '../controllers/moodController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// All mood routes require authentication
router.use(verifyToken);

// Mood routes (require authentication)
router.get('/', getMoods);
router.post('/', createMood);
router.put('/:id', updateMood);
router.delete('/:id', deleteMood);

export default router;