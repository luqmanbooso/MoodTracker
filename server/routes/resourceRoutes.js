import express from 'express';
import { 
  getResources, 
  getResourceById, 
  completeResource,
  getCategories,
  getTags
} from '../controllers/resourceController.js';
// Import the mock user middleware (optional)
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Add mock user to all requests (optional)
router.use(authenticateUser);

// All routes accessible without authentication
router.get('/', getResources);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/:id', getResourceById);
router.post('/:id/complete', completeResource);

export default router;