import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge from '../models/Challenge.js';
import Achievement from '../models/Achievement.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moodtracker')
  .then(() => console.log('MongoDB connected for seeding challenges'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedChallenges = async () => {
  try {
    // Clear existing data
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');
    
    // Create achievements first
    const achievements = [
      {
        type: 'consistency',
        title: 'Mood Tracker Beginner',
        description: 'Track your mood for the first time',
        level: 1,
        points: 10,
        iconName: 'star',
      },
      {
        type: 'consistency',
        title: 'Weekly Warrior',
        description: 'Track your mood every day for a week',
        level: 2,
        points: 25,
        iconName: 'calendar',
      },
      {
        type: 'insight',
        title: 'Self-Reflector',
        description: 'Add detailed notes to your mood entries 10 times',
        level: 2,
        points: 20,
        iconName: 'pencil',
      },
      {
        type: 'activity',
        title: 'Activity Analyst',
        description: 'Track activities with your moods to identify patterns',
        level: 2,
        points: 25,
        iconName: 'target',
      },
      {
        type: 'mastery',
        title: 'Mood Master',
        description: 'Complete 10 challenges',
        level: 3,
        points: 50,
        iconName: 'trophy',
      },
    ];

    // Insert achievements
    const savedAchievements = await Achievement.insertMany(achievements);
    console.log(`Added ${savedAchievements.length} achievements`);

    // Create challenges with references to achievements
    const challenges = [
      {
        title: 'First Mood Entry',
        description: 'Track your mood for the first time',
        type: 'milestone',
        requirements: {
          count: 1,
          action: 'log_mood'
        },
        points: 10,
        difficultyLevel: 1,
        icon: 'star',
        relatedAchievement: savedAchievements[0]._id,
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
        title: 'Weekly Mood Journal',
        description: 'Track your mood every day for a week',
        type: 'weekly',
        requirements: {
          count: 7,
          action: 'log_mood'
        },
        points: 25,
        difficultyLevel: 2,
        duration: 8, // 8 days to complete
        icon: 'calendar-week',
        relatedAchievement: savedAchievements[1]._id,
        active: true
      },
      {
        title: 'Reflection Practice',
        description: 'Add notes to 5 mood entries',
        type: 'milestone',
        requirements: {
          count: 5,
          action: 'add_note'
        },
        points: 20,
        difficultyLevel: 2,
        icon: 'pencil',
        active: true
      },
      {
        title: 'Activity Tracker',
        description: 'Track activities with your moods 5 times',
        type: 'milestone',
        requirements: {
          count: 5,
          action: 'add_activities'
        },
        points: 20,
        difficultyLevel: 2,
        icon: 'target',
        relatedAchievement: savedAchievements[3]._id,
        active: true
      },
      {
        title: 'Deep Insights',
        description: 'Add detailed notes to 10 mood entries',
        type: 'milestone',
        requirements: {
          count: 10,
          action: 'add_note'
        },
        points: 30,
        difficultyLevel: 3,
        icon: 'book',
        relatedAchievement: savedAchievements[2]._id,
        active: true
      },
      {
        title: 'Morning Check-in',
        description: 'Track your mood before 10 AM',
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
      },
      {
        title: 'Evening Reflection',
        description: 'Track your mood after 6 PM',
        type: 'daily',
        requirements: {
          count: 1,
          action: 'evening_checkin'
        },
        points: 10,
        difficultyLevel: 1,
        duration: 2,
        icon: 'moon',
        active: true
      },
      {
        title: 'Weekend Warrior',
        description: 'Track your mood on both Saturday and Sunday',
        type: 'weekly',
        requirements: {
          count: 2,
          action: 'weekend_checkin'
        },
        points: 15,
        difficultyLevel: 2,
        duration: 3,
        icon: 'calendar-weekend',
        active: true
      },
      {
        title: 'Gratitude Practice',
        description: `Add three things you're grateful for in your notes`,
        type: 'special',
        requirements: {
          count: 1,
          action: 'add_gratitude'
        },
        points: 15,
        difficultyLevel: 2,
        icon: 'heart',
        active: true
      }
    ];

    // Insert challenges
    await Challenge.insertMany(challenges);
    console.log(`Added ${challenges.length} challenges`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedChallenges();