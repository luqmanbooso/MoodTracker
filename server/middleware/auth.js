import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user info to request
 */
const auth = (req, res, next) => {
  // DEVELOPMENT MODE: Bypass authentication for testing
  // Remove this in production!
  const BYPASS_AUTH = true; // Set to false when ready for real authentication
  
  if (BYPASS_AUTH) {
    req.user = {
      id: "dev-user-123", 
      name: "Development User",
      isAdmin: true
    };
    return next();
  }
  
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'temporarydevkey');
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

/**
 * Development middleware that bypasses authentication
 * Just adds a mock user to each request
 */
// Mock authentication middleware for development purposes
export const authenticateUser = (req, res, next) => {
  // Set a default user ID
  req.user = { id: '000000000000000000000000', name: 'TestUser' };
  next();
};

export default auth;