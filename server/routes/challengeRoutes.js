import express from 'express';
import { 
  getChallenges, 
  getUserChallenges, 
  acceptChallenge,
  updateChallengeProgress,
  createChallenge,
  markChallengeComplete,
  getRandomChallenge
} from '../controllers/challengeController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get all challenges - modified to work without auth for testing
router.get('/', getChallenges);

// Get user's challenges
router.get('/user', getUserChallenges);

// Get a random challenge
router.get('/random', getRandomChallenge);

// Accept a challenge
router.post('/:challengeId/accept', acceptChallenge);

// Update challenge progress
router.patch('/:challengeId/progress', updateChallengeProgress);

// Mark challenge as complete
router.post('/:challengeId/complete', markChallengeComplete);

// Create a new challenge
router.post('/', createChallenge);

// Add this route to your challenge routes:
router.get('/init', async (req, res) => {
  try {
    // Count existing challenges
    const challengeCount = await Challenge.countDocuments();
    
    // Return success with info
    res.status(200).json({
      success: true,
      message: 'Challenge system status',
      challengeCount,
      serviceStatus: 'operational'
    });
  } catch (err) {
    console.error('Challenge init route error:', err);
    res.status(200).json({
      success: false,
      message: 'Could not check challenge system status',
      error: err.message
    });
  }
});

export default router;