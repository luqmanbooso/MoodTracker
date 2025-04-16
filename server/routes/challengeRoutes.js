import express from 'express';
import { getChallenges, getRandomChallenge, markChallengeComplete } from '../controllers/challengeController.js';

const router = express.Router();

// Get all challenges
router.get('/', getChallenges);

// Get a random challenge
router.get('/random', getRandomChallenge);

// Mark challenge as complete
router.post('/complete/:id', markChallengeComplete);

export default router;