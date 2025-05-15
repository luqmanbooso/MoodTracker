import Challenge from '../models/Challenge.js';
import UserChallenge from '../models/UserChallenge.js';
import Achievement from '../models/Achievement.js';
import Progress from '../models/Progress.js';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

// Sample challenges to populate DB if needed
const sampleChallenges = [
  {
    text: "Go for a 10-minute walk outside",
    category: "physical",
    difficulty: "easy",
  },
  {
    text: "Write down 3 things you're grateful for today",
    category: "mindfulness",
    difficulty: "easy",
  },
  {
    text: "Drink 8 glasses of water today",
    category: "health",
    difficulty: "medium",
  },
  {
    text: "Meditate for 5 minutes",
    category: "mindfulness",
    difficulty: "medium",
  },
  {
    text: "Call or message a friend you haven't spoken to in a while",
    category: "social",
    difficulty: "medium",
  },
  {
    text: "Try a new healthy recipe",
    category: "health",
    difficulty: "hard",
  },
  {
    text: "Do 15 minutes of exercise",
    category: "physical",
    difficulty: "medium",
  },
  {
    text: "Practice deep breathing for 5 minutes",
    category: "mindfulness",
    difficulty: "easy",
  },
  {
    text: "Declutter one area of your home",
    category: "environment",
    difficulty: "medium",
  },
  {
    text: "Go to bed 30 minutes earlier than usual",
    category: "health",
    difficulty: "easy",
  }
];

// Get today's challenge
export const getTodayChallenge = async (req, res) => {
  try {
    // Check if user already has a challenge for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let userChallenge = await UserChallenge.findOne({
      assignedDate: { $gte: today, $lt: tomorrow }
    }).populate('challenge');
    
    // If no challenge assigned for today, create one
    if (!userChallenge) {
      // Get a random challenge
      const count = await Challenge.countDocuments();
      const random = Math.floor(Math.random() * count);
      const randomChallenge = await Challenge.findOne().skip(random);
      
      if (!randomChallenge) {
        return res.status(404).json({ message: 'No challenges available' });
      }
      
      // Create user challenge
      userChallenge = new UserChallenge({
        challenge: randomChallenge._id,
        title: randomChallenge.title,
        description: randomChallenge.description,
        assignedDate: today
      });
      
      await userChallenge.save();
      userChallenge.challenge = randomChallenge;
    }
    
    res.json(userChallenge);
  } catch (err) {
    console.error('Error in getTodayChallenge controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Complete today's challenge
export const completeChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    
    const userChallenge = await UserChallenge.findById(id);
    
    if (!userChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    userChallenge.isCompleted = true;
    userChallenge.completedDate = new Date();
    
    await userChallenge.save();
    
    res.json(userChallenge);
  } catch (err) {
    console.error('Error in completeChallenge controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get challenge history
export const getChallengeHistory = async (req, res) => {
  try {
    const userChallenges = await UserChallenge.find()
      .sort({ assignedDate: -1 })
      .limit(10)
      .populate('challenge');
    
    res.json(userChallenges);
  } catch (err) {
    console.error('Error in getChallengeHistory controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all available challenges
export const getChallenges = async (req, res) => {
  try {
    console.log('Attempting to fetch challenges...');
    
    // First check if Challenge model is defined properly
    if (!Challenge) {
      console.error('Challenge model is undefined');
      return res.status(500).json({ message: 'Challenge model not defined' });
    }
    
    // Try to get any challenges without filter first for debugging
    const count = await Challenge.countDocuments();
    console.log(`Found ${count} total challenges in database`);
    
    // Try the original query
    const challenges = await Challenge.find({ active: true });
    console.log(`Found ${challenges.length} active challenges`);
    
    res.status(200).json(challenges);
  } catch (err) {
    console.error('Error getting challenges:', err);
    console.error('Error details:', err.stack);
    res.status(500).json({ 
      message: 'Failed to get challenges', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Get user's challenges
export const getUserChallenges = async (req, res) => {
  try {
    console.log('Fetching user challenges...');
    
    // Fix: Get the user ID safely with proper null checks
    let userId;
    
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else if (req.params && req.params.userId) {
      userId = req.params.userId;
    } else if (req.body && req.body.userId) {
      userId = req.body.userId;
    } else {
      // If no userId is provided anywhere, use a default for testing
      userId = '000000000000000000000000';
      console.log('No user ID provided, using default ID');
    }
    
    console.log('Using user ID:', userId);
    
    // Validate the user ID format before querying
    let userObjectId;
    
    try {
      // Check if the ID is a valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(userId)) {
        userObjectId = new mongoose.Types.ObjectId(userId);
      } else {
        // If it's not valid, generate a consistent dummy ObjectId for testing
        console.log(`Invalid ObjectId format. Using fallback ID.`);
        userObjectId = new mongoose.Types.ObjectId('000000000000000000000000');
      }
    } catch (idError) {
      console.error('Error converting user ID to ObjectId:', idError);
      userObjectId = new mongoose.Types.ObjectId('000000000000000000000000');
    }
    
    // Fetch challenges with the properly formatted ObjectId
    const userChallenges = await UserChallenge.find({ user: userObjectId })
      .populate('challenge')
      .sort({ updatedAt: -1 });
      
    console.log(`Found ${userChallenges.length} user challenges`);
    
    return res.status(200).json(userChallenges);
  } catch (error) {
    console.error('Error in getUserChallenges:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Accept a challenge
export const acceptChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user?.id || '6453e23e1f1d93b020ccae';  // Provide a default ID for testing
    
    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Check if user already has this challenge
    const existingUserChallenge = await UserChallenge.findOne({
      user: userId,
      challenge: challengeId,
      completed: false
    });
    
    if (existingUserChallenge) {
      return res.status(400).json({ message: 'Challenge already accepted' });
    }
    
    // Calculate expiration date if there's a duration
    let expiresAt = null;
    if (challenge.duration) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + challenge.duration);
    }
    
    // Create user challenge
    const userChallenge = new UserChallenge({
      user: userId,
      challenge: challengeId,
      progress: 0,
      completed: false,
      startedAt: new Date(),
      expiresAt
    });
    
    await userChallenge.save();
    
    res.status(201).json({
      message: 'Challenge accepted successfully',
      userChallenge: await UserChallenge.findById(userChallenge._id).populate('challenge')
    });
  } catch (err) {
    console.error('Error accepting challenge:', err);
    res.status(500).json({ message: 'Failed to accept challenge', error: err.message });
  }
};

// Update challenge progress
export const updateChallengeProgress = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { progress } = req.body;
    
    // Get userId with proper null checks
    let userId;
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else if (req.body && req.body.userId) {
      userId = req.body.userId;
    } else {
      userId = '000000000000000000000000';
    }
    
    // Validate ObjectId
    let userObjectId;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } else {
      userObjectId = new mongoose.Types.ObjectId('000000000000000000000000');
    }
    
    // Find user challenge
    const userChallenge = await UserChallenge.findOne({
      user: userObjectId,
      challenge: challengeId,
      completed: false
    }).populate('challenge');
    
    if (!userChallenge) {
      return res.status(404).json({ message: 'Challenge not found or already completed' });
    }
    
    // Check if challenge has expired
    if (userChallenge.expiresAt && new Date() > userChallenge.expiresAt) {
      return res.status(400).json({ message: 'Challenge has expired' });
    }
    
    // Update progress
    userChallenge.progress = progress;
    
    // Check if challenge is completed
    if (progress >= userChallenge.challenge.requirements.count) {
      userChallenge.completed = true;
      userChallenge.completedAt = new Date();
    }
    
    await userChallenge.save();
    
    res.status(200).json({
      message: userChallenge.completed ? 'Challenge completed!' : 'Progress updated',
      userChallenge: await UserChallenge.findById(userChallenge._id).populate('challenge')
    });
  } catch (err) {
    console.error('Error updating challenge progress:', err);
    res.status(500).json({ message: 'Failed to update progress', error: err.message });
  }
};

// Admin: Create a new challenge
export const createChallenge = async (req, res) => {
  try {
    const { 
      title, description, type, requirements, 
      points, duration, difficultyLevel, 
      icon, relatedAchievement, active, featured 
    } = req.body;
    
    const challenge = new Challenge({
      title,
      description,
      type,
      requirements,
      points,
      duration,
      difficultyLevel,
      icon,
      relatedAchievement,
      active: active !== undefined ? active : true,
      featured: featured !== undefined ? featured : false
    });
    
    await challenge.save();
    
    res.status(201).json({
      message: 'Challenge created successfully',
      challenge
    });
  } catch (err) {
    console.error('Error creating challenge:', err);
    res.status(500).json({ message: 'Failed to create challenge', error: err.message });
  }
};

// Get a random challenge for daily challenges feature
export const getRandomChallenge = async (req, res) => {
  try {
    const userId = req.user?.id || '6453e23e1f1d93b020ccae';  // Provide a default ID for testing
    
    const randomChallenge = await Challenge.aggregate([
      { $match: { active: true } },
      { $sample: { size: 1 } }
    ]);
    
    if (randomChallenge.length === 0) {
      return res.status(404).json({ message: 'No challenges available' });
    }
    
    res.status(200).json(randomChallenge[0]);
  } catch (err) {
    console.error('Error getting random challenge:', err);
    res.status(500).json({ message: 'Failed to get random challenge', error: err.message });
  }
};

// Mark challenge as complete (alternative endpoint)
export const markChallengeComplete = async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.params;
    
    // Find user challenge
    const userChallenge = await UserChallenge.findOne({
      user: userId,
      challenge: challengeId,
      completed: false
    }).populate('challenge');
    
    if (!userChallenge) {
      return res.status(404).json({ 
        message: 'Challenge not found, already completed, or not accepted' 
      });
    }
    
    // Check if challenge has expired
    if (userChallenge.expiresAt && new Date() > userChallenge.expiresAt) {
      return res.status(400).json({ message: 'Challenge has expired' });
    }
    
    // Mark as completed
    userChallenge.completed = true;
    userChallenge.completedAt = new Date();
    userChallenge.progress = userChallenge.challenge.requirements.count; // Set to max progress
    
    // Award points for completion
    await Progress.findOneAndUpdate(
      { user: userId },
      { 
        $inc: { points: userChallenge.challenge.points },
        $push: { 
          history: {
            points: userChallenge.challenge.points,
            reason: 'challenge_complete',
            description: `Completed challenge: ${userChallenge.challenge.title}`,
            date: new Date()
          }
        }
      },
      { new: true, upsert: true }
    );
    
    // Check if there's a related achievement to award
    if (userChallenge.challenge.relatedAchievement) {
      // Award the achievement
      const achievement = await Achievement.findById(
        userChallenge.challenge.relatedAchievement
      );
      
      if (achievement) {
        // Create a user-specific copy of the achievement
        const userAchievement = new Achievement({
          user: userId,
          type: achievement.type,
          title: achievement.title,
          description: achievement.description,
          level: achievement.level,
          points: achievement.points,
          iconName: achievement.iconName,
          earnedDate: new Date()
        });
        
        await userAchievement.save();
      }
    }
    
    await userChallenge.save();
    
    res.status(200).json({
      message: 'Challenge completed successfully!',
      userChallenge: await UserChallenge.findById(userChallenge._id).populate('challenge'),
      pointsAwarded: userChallenge.challenge.points
    });
  } catch (err) {
    console.error('Error completing challenge:', err);
    res.status(500).json({ message: 'Failed to complete challenge', error: err.message });
  }
};

// Seed challenges - consolidated version
export const seedChallenges = async () => {
  try {
    // Check if challenges already exist
    const count = await Challenge.countDocuments();
    if (count > 0) {
      console.log('Challenges already seeded');
      return;
    }

    console.log('Seeding challenges...');
    
    const challenges = [
      {
        title: 'Daily Mood Check-in',
        description: 'Log your mood today',
        type: 'daily',
        requirements: {
          count: 1,
          action: 'log_mood'
        },
        points: 10,
        difficultyLevel: 1,
        icon: 'star',
        active: true,
        featured: true
      },
      {
        title: '3-Day Streak',
        description: 'Track your mood for 3 consecutive days',
        type: 'daily',
        requirements: {
          count: 3,
          action: 'log_mood'
        },
        points: 15,
        difficultyLevel: 1,
        duration: 4, // 4 days to complete
        icon: 'calendar',
        active: true
      },
      {
        title: 'Note Taker',
        description: 'Add notes to 3 mood entries',
        type: 'milestone',
        requirements: {
          count: 3,
          action: 'add_note'
        },
        points: 15,
        difficultyLevel: 1,
        icon: 'pencil',
        active: true
      },
      {
        title: 'Activity Tracker',
        description: 'Record activities with your moods 3 times',
        type: 'milestone',
        requirements: {
          count: 3,
          action: 'add_activities'
        },
        points: 15,
        difficultyLevel: 1,
        icon: 'target',
        active: true
      },
      {
        title: 'Morning Check-in',
        description: 'Log your mood before 10 AM',
        type: 'daily',
        requirements: {
          count: 1,
          action: 'morning_checkin'
        },
        points: 10,
        difficultyLevel: 1,
        duration: 2,
        icon: 'sun',
        active: true
      }
    ];
    
    await Challenge.insertMany(challenges);
    console.log(`${challenges.length} challenges seeded successfully`);
  } catch (err) {
    console.error('Error seeding challenges:', err);
  }
};