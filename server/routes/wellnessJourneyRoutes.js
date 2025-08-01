import express from 'express';
import { 
  getWellnessJourney, 
  createWellnessEntry, 
  updateWellnessEntry, 
  deleteWellnessEntry,
  getWellnessAnalytics,
  getWellnessStats
} from '../controllers/wellnessJourneyController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get wellness journey entries
router.get('/:userId', getWellnessJourney);

// Create new wellness entry
router.post('/:userId', createWellnessEntry);

// Update wellness entry
router.put('/entry/:entryId', updateWellnessEntry);

// Delete wellness entry
router.delete('/entry/:entryId', deleteWellnessEntry);

// Get wellness analytics
router.get('/:userId/analytics', getWellnessAnalytics);

// Get wellness statistics
router.get('/:userId/stats', getWellnessStats);

export default router; 