import mongoose from 'mongoose';
import User from '../models/User.js';
import Challenge from '../models/Challenge.js';

export const initializeDatabase = async () => {
  try {
    // Create test user if it doesn't exist
    const testUserId = '6453e23e1f1d93b020ccae';
    const userExists = await User.findById(testUserId).exec();
    
    if (!userExists) {
      console.log('Creating test user...');
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(testUserId),
        username: 'testuser',
        email: 'test@example.com'
      });
      await newUser.save();
    }
    
    // Check if challenges exist
    const challengeCount = await Challenge.countDocuments();
    if (challengeCount === 0) {
      console.log('No challenges found, seeding...');
      
      // Import and use the seedChallenges function
      const { seedChallenges } = await import('../controllers/challengeController.js');
      await seedChallenges();
    }
    
    console.log('Database initialization completed');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};