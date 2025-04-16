import { useMemo } from 'react';

const WeeklyReflection = ({ moods }) => {
  const reflection = useMemo(() => {
    if (!moods || moods.length === 0) return null;
    
    // Get moods from the last 7 days
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    
    const weekMoods = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= oneWeekAgo && moodDate <= now;
    });
    
    if (weekMoods.length < 3) return null;
    
    // Map mood values to numbers for calculations
    const moodValues = {
      'Great': 5,
      'Good': 4,
      'Okay': 3,
      'Bad': 2,
      'Terrible': 1
    };
    
    // Calculate average mood
    const totalMoodValue = weekMoods.reduce((sum, mood) => sum + moodValues[mood.mood], 0);
    const averageMood = totalMoodValue / weekMoods.length;
    
    // Calculate mood distribution
    const moodCounts = weekMoods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate percentage of positive moods
    const positiveCount = (moodCounts['Great'] || 0) + (moodCounts['Good'] || 0);
    const positivePercentage = (positiveCount / weekMoods.length) * 100;
    
    // Find most common activities
    const activityCounts = {};
    weekMoods.forEach(mood => {
      if (mood.activities && mood.activities.length) {
        mood.activities.forEach(activity => {
          activityCounts[activity] = (activityCounts[activity] || 0) + 1;
        });
      }
    });
    
    const topActivities = Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([activity]) => activity);
    
    // Find trends (improving or declining)
    const firstHalf = weekMoods.slice(weekMoods.length / 2).reverse();
    const secondHalf = weekMoods.slice(0, weekMoods.length / 2);
    
    const firstHalfAvg = firstHalf.reduce((sum, mood) => sum + moodValues[mood.mood], 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, mood) => sum + moodValues[mood.mood], 0) / secondHalf.length;
    
    const trend = secondHalfAvg - firstHalfAvg;
    let trendDescription;
    
    if (trend > 0.5) {
      trendDescription = "Your mood has been improving over the week";
    } else if (trend < -0.5) {
      trendDescription = "Your mood has declined somewhat over the week";
    } else {
      trendDescription = "Your mood has been stable over the week";
    }
    
    // Generate summary text
    let moodText;
    if (averageMood >= 4.5) {
      moodText = "excellent";
    } else if (averageMood >= 3.5) {
      moodText = "good";
    } else if (averageMood >= 2.5) {
      moodText = "okay";
    } else if (averageMood >= 1.5) {
      moodText = "challenging";
    } else {
      moodText = "difficult";
    }
    
    // Create weekly summary
    const summary = `This has been a ${moodText} week overall. ${trendDescription}. ${
      positivePercentage >= 70 
        ? "You've had mostly positive moods this week."
        : positivePercentage >= 50
          ? "You've had a mix of positive and negative moods this week."
          : "This week has had more challenging moods than positive ones."
    }`;
    
    // Generate insights based on the data
    const insights = [];
    
    if (topActivities.length > 0) {
      insights.push(`Your most frequent activities were ${topActivities.join(', ')}.`);
    }
    
    // Look for patterns in custom moods and tags
    const customMoods = weekMoods
      .filter(m => m.customMood && m.customMood.trim().length > 0)
      .map(m => m.customMood);
    
    if (customMoods.length > 0) {
      const uniqueCustomMoods = [...new Set(customMoods)];
      if (uniqueCustomMoods.length > 0) {
        insights.push(`You frequently described your mood as ${uniqueCustomMoods.slice(0, 3).join(', ')}.`);
      }
    }
    
    const allTags = [];
    weekMoods.forEach(mood => {
      if (mood.tags && mood.tags.length) {
        allTags.push(...mood.tags);
      }
    });
    
    if (allTags.length > 0) {
      const tagCounts = {};
      allTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
      
      const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag]) => tag);
      
      if (topTags.length > 0) {
        insights.push(`Common themes in your week were ${topTags.join(', ')}.`);
      }
    }
    
    // Suggest focus areas for next week
    let focusAreas;
    
    if (averageMood <= 3) {
      focusAreas = "Consider focusing on self-care and activities that bring you joy in the coming week.";
    } else if (trend < -0.5) {
      focusAreas = "You might want to reflect on what changed during the week and how to maintain positivity.";
    } else if (positivePercentage >= 70) {
      focusAreas = "Continue with what's working well for you, as your mood has been very positive.";
    } else {
      focusAreas = "Try to identify patterns in what improves your mood and incorporate more of those activities.";
    }
    
    return {
      summary,
      insights,
      focusAreas,
      moodDistribution: moodCounts,
      topActivities,
      positivePercentage: Math.round(positivePercentage)
    };
  }, [moods]);
  
  if (!reflection) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Weekly Reflection</h3>
        <p className="text-gray-500">Track at least 3 moods in a week to see your weekly reflection.</p>
      </div>
    );
  }
  
  const getMoodColor = (mood) => {
    switch(mood) {
      case 'Great': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Okay': return 'bg-yellow-100 text-yellow-800';
      case 'Bad': return 'bg-orange-100 text-orange-800';
      case 'Terrible': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Your Weekly Reflection</h3>
      
      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-800">{reflection.summary}</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Mood Distribution</h4>
          <div className="space-y-2">
            {Object.entries(reflection.moodDistribution).map(([mood, count]) => (
              <div key={mood} className="flex items-center">
                <span className={`px-2 py-1 rounded ${getMoodColor(mood)} mr-2 text-xs`}>
                  {mood}
                </span>
                <div className="flex-grow bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(count / Object.values(reflection.moodDistribution).reduce((a, b) => a + b, 0)) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Week at a Glance</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-sm font-medium w-32">Positive moods:</span>
              <span className="text-green-600 font-medium">{reflection.positivePercentage}%</span>
            </div>
            
            {reflection.topActivities.length > 0 && (
              <div className="flex items-start">
                <span className="text-sm font-medium w-32">Top activities:</span>
                <div className="flex flex-wrap gap-1">
                  {reflection.topActivities.map(activity => (
                    <span key={activity} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {reflection.insights.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Insights</h4>
          <ul className="space-y-1">
            {reflection.insights.map((insight, index) => (
              <li key={index} className="text-gray-600">• {insight}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Focus for Next Week</h4>
        <p className="text-gray-600">{reflection.focusAreas}</p>
      </div>
      
      <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
        <p>Weekly reflection is based on your mood entries from the past 7 days.</p>
      </div>
    </div>
  );
};

export default WeeklyReflection;