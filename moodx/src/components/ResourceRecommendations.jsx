import { useState, useEffect } from 'react';

const ResourceRecommendations = ({ moods, customMoodCategories = [] }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!moods || moods.length === 0) {
      setLoading(false);
      return;
    }
    
    generateRecommendations();
  }, [moods]);
  
  const generateRecommendations = () => {
    setLoading(true);
    
    // Get recent moods for analysis
    const recentMoods = moods.slice(0, 10);
    
    // Count the occurrences of each mood
    const moodCounts = recentMoods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});
    
    // Count the occurrences of each custom mood
    const customMoodCounts = recentMoods.reduce((acc, mood) => {
      if (mood.customMood) {
        acc[mood.customMood] = (acc[mood.customMood] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Check for patterns in moods
    const badMoodCount = (moodCounts['Bad'] || 0) + (moodCounts['Terrible'] || 0);
    const highStressWords = ['stressed', 'overwhelmed', 'anxious', 'anxiety', 'pressure'];
    const sleepIssueWords = ['tired', 'exhausted', 'insomnia', "can't sleep", 'sleepy', 'fatigue'];
    
    // Check notes for specific issues
    const stressMatches = recentMoods.filter(mood => 
      mood.note && highStressWords.some(word => mood.note.toLowerCase().includes(word))
    ).length;
    
    const sleepMatches = recentMoods.filter(mood => 
      mood.note && sleepIssueWords.some(word => mood.note.toLowerCase().includes(word))
    ).length;
    
    // Generate recommendations based on patterns
    const recommendationsList = [];
    
    if (badMoodCount >= 3) {
      // Multiple bad moods recently
      recommendationsList.push({
        category: 'depression',
        title: 'Managing Low Mood',
        description: 'Resources for coping with persistent low mood.',
        priority: 10
      });
    }
    
    if (stressMatches >= 2) {
      // Stress mentioned multiple times
      recommendationsList.push({
        category: 'stress',
        title: 'Stress Management',
        description: 'Techniques to reduce and manage stress.',
        priority: stressMatches > 3 ? 10 : 8
      });
    }
    
    if (sleepMatches >= 2) {
      // Sleep issues mentioned
      recommendationsList.push({
        category: 'sleep',
        title: 'Sleep Improvement',
        description: 'Resources for better sleep quality and habits.',
        priority: sleepMatches > 3 ? 9 : 7
      });
    }
    
    // Check for anxiety indicators in custom moods
    const anxietyIndicators = ['Anxious', 'Nervous', 'Worried', 'Fearful', 'Panic'];
    const hasAnxietyMoods = customMoodCategories.some(category => 
      anxietyIndicators.includes(category)
    );
    
    if (hasAnxietyMoods || stressMatches > 0) {
      recommendationsList.push({
        category: 'anxiety',
        title: 'Anxiety Management',
        description: 'Resources for understanding and managing anxiety.',
        priority: 7
      });
    }
    
    // Always include mindfulness as a general recommendation
    recommendationsList.push({
      category: 'mindfulness',
      title: 'Mindfulness Practices',
      description: 'Daily mindfulness techniques for emotional wellbeing.',
      priority: 5
    });
    
    // Sort by priority and take top 3
    const topRecommendations = recommendationsList
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
    
    setRecommendations(topRecommendations);
    setLoading(false);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        Continue logging your moods to receive personalized resources.
      </p>
    );
  }
  
  return (
    <div>
      <h3 className="font-medium text-lg mb-3">Recommended for You</h3>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                {rec.category === 'depression' && <span role="img" aria-label="Mind">🧠</span>}
                {rec.category === 'anxiety' && <span role="img" aria-label="Anxiety">😰</span>}
                {rec.category === 'stress' && <span role="img" aria-label="Stress">😓</span>}
                {rec.category === 'sleep' && <span role="img" aria-label="Sleep">😴</span>}
                {rec.category === 'mindfulness' && <span role="img" aria-label="Mindfulness">🧘</span>}
              </div>
              <div>
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceRecommendations;

