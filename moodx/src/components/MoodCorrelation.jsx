import { useEffect, useState } from 'react';

const MoodCorrelation = ({ moods }) => {
  const [correlations, setCorrelations] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (moods.length < 5) {
      setLoading(false);
      return;
    }
    
    // Analyze correlations between activities and mood
    const activityCorrelations = {};
    
    // Collect all unique activities
    const allActivities = [...new Set(moods.flatMap(m => m.activities || []))];
    
    // Calculate average mood score for each activity
    allActivities.forEach(activity => {
      const moodsWithActivity = moods.filter(m => (m.activities || []).includes(activity));
      
      if (moodsWithActivity.length < 2) return; // Not enough data
      
      // Convert mood to numerical score
      const moodScores = moodsWithActivity.map(m => {
        switch(m.mood) {
          case 'Great': return 5;
          case 'Good': return 4;
          case 'Okay': return 3;
          case 'Bad': return 2;
          case 'Terrible': return 1;
          default: return 0;
        }
      });
      
      // Calculate average and count for each activity
      const avgScore = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
      
      activityCorrelations[activity] = {
        avgScore,
        count: moodsWithActivity.length,
        impact: avgScore > 3.5 ? 'positive' : avgScore < 2.5 ? 'negative' : 'neutral'
      };
    });
    
    // Sort by impact and count
    const sortedActivities = Object.entries(activityCorrelations)
      .sort((a, b) => {
        // First sort by impact (positive first)
        if (a[1].impact === 'positive' && b[1].impact !== 'positive') return -1;
        if (a[1].impact !== 'positive' && b[1].impact === 'positive') return 1;
        
        // Then by count (more occurrences first)
        return b[1].count - a[1].count;
      })
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    
    setCorrelations(sortedActivities);
    setLoading(false);
  }, [moods]);
  
  // Not enough data
  if (moods.length < 5) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Activity Impact</h2>
        <p className="text-gray-600">
          Log at least 5 moods with activities to see correlations between your activities and mood.
        </p>
      </div>
    );
  }
  
  // Still loading
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Activity Impact</h2>
        <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  // No correlations found
  if (Object.keys(correlations).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Activity Impact</h2>
        <p className="text-gray-600">
          No significant patterns found yet. Continue logging your activities with moods.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Activity Impact</h2>
      <p className="text-gray-600 mb-4">
        These activities seem to influence your mood:
      </p>
      
      <div className="space-y-3">
        {Object.entries(correlations).map(([activity, data]) => (
          <div key={activity} className="flex items-center">
            <div className={`w-2 h-full min-h-[40px] rounded-l-md ${
              data.impact === 'positive' ? 'bg-green-500' : 
              data.impact === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <div className="flex-1 border-t border-r border-b rounded-r-md p-3">
              <div className="flex justify-between">
                <span className="font-medium">{activity}</span>
                <span className={`text-sm ${
                  data.impact === 'positive' ? 'text-green-600' : 
                  data.impact === 'negative' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {data.impact === 'positive' ? 'Improves your mood' : 
                   data.impact === 'negative' ? 'May lower your mood' : 'Neutral impact'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Based on {data.count} instances
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        This analysis is based on your logged activities and corresponding moods. The more you log, the more accurate it becomes.
      </div>
    </div>
  );
};

export default MoodCorrelation;