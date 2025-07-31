import express from 'express';
import { getDailyQuote, clearQuoteCache } from '../controllers/quoteController.js';

const router = express.Router();

// Get daily inspirational quote
router.get('/daily', getDailyQuote);

// Clear quote cache (for testing)
router.post('/clear-cache', clearQuoteCache);

export default router; 