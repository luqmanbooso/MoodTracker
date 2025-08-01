import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword,
  deleteAccount,
  exportData,
  verifyToken 
} from '../controllers/authController.js';

const router = express.Router();

// Test route to verify auth routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

// Public routes
router.post('/register', register);
router.post('/login', (req, res) => {
  console.log('Login route hit!');
  console.log('Request body:', req.body);
  login(req, res);
});

// Protected routes (require authentication)
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);
router.delete('/account', verifyToken, deleteAccount);
router.get('/export-data', verifyToken, exportData);

export default router;