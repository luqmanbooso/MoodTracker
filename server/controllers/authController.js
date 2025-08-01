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

// Change password
export const changePassword = async (req, res) => {
  try {
    console.log('Change password request received');
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();
    console.log('Password changed successfully for user:', user.email);

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      message: 'Server error during password change',
      error: error.message
    });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    console.log('Delete account request received');
    const { password } = req.body;
    const userId = req.userId;

    // Validate input
    if (!password) {
      return res.status(400).json({
        message: 'Please provide your password to confirm account deletion'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Password is incorrect'
      });
    }

    // Delete user
    await User.findByIdAndDelete(userId);
    console.log('Account deleted successfully for user:', user.email);

    res.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      message: 'Server error during account deletion',
      error: error.message
    });
  }
};

// Export user data
export const exportData = async (req, res) => {
  try {
    console.log('Export data request received');
    const userId = req.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Import models for data export
    const Mood = (await import('../models/Mood.js')).default;
    const Todo = (await import('../models/Todo.js')).default;
    const Habit = (await import('../models/Habit.js')).default;
    const Goal = (await import('../models/Goal.js')).default;
    const Achievement = (await import('../models/Achievement.js')).default;

    // Gather all user data
    const userData = {
      profile: user.toPublicJSON(),
      moods: await Mood.find({ userId }).sort({ timestamp: -1 }),
      todos: await Todo.find({ userId }).sort({ createdAt: -1 }),
      habits: await Habit.find({ userId }).sort({ createdAt: -1 }),
      goals: await Goal.find({ userId }).sort({ createdAt: -1 }),
      achievements: await Achievement.find({ userId }).sort({ createdAt: -1 }),
      exportDate: new Date().toISOString()
    };

    console.log('Data exported successfully for user:', user.email);

    res.json({
      message: 'Data exported successfully',
      data: userData
    });
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      message: 'Server error during data export',
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