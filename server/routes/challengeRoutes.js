import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { 
  getChallenges, 
  getUserChallenges, 
  acceptChallenge,
  updateChallengeProgress,
  createChallenge,
  getRandomChallenge, 
  markChallengeComplete 
} from '../controllers/challengeController.js';

const router = express.Router();

// Get all challenges (with user progress if available)
router.get('/', authenticateUser, getChallenges);

// Get user's challenges
router.get('/user', authenticateUser, getUserChallenges);

// Accept a challenge
router.post('/:challengeId/accept', authenticateUser, acceptChallenge);

// Update challenge progress
router.patch('/:challengeId/progress', authenticateUser, updateChallengeProgress);

// Admin routes
router.post('/', authenticateUser, createChallenge);

// Get a random challenge
router.get('/random', getRandomChallenge);

// Mark challenge as complete
router.post('/complete/:id', markChallengeComplete);

export default router;