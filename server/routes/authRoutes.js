import express from 'express';

const router = express.Router();

// Mock auth endpoints
router.post('/register', (req, res) => {
  res.json({
    _id: "dev-user-123", 
    name: req.body.name || "Development User",
    email: req.body.email || "dev@example.com",
    token: "dev-token-123456"
  });
});

router.post('/login', (req, res) => {
  res.json({
    _id: "dev-user-123", 
    name: "Development User",
    email: req.body.email || "dev@example.com",
    token: "dev-token-123456"
  });
});

router.get('/profile', (req, res) => {
  res.json({
    _id: "dev-user-123", 
    name: "Development User",
    email: "dev@example.com",
    preferences: {
      theme: "light",
      notifications: true
    }
  });
});

export default router;