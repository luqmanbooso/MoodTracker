import Challenge from '../models/Challenge.js';
import UserChallenge from '../models/UserChallenge.js';
import Achievement from '../models/Achievement.js';
import Progress from '../models/Progress.js';

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

// Seed challenges (for development)
export const seedChallenges = async (req, res) => {
  try {
    const challenges = [
      {
        title: 'Five Minute Meditation',
        description: 'Take 5 minutes to sit quietly and focus on your breathing.',
        type: 'mindfulness',
        forMood: 'any',
        difficulty: 'easy'
      },
      {
        title: 'Gratitude Journal',
        description: `Write down 3 things you're grateful for today.`,
        type: 'gratitude',
        forMood: 'any',
        difficulty: 'easy'
      },
      {
        title: 'Tech-Free Hour',
        description: 'Spend one hour today completely away from screens.',
        type: 'wellbeing',
        forMood: 'any',
        difficulty: 'medium'
      },
      {
        title: 'Random Act of Kindness',
        description: 'Do something nice for someone else today without expecting anything in return.',
        type: 'social',
        forMood: 'any',
        difficulty: 'medium'
      },
      {
        title: 'Nature Walk',
        description: 'Take a 15-minute walk outdoors and notice the natural world around you.',
        type: 'activity',
        forMood: 'any',
        difficulty: 'easy'
      },
      {
        title: 'Learn Something New',
        description: `Spend 20 minutes learning about a topic you're curious about.`,
        type: 'growth',
        forMood: 'any',
        difficulty: 'medium'
      },
      {
        title: 'Digital Declutter',
        description: 'Delete unused apps or clean up your digital files for 10 minutes.',
        type: 'wellbeing',
        forMood: 'any',
        difficulty: 'easy'
      },
      {
        title: 'Mindful Eating',
        description: 'Eat one meal today without any distractions - no phone, TV, or reading.',
        type: 'mindfulness',
        forMood: 'any',
        difficulty: 'medium'
      },
      {
        title: 'Phone a Friend',
        description: `Call someone you haven't spoken to in a while just to catch up.`,
        type: 'social',
        forMood: 'any',
        difficulty: 'medium'
      },
      {
        title: 'Stretch Break',
        description: 'Take 3 short stretch breaks throughout your day.',
        type: 'activity',
        forMood: 'any',
        difficulty: 'easy'
      }
    ];
    
    await Challenge.deleteMany({}); // Clear existing challenges
    await Challenge.insertMany(challenges);
    
    res.json({ message: 'Challenges seeded successfully' });
  } catch (err) {
    console.error('Error in seedChallenges controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all available challenges
export const getChallenges = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all active challenges
    const challenges = await Challenge.find({ active: true });
    
    // Get user's progress on these challenges
    const userChallenges = await UserChallenge.find({ 
      user: userId,
      challenge: { $in: challenges.map(c => c._id) }
    });
    
    // Combine data to return challenges with progress
    const challengesWithProgress = challenges.map(challenge => {
      const userProgress = userChallenges.find(
        uc => uc.challenge.toString() === challenge._id.toString()
      );
      
      return {
        ...challenge.toObject(),
        progress: userProgress ? userProgress.progress : 0,
        completed: userProgress ? userProgress.completed : false,
        startedAt: userProgress ? userProgress.startedAt : null,
        expiresAt: userProgress ? userProgress.expiresAt : null
      };
    });
    
    res.status(200).json(challengesWithProgress);
  } catch (err) {
    console.error('Error getting challenges:', err);
    res.status(500).json({ message: 'Failed to get challenges', error: err.message });
  }
};

// Get user's challenges
export const getUserChallenges = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's challenges with populated challenge details
    const userChallenges = await UserChallenge.find({ user: userId })
      .populate('challenge')
      .sort({ startedAt: -1 });
    
    res.status(200).json(userChallenges);
  } catch (err) {
    console.error('Error getting user challenges:', err);
    res.status(500).json({ message: 'Failed to get user challenges', error: err.message });
  }
};

// Accept a challenge
export const acceptChallenge = async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.params;
    
    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Check if user already has this challenge
    const existingChallenge = await UserChallenge.findOne({ 
      user: userId, 
      challenge: challengeId 
    });
    
    if (existingChallenge) {
      return res.status(400).json({ 
        message: 'You have already accepted this challenge',
        userChallenge: existingChallenge
      });
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
    const userId = req.user.id;
    const { challengeId } = req.params;
    const { progress, action } = req.body;
    
    // Find user challenge
    const userChallenge = await UserChallenge.findOne({
      user: userId,
      challenge: challengeId
    }).populate('challenge');
    
    if (!userChallenge) {
      return res.status(404).json({ message: 'Challenge not found or not accepted' });
    }
    
    if (userChallenge.completed) {
      return res.status(400).json({ message: 'Challenge already completed' });
    }
    
    // Check if challenge has expired
    if (userChallenge.expiresAt && new Date() > userChallenge.expiresAt) {
      return res.status(400).json({ message: 'Challenge has expired' });
    }
    
    // Update progress
    if (progress !== undefined) {
      // Manual progress update
      userChallenge.progress = Math.min(
        progress, 
        userChallenge.challenge.requirements.count
      );
    } else if (action) {
      // Increment progress based on action
      if (userChallenge.challenge.requirements.action === action) {
        userChallenge.progress += 1;
      }
    } else {
      userChallenge.progress += 1; // Default increment by 1
    }
    
    // Check if challenge is completed
    const isCompleted = userChallenge.progress >= userChallenge.challenge.requirements.count;
    
    if (isCompleted && !userChallenge.completed) {
      userChallenge.completed = true;
      userChallenge.completedAt = new Date();
      
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
    }
    
    await userChallenge.save();
    
    res.status(200).json({
      message: isCompleted ? 'Challenge completed!' : 'Progress updated',
      userChallenge: await UserChallenge.findById(userChallenge._id).populate('challenge'),
      completed: isCompleted,
      pointsAwarded: isCompleted ? userChallenge.challenge.points : 0
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
    const userId = req.user.id;
    
    // Find challenges that the user hasn't completed yet
    const userCompletedChallenges = await UserChallenge.find({ 
      user: userId,
      completed: true 
    }).select('challenge');
    
    const completedChallengeIds = userCompletedChallenges.map(uc => uc.challenge);
    
    // Find active challenges not completed by the user
    // Filter by 'daily' or 'special' type to ensure it's appropriate for random selection
    const eligibleChallenges = await Challenge.find({ 
      active: true, 
      _id: { $nin: completedChallengeIds },
      type: { $in: ['daily', 'special'] }
    });
    
    if (eligibleChallenges.length === 0) {
      // If all challenges are completed, find any active challenge
      const anyActiveChallenge = await Challenge.findOne({ active: true });
      
      if (!anyActiveChallenge) {
        return res.status(404).json({ message: 'No active challenges found' });
      }
      
      return res.status(200).json({ 
        challenge: anyActiveChallenge,
        isNew: false,
        message: 'You have completed all available challenges! Here is one you can retry.'
      });
    }
    
    // Select a random challenge from eligible ones
    const randomIndex = Math.floor(Math.random() * eligibleChallenges.length);
    const randomChallenge = eligibleChallenges[randomIndex];
    
    // Check if user already has this challenge in progress
    const existingUserChallenge = await UserChallenge.findOne({
      user: userId,
      challenge: randomChallenge._id,
      completed: false
    });
    
    const isNew = !existingUserChallenge;
    
    res.status(200).json({
      challenge: randomChallenge,
      userProgress: existingUserChallenge || null,
      isNew
    });
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