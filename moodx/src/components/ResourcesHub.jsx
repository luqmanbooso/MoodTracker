import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ResourcesHub = ({ userMood = 'Okay' }) => {
  const { theme } = useTheme();
  const [resources, setResources] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userCountry, setUserCountry] = useState('global');
  const [loading, setLoading] = useState(true);

  // Resource categories
  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'anxiety', name: 'Anxiety' },
    { id: 'depression', name: 'Depression' },
    { id: 'stress', name: 'Stress Management' },
    { id: 'sleep', name: 'Sleep' },
    { id: 'mindfulness', name: 'Mindfulness' },
    { id: 'crisis', name: 'Crisis Support' }
  ];

  useEffect(() => {
    // Load mental health resources
    fetchResources();
    
    // Try to detect user's country for localized emergency resources
    detectUserCountry();
  }, []);

  // Filter resources when category changes
  useEffect(() => {
    filterResources(selectedCategory);
  }, [selectedCategory]);

  const detectUserCountry = async () => {
    try {
      // Using free IP geolocation API
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.country) {
        setUserCountry(data.country.toLowerCase());
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      // Fall back to global resources
      setUserCountry('global');
    }
    
    // Load emergency contacts based on country
    fetchEmergencyContacts();
  };

  const fetchResources = async () => {
    setLoading(true);
    
    // In a production app, this would be an API call
    // For now, we're using mock data
    setTimeout(() => {
      setResources(mentalHealthResources);
      setLoading(false);
    }, 1000);
  };

  const fetchEmergencyContacts = async () => {
    // In a production app, this would fetch from your API based on country
    setEmergencyContacts(emergencyContactsByCountry[userCountry] || emergencyContactsByCountry.global);
  };

  const filterResources = (category) => {
    if (!mentalHealthResources) return;
    
    if (category === 'all') {
      setResources(mentalHealthResources);
      return;
    }
    
    // Special case: if current mood is Bad or Terrible, prioritize relevant resources
    let filteredResources = mentalHealthResources.filter(
      resource => resource.categories.includes(category)
    );
    
    if (['Bad', 'Terrible'].includes(userMood)) {
      // Prioritize crisis and relevant resources
      filteredResources = [
        ...mentalHealthResources.filter(r => r.categories.includes('crisis')),
        ...filteredResources
      ];
      
      // Remove duplicates
      filteredResources = filteredResources.filter(
        (resource, index, self) => 
          index === self.findIndex(r => r.id === resource.id)
      );
    }
    
    setResources(filteredResources);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'anxiety': return '😰';
      case 'depression': return '😔';
      case 'stress': return '😓';
      case 'sleep': return '😴';
      case 'mindfulness': return '🧘';
      case 'crisis': return '🆘';
      default: return '📚';
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Contacts Section - Always at Top */}
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4`}>
        <h3 className="text-lg font-semibold text-red-700 mb-3">
          Emergency Support
        </h3>
        
        <div className="space-y-3">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="flex items-start">
              <div className="bg-red-100 text-red-700 p-2 rounded-full mr-3">
                {contact.type === 'phone' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{contact.name}</h4>
                <p className="text-sm text-gray-600">{contact.description}</p>
                {contact.type === 'phone' ? (
                  <a href={`tel:${contact.contact}`} className="inline-block mt-1 text-red-600 font-medium hover:underline">
                    {contact.contact}
                  </a>
                ) : (
                  <a href={contact.contact} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-red-600 font-medium hover:underline">
                    {contact.contact}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-600 mt-4">
          If you're experiencing a mental health emergency, please contact emergency services immediately.
        </p>
      </div>
      
      {/* Resource Categories */}
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? `bg-${theme.primaryColor}-600 text-white`
                  : `bg-gray-100 text-gray-700 hover:bg-gray-200`
              }`}
            >
              {getCategoryIcon(category.id)} {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Resources List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-${theme.primaryColor}-500`}></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-gray-500">No resources found for this category.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map(resource => (
            <div key={resource.id} className={`bg-white rounded-lg shadow-md overflow-hidden`}>
              {resource.imageUrl && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {resource.categories.slice(0, 3).map(cat => (
                    <span key={cat} className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {getCategoryIcon(cat)} {cat}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold text-lg">{resource.title}</h3>
                <p className="text-gray-600 text-sm mt-1 mb-3">
                  {resource.description}
                </p>
                <div className="flex gap-2">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-block px-3 py-1.5 bg-${theme.primaryColor}-600 text-white rounded hover:bg-${theme.primaryColor}-700 text-sm`}
                  >
                    Read Article
                  </a>
                  {resource.videoUrl && (
                    <a 
                      href={resource.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Watch Video
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Emergency contacts by country
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
  uk: [
    {
      name: "Samaritans",
      description: "24/7 support for anyone in distress",
      contact: "116 123",
      type: "phone"
    },
    {
      name: "Mind",
      description: "Mental health support and information",
      contact: "0300 123 3393",
      type: "phone"
    }
  ],
  ca: [
    {
      name: "Crisis Services Canada",
      description: "24/7 support for people in crisis",
      contact: "1-833-456-4566",
      type: "phone"
    },
    {
      name: "Kids Help Phone",
      description: "24/7 support for young people",
      contact: "1-800-668-6868",
      type: "phone"
    }
  ],
  au: [
    {
      name: "Lifeline Australia",
      description: "24/7 crisis support and suicide prevention",
      contact: "13 11 14",
      type: "phone"
    },
    {
      name: "Beyond Blue",
      description: "Mental health support service",
      contact: "1300 22 4636",
      type: "phone"
    }
  ]
};

// Sample mental health resources
const mentalHealthResources = [
  {
    id: 1,
    title: "Understanding Anxiety: Symptoms, Causes, and Treatments",
    description: "Learn about different types of anxiety disorders, their symptoms, and evidence-based treatments.",
    url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    imageUrl: "https://images.unsplash.com/photo-1474176857210-7287d38d27c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["anxiety"]
  },
  {
    id: 2,
    title: "Depression Basics: Signs, Symptoms, and When to Seek Help",
    description: "Recognize the common signs of depression and understand when professional support is needed.",
    url: "https://www.nimh.nih.gov/health/publications/depression",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["depression"]
  },
  {
    id: 3,
    title: "Mindfulness Meditation Techniques for Beginners",
    description: "Simple meditation practices that can help reduce stress and improve mental clarity.",
    url: "https://www.mindful.org/meditation/mindfulness-getting-started/",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    videoUrl: "https://www.youtube.com/watch?v=inpok4MKVLM",
    categories: ["mindfulness", "stress"]
  },
  {
    id: 4,
    title: "Sleep Hygiene: Tips for Better Sleep",
    description: "Practical advice for improving sleep quality and establishing healthy sleep patterns.",
    url: "https://www.sleepfoundation.org/sleep-hygiene",
    imageUrl: "https://images.unsplash.com/photo-1511295042079-6130e67ba0e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["sleep", "stress"]
  },
  {
    id: 5,
    title: "Crisis Support: Immediate Steps to Take When in Crisis",
    description: "Guidance on what to do during a mental health crisis and how to reach immediate support.",
    url: "https://www.nami.org/crisisresources",
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["crisis"]
  },
  {
    id: 6,
    title: "Breathing Exercises for Stress Reduction",
    description: "Simple breathing techniques that can help calm anxiety and reduce stress quickly.",
    url: "https://www.healthline.com/health/breathing-exercises-for-anxiety",
    imageUrl: "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    videoUrl: "https://www.youtube.com/watch?v=aNXKjGFUlMs",
    categories: ["anxiety", "stress", "mindfulness"]
  },
  {
    id: 7,
    title: "Cognitive Behavioral Therapy (CBT) Overview",
    description: "Understanding CBT techniques that can help manage depression, anxiety, and other mental health conditions.",
    url: "https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral",
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["depression", "anxiety"]
  },
  {
    id: 8,
    title: "Nutrition and Mental Health: The Food-Mood Connection",
    description: "How diet affects mental health and which foods may help improve mood and reduce symptoms.",
    url: "https://www.health.harvard.edu/blog/nutritional-psychiatry-your-brain-on-food-201511168626",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["depression", "stress"]
  },
  {
    id: 9,
    title: "Setting Boundaries for Mental Wellbeing",
    description: "Learn how to establish healthy boundaries in relationships to protect your mental health.",
    url: "https://www.psychologytoday.com/us/blog/in-practice/201303/six-steps-setting-boundaries",
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["stress", "mindfulness"]
  },
  {
    id: 10,
    title: "Suicide Prevention: Warning Signs and How to Help",
    description: "Recognize suicidal warning signs and learn how to support someone who may be at risk.",
    url: "https://suicidepreventionlifeline.org/how-we-can-all-prevent-suicide/",
    imageUrl: "https://images.unsplash.com/photo-1529651533226-94a25d77a8c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["crisis", "depression"]
  },
  {
    id: 11,
    title: "Natural Ways to Boost Serotonin",
    description: "Explore natural methods to increase serotonin levels, which may help improve mood and wellbeing.",
    url: "https://www.healthline.com/nutrition/how-to-increase-serotonin",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categories: ["depression", "mindfulness"]
  },
  {
    id: 12,
    title: "Managing Panic Attacks: Immediate Coping Strategies",
    description: "Learn effective techniques to manage panic attacks when they occur and reduce their frequency.",
    url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/panic-attacks/",
    imageUrl: "https://images.unsplash.com/photo-1559291001-693fb9166cba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    videoUrl: "https://www.youtube.com/watch?v=8LJJxzVl4w4",
    categories: ["anxiety", "crisis"]
  }
];

export default ResourcesHub;