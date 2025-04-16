import Resource from '../models/Resource.js';

// Get resources (with optional category filter)
export const getResources = async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = {};
    if (category && category !== 'all') {
      query.categories = category;
    }
    
    const resources = await Resource.find(query).sort({ featured: -1, createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error('Error in getResources controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
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

// Seed resources if none exist
export const seedResources = async () => {
  try {
    const count = await Resource.countDocuments();
    if (count === 0) {
      console.log('Seeding resources...');
      await Resource.insertMany(sampleResources);
      console.log('Resources seeded successfully');
    }
  } catch (err) {
    console.error('Error seeding resources:', err);
  }
};

// Sample resources for seeding
const sampleResources = [
  {
    title: "Understanding Anxiety: Symptoms, Causes, and Treatments",
    description: "Learn about different types of anxiety disorders, their symptoms, and evidence-based treatments.",
    url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    imageUrl: "https://images.unsplash.com/photo-1474176857210-7287d38d27c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["anxiety"],
    featured: true
  },
  {
    title: "Depression Basics: Signs, Symptoms, and When to Seek Help",
    description: "Recognize the common signs of depression and understand when professional support is needed.",
    url: "https://www.nimh.nih.gov/health/publications/depression",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["depression"],
    featured: true
  },
  // Add more sample resources...
];