import Challenge from '../models/Challenge.js';
import UserChallenge from '../models/UserChallenge.js';

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

// Get all challenges
export const getChallenges = async (req, res) => {
  try {
    let challenges = await Challenge.find();
    
    // If no challenges in DB, seed with sample data
    if (challenges.length === 0) {
      await Challenge.insertMany(sampleChallenges);
      challenges = await Challenge.find();
    }
    
    res.json(challenges);
  } catch (err) {
    console.error('Error in getChallenges controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get random challenge
export const getRandomChallenge = async (req, res) => {
  try {
    // Get total count of challenges
    const count = await Challenge.countDocuments();
    
    // If no challenges, seed with sample data
    if (count === 0) {
      await Challenge.insertMany(sampleChallenges);
    }
    
    // Get random challenge
    const random = Math.floor(Math.random() * count);
    const challenge = await Challenge.findOne().skip(random);
    
    res.json(challenge);
  } catch (err) {
    console.error('Error in getRandomChallenge controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Mark challenge as complete
export const markChallengeComplete = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // In a real app, you'd track which user completed the challenge
    // For now, we'll just return success
    res.json({ success: true, message: 'Challenge marked as complete' });
  } catch (err) {
    console.error('Error in markChallengeComplete controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};