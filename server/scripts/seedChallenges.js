import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge from '../models/Challenge.js';
import Achievement from '../models/Achievement.js';

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mood-tracker')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create initial achievements
const seedAchievements = async () => {
  try {
    // First, clear existing achievements
    await Achievement.deleteMany({ user: { $exists: false } });
    
    // Create template achievements (not assigned to any user yet)
    const achievements = [
      {
        type: 'mood_entries',
        title: 'Mood Tracker Beginner',
        description: 'Track your mood for 7 consecutive days',
        level: 1,
        points: 20,
        iconName: 'star'
      },
      {
        type: 'mood_entries',
        title: 'Mood Tracking Pro',
        description: 'Track your mood for 30 consecutive days',
        level: 2,
        points: 50,
        iconName: 'trophy'
      },
      {
        type: 'mood_entries',
        title: 'Detail-Oriented',
        description: 'Add notes to 15 mood entries',
        level: 1,
        points: 15,
        iconName: 'pencil'
      },
      {
        type: 'habit_completion',
        title: 'Habit Former',
        description: 'Complete a habit 10 times',
        level: 1,
        points: 25,
        iconName: 'calendar'
      },
      {
        type: 'resource_usage',
        title: 'Self-Improver',
        description: 'View 5 different resources',
        level: 1,
        points: 15,
        iconName: 'book'
      }
    ];
    
    const createdAchievements = await Achievement.insertMany(achievements);
    console.log(`${createdAchievements.length} achievements created`);
    
    return createdAchievements;
  } catch (err) {
    console.error('Error seeding achievements:', err);
    throw err;
  }
};

// Create initial challenges
const seedChallenges = async (achievements) => {
  try {
    // First, clear existing challenges
    await Challenge.deleteMany({});
    
    // Create challenges
    const challenges = [
      {
        title: 'First Steps',
        description: 'Track your mood for 3 consecutive days',
        type: 'daily',
        requirements: {
          count: 3,
          action: 'log_mood'
        },
        points: 10,
        duration: 7, // 7 days to complete
        difficultyLevel: 1,
        icon: 'star',
        relatedAchievement: achievements[0]._id,
        active: true,
        featured: true
      },
      {
        title: 'Detailed Tracker',
        description: 'Add notes to 5 mood entries',
        type: 'milestone',
        requirements: {
          count: 5,
          action: 'add_note'
        },
        points: 15,
        duration: null,
        difficultyLevel: 1,
        icon: 'pencil',
        relatedAchievement: achievements[2]._id,
        active: true,
        featured: false
      },
      {
        title: 'Consistent Tracker',
        description: 'Track your mood for 7 consecutive days',
        type: 'daily',
        requirements: {
          count: 7,
          action: 'log_mood'
        },
        points: 20,
        duration: 10, // 10 days to complete
        difficultyLevel: 2,
        icon: 'calendar',
        relatedAchievement: achievements[0]._id,
        active: true,
        featured: true
      },
      {
        title: 'Track Your Activities',
        description: 'Add activities to 5 mood entries',
        type: 'milestone',
        requirements: {
          count: 5,
          action: 'add_activities'
        },
        points: 15,
        duration: null,
        difficultyLevel: 1,
        icon: 'target',
        relatedAchievement: null,
        active: true,
        featured: false
      },
      {
        title: 'Mood Master',
        description: 'Track your mood for 30 consecutive days',
        type: 'daily',
        requirements: {
          count: 30,
          action: 'log_mood'
        },
        points: 50,
        duration: 35, // 35 days to complete
        difficultyLevel: 3,
        icon: 'trophy',
        relatedAchievement: achievements[1]._id,
        active: true,
        featured: false
      }
    ];
    
    const createdChallenges = await Challenge.insertMany(challenges);
    console.log(`${createdChallenges.length} challenges created`);
    
    return createdChallenges;
  } catch (err) {
    console.error('Error seeding challenges:', err);
    throw err;
  }
};

// Run the seeding
const runSeed = async () => {
  try {
    // Create achievements first
    const achievements = await seedAchievements();
    
    // Then create challenges with achievement references
    await seedChallenges(achievements);
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
};

runSeed();