import Resource from '../models/Resource.js';
import UserProgress from '../models/UserProgress.js';
import { updatePoints, checkForAchievements } from '../utils/gamification.js';

// Get all resources
export const getResources = async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    let query = {};
    
    // Apply filters
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const resources = await Resource.find(query).sort({ featured: -1, createdAt: -1 });
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
};

// Get resource by ID
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const resource = await Resource.findById(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Increment view count
    resource.viewCount += 1;
    await resource.save();
    
    // Update user progress
    let userProgress = await UserProgress.findOne({ user: userId });
    if (!userProgress) {
      userProgress = new UserProgress({ user: userId });
    }
    
    userProgress.resourcesViewedCount += 1;
    await userProgress.save();
    
    // Check for resource usage achievements
    await checkForAchievements(userId, 'resource_usage');
    
    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ message: 'Error fetching resource' });
  }
};

// Mark resource as completed and award points
export const completeResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const resource = await Resource.findById(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Increment completion count
    resource.completionCount += 1;
    await resource.save();
    
    // Award points
    const points = resource.pointsForCompletion || 5;
    const updatedProgress = await updatePoints(
      userId, 
      points, 
      'resource_completion', 
      `Completed resource: ${resource.title}`
    );
    
    // Format response
    const response = {
      message: `Completed resource: ${resource.title}`,
      pointsAwarded: points,
      totalPoints: updatedProgress.points
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error completing resource:', error);
    res.status(500).json({ message: 'Error completing resource' });
  }
};

// Get resource categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Resource.distinct('category');
    
    // Map to a more useful format with counts
    const categoriesWithCount = await Promise.all(categories.map(async category => {
      const count = await Resource.countDocuments({ category });
      return { 
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        count
      };
    }));
    
    // Add "all" category
    const totalCount = await Resource.countDocuments();
    
    const result = [
      { id: 'all', name: 'All Resources', count: totalCount },
      ...categoriesWithCount
    ];
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Get resource tags
export const getTags = async (req, res) => {
  try {
    // Using aggregation to get unique tags and their counts
    const tags = await Resource.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    const formattedTags = tags.map(tag => ({
      id: tag._id,
      name: tag._id,
      count: tag.count
    }));
    
    res.json(formattedTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Error fetching tags' });
  }
};

// Get emergency contacts based on country code
export const getEmergencyContacts = async (req, res) => {
  try {
    const { country } = req.params;
    
    // This would typically be stored in the database
    // For now, we're using a static implementation
    const contacts = emergencyContactsByCountry[country] || emergencyContactsByCountry.global;
    
    res.json(contacts);
  } catch (err) {
    console.error('Error in getEmergencyContacts controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Sample emergency contacts by country
const emergencyContactsByCountry = {
  global: [
    {
      name: "International Association for Suicide Prevention",
      description: "Find crisis centers around the world",
      contact: "https://www.iasp.info/resources/Crisis_Centres/",
      type: "link"
    },
    {
      name: "Crisis Text Line",
      description: "Text HOME to 741741 for free 24/7 crisis counseling",
      contact: "741741",
      type: "phone"
    }
  ],
  us: [
    {
      name: "National Suicide Prevention Lifeline",
      description: "24/7, free and confidential support",
      contact: "988",
      type: "phone"
    },
    {
      name: "Crisis Text Line",
      description: "Text HOME to 741741 for free 24/7 crisis counseling",
      contact: "741741",
      type: "phone"
    },
    {
      name: "SAMHSA's National Helpline",
      description: "Treatment referral and information service (English and Spanish)",
      contact: "1-800-662-4357",
      type: "phone"
    }
  ],
  // Add more countries as needed
};

// Seed initial resources
export const seedResources = async () => {
  try {
    const count = await Resource.countDocuments();
    if (count > 0) return; // Skip if already seeded
    
    const resources = [
      {
        title: "5-Minute Breathing Meditation",
        description: "A quick guided breathing exercise to calm your mind and reduce stress.",
        category: "meditation",
        imageUrl: "https://images.unsplash.com/photo-1474418397713-003bc7c35de6",
        link: "https://www.mindful.org/a-five-minute-breathing-meditation/",
        tags: ["breathing", "quick", "stress-relief", "beginner"],
        duration: "5 min",
        featured: true,
        pointsForCompletion: 5,
        recommendedFor: ["stressed", "anxious", "overwhelmed"]
      },
      {
        title: "Progressive Muscle Relaxation",
        description: "Learn how to release tension throughout your body with this guided technique.",
        category: "meditation",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
        link: "https://www.healthline.com/health/progressive-muscle-relaxation",
        tags: ["relaxation", "tension", "physical", "stress-relief"],
        duration: "15 min",
        featured: false,
        pointsForCompletion: 10,
        recommendedFor: ["stressed", "anxious", "tense"]
      },
      {
        title: "Journaling for Mental Health",
        description: "How to use journaling as a tool for processing emotions and improving mental health.",
        category: "therapy",
        imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db",
        link: "https://www.urmc.rochester.edu/encyclopedia/content.aspx?ContentID=4552&ContentTypeID=1",
        tags: ["journaling", "self-reflection", "emotional-processing", "beginner"],
        duration: "20 min",
        featured: false,
        pointsForCompletion: 15,
        recommendedFor: ["sad", "confused", "reflective"]
      },
      {
        title: "Beginner's Guide to Meditation",
        description: "An introduction to meditation techniques for beginners.",
        category: "meditation",
        imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
        link: "https://www.mindful.org/how-to-meditate/",
        tags: ["meditation", "beginner", "mindfulness"],
        duration: "10 min",
        featured: false,
        pointsForCompletion: 8,
        recommendedFor: ["curious", "anxious", "restless"]
      },
      {
        title: "Understanding Cognitive Distortions",
        description: "Learn to identify common thought patterns that can negatively affect your mood.",
        category: "therapy",
        imageUrl: "https://images.unsplash.com/photo-1453738773917-9c3eff1db985",
        link: "https://psychcentral.com/lib/cognitive-distortions-negative-thinking",
        tags: ["cognitive", "thought-patterns", "CBT", "intermediate"],
        duration: "25 min",
        featured: false,
        pointsForCompletion: 20,
        recommendedFor: ["anxious", "sad", "critical"]
      },
      {
        title: "30-Minute Yoga for Stress Relief",
        description: "A gentle yoga sequence designed to reduce stress and tension.",
        category: "exercise",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
        link: "https://www.youtube.com/watch?v=hJbRpHZr_d0",
        tags: ["yoga", "stress-relief", "movement", "beginner"],
        duration: "30 min",
        featured: true,
        pointsForCompletion: 25,
        recommendedFor: ["stressed", "tense", "restless"]
      },
      {
        title: "Improving Sleep Hygiene",
        description: "Simple habits to improve your sleep quality and mental health.",
        category: "sleep",
        imageUrl: "https://images.unsplash.com/photo-1503387837-b154d5074bd2",
        link: "https://www.sleepfoundation.org/sleep-hygiene",
        tags: ["sleep", "habits", "relaxation", "beginner"],
        duration: "15 min",
        featured: false,
        pointsForCompletion: 15,
        recommendedFor: ["tired", "restless", "anxious"]
      },
      {
        title: "Finding Support Groups",
        description: "How to find and participate in mental health support groups.",
        category: "community",
        imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
        link: "https://www.nami.org/Support-Education/Support-Groups",
        tags: ["support", "community", "connection", "intermediate"],
        duration: "20 min",
        featured: false,
        pointsForCompletion: 15,
        recommendedFor: ["lonely", "sad", "disconnected"]
      },
      {
        title: "Gratitude Practices for Wellbeing",
        description: "Research-based gratitude exercises to improve your mood and outlook.",
        category: "therapy",
        imageUrl: "https://images.unsplash.com/photo-1447078806655-40579c2520d6",
        link: "https://greatergood.berkeley.edu/article/item/how_gratitude_changes_you_and_your_brain",
        tags: ["gratitude", "positive-psychology", "beginner", "journaling"],
        duration: "10 min",
        featured: false,
        pointsForCompletion: 10,
        recommendedFor: ["sad", "pessimistic", "discouraged"]
      },
      {
        title: "Foods That Support Mental Health",
        description: "A guide to nutrition that can help support your mental wellbeing.",
        category: "nutrition",
        imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af",
        link: "https://www.health.harvard.edu/blog/nutritional-psychiatry-your-brain-on-food-201511168626",
        tags: ["nutrition", "diet", "brain-health", "beginner"],
        duration: "15 min",
        featured: false,
        pointsForCompletion: 10,
        recommendedFor: ["tired", "foggy", "lethargic"]
      }
    ];
    
    await Resource.insertMany(resources);
    console.log('Resources seeded successfully');
  } catch (error) {
    console.error('Error seeding resources:', error);
  }
};