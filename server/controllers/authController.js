import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

console.log('JWT_SECRET configured:', JWT_SECRET ? 'Yes' : 'No');

// Generate JWT token
const generateToken = (userId) => {
  console.log('Generating token for user ID:', userId);
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  console.log('Token generated successfully');
  return token;
};

// Register new user
export const register = async (req, res) => {
  try {
    console.log('Registration attempt received:', req.body);
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      console.log('Missing required fields');
      return res.status(400).json({
        message: 'Please provide email, password, and name'
      });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    console.log('Checking if user already exists');
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    console.log('Creating new user');
    // Create new user
    const user = new User({
      email,
      password,
      name
    });

    await user.save();
    console.log('User saved successfully');

    // Generate token
    const token = generateToken(user._id);
    console.log('Registration successful for user:', user.email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    console.log('Looking for user with email:', email);
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    console.log('User found:', user.email, 'User ID:', user._id);
    console.log('Attempting password comparison...');
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password comparison result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    console.log('Password valid, updating last login');
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);
    console.log('Login successful for user:', user.email, 'Token generated');

    const userResponse = user.toPublicJSON();
    console.log('User response prepared:', userResponse.email);

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Server error getting profile',
      error: error.message
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, profile } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Server error updating profile',
      error: error.message
    });
  }
};

// Verify token middleware
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
}; 