import { useMemo } from 'react';

const MoodAnalysis = ({ moods }) => {
  const analysis = useMemo(() => {
    if (!moods || moods.length < 5) return null;
    
    // Extract text from notes
    const allNotes = moods.filter(m => m.note && m.note.trim().length > 0).map(m => m.note);
    if (allNotes.length < 3) return null;
    
    // Common keywords for different emotions
    const keywordMap = {
      stress: ['stress', 'stressed', 'pressure', 'overwhelm', 'busy', 'deadline', 'workload', 'anxiety'],
      sleep: ['sleep', 'tired', 'exhausted', 'insomnia', 'rest', 'fatigue', 'bed'],
      social: ['friend', 'family', 'social', 'talk', 'conversation', 'partner', 'relationship'],
      work: ['work', 'job', 'career', 'project', 'meeting', 'boss', 'colleague'],
      exercise: ['exercise', 'workout', 'gym', 'run', 'walk', 'physical', 'active'],
      nutrition: ['food', 'eat', 'meal', 'diet', 'hunger', 'appetite'],
      gratitude: ['gratitude', 'thankful', 'grateful', 'appreciate', 'blessed'],
      creative: ['creative', 'create', 'art', 'write', 'music', 'idea', 'inspire']
    };
    
    // Count keyword occurrences
    const keywordCounts = {};
    Object.entries(keywordMap).forEach(([category, keywords]) => {
      keywordCounts[category] = 0;
      
      keywords.forEach(keyword => {
        allNotes.forEach(note => {
          if (note.toLowerCase().includes(keyword)) {
            keywordCounts[category]++;
          }
        });
      });
    });
    
    // Sort categories by occurrence
    const sortedCategories = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, count]) => count > 0)
      .map(([category]) => category);
    
    // Analyze mood patterns
    const moodCounts = moods.reduce((acc, m) => {
      acc[m.mood] = (acc[m.mood] || 0) + 1;
      return acc;
    }, {});
    
    const topMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    const moodVariability = Object.keys(moodCounts).length;
    
    // Activity correlations
    const activityMoods = {};
    
    moods.forEach(mood => {
      if (mood.activities && mood.activities.length) {
        mood.activities.forEach(activity => {
          if (!activityMoods[activity]) {
            activityMoods[activity] = { count: 0, positive: 0 };
          }
          
          activityMoods[activity].count++;
          if (mood.mood === 'Great' || mood.mood === 'Good') {
            activityMoods[activity].positive++;
          }
        });
      }
    });
    
    // Calculate which activities correlate with positive moods
    const positiveActivities = Object.entries(activityMoods)
      .filter(([_, data]) => data.count >= 3) // Need at least 3 occurrences
      .map(([activity, data]) => ({
        activity,
        percentage: (data.positive / data.count) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .filter(item => item.percentage >= 60) // At least 60% positive correlation
      .map(item => item.activity);
    
    // Generate insights
    const insights = [];
    
    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0];
      
      const categoryInsights = {
        stress: "Stress appears to be a recurring theme in your entries. Consider stress-reduction techniques like meditation or time management.",
        sleep: "Sleep quality seems to affect your mood. Prioritizing good sleep habits may help improve your overall well-being.",
        social: "Social connections are important in your mood entries. Nurturing these relationships could positively impact your emotional health.",
        work: "Work-related themes are prominent in your entries. Finding work-life balance may be beneficial for your mental well-being.",
        exercise: "Physical activity appears to influence your mood. Regular exercise could help maintain positive emotional states.",
        nutrition: "Your entries mention food and eating habits. Nutrition can play a key role in mood regulation.",
        gratitude: "You express gratitude often, which is associated with improved well-being and emotional resilience.",
        creative: "Creative activities seem to be meaningful to you. These pursuits can be excellent outlets for emotional expression."
      };
      
      insights.push(categoryInsights[topCategory] || "Interesting patterns emerged from your mood entries.");
    }
    
    if (moodVariability <= 2) {
      insights.push("Your mood entries show limited variation. Tracking a wider range of emotions might help gain deeper insights.");
    } else if (moodVariability >= 4) {
      insights.push("Your mood entries show considerable variation, suggesting you're attuned to the full spectrum of your emotions.");
    }
    
    if (positiveActivities.length > 0) {
      insights.push(`Activities like ${positiveActivities.slice(0, 2).join(' and ')} seem to correlate with your more positive moods.`);
    }
    
    // Recommendations based on most common mood
    const recommendations = {
      Great: [
        "You're experiencing many positive emotions. This is a good time to set goals or take on challenges.",
        "Consider journaling about what contributes to your positive moods to reference during more difficult times."
      ],
      Good: [
        "Your mood tends to be positive. Building on existing healthy habits can help maintain this state.",
        "Try to identify specific factors that bring your mood from 'Good' to 'Great'."
      ],
      Okay: [
        "Your mood is generally neutral. Experimenting with new activities might help discover what brings you more joy.",
        "Small positive changes to your routine could help shift your baseline mood."
      ],
      Bad: [
        "You've recorded several 'Bad' moods. Speaking with a trusted friend or health professional might be beneficial.",
        "Simple self-care practices like adequate sleep, nutrition, and exercise may help improve your emotional state."
      ],
      Terrible: [
        "You've recorded several 'Terrible' moods. Consider consulting with a mental health professional for support.",
        "Focus on basic self-care and be gentle with yourself during difficult times."
      ]
    };
    
    return {
      topCategories: sortedCategories.slice(0, 3),
      topMood,
      moodVariability,
      insights,
      recommendations: recommendations[topMood] || []
    };
  }, [moods]);
  
  if (!analysis) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">AI Mood Analysis</h3>
        <p className="text-gray-500">Add more mood entries with notes (at least 5) to receive personalized insights.</p>
      </div>
    );
  }
  
  const getCategoryIcon = (category) => {
    const icons = {
      stress: '😓',
      sleep: '😴',
      social: '👥',
      work: '💼',
      exercise: '🏃‍♂️',
      nutrition: '🍎',
      gratitude: '🙏',
      creative: '🎨'
    };
    
    return icons[category] || '📝';
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">AI Mood Analysis</h3>
      
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Themes in Your Entries</h4>
        {analysis.topCategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {analysis.topCategories.map(category => (
              <div key={category} className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                <span className="mr-2 text-lg">{getCategoryIcon(category)}</span>
                <span className="capitalize">{category}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No significant themes detected yet.</p>
        )}
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Insights</h4>
        <ul className="space-y-2">
          {analysis.insights.map((insight, index) => (
            <li key={index} className="text-gray-600">
              • {insight}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
        <ul className="space-y-2">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="text-gray-600">
              • {recommendation}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <p>Analysis based on your mood entries and journal notes. This is not a substitute for professional advice.</p>
      </div>
    </div>
  );
};

export default MoodAnalysis;