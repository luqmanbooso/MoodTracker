import express from 'express';
import { getResources, getEmergencyContacts } from '../controllers/resourceController.js';

const router = express.Router();

// Get resources (with optional category filter)
router.get('/', getResources);

// Get emergency contacts by country
router.get('/emergency/:country', getEmergencyContacts);

export default router;