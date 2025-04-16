import express from 'express';
import { getMoods, createMood, updateMood, deleteMood } from '../controllers/moodController.js';

const router = express.Router();

// Get all moods
router.get('/', getMoods);

// Create a new mood
router.post('/', createMood);

// Update a mood
router.put('/:id', updateMood);

// Delete a mood
router.delete('/:id', deleteMood);

export default router;