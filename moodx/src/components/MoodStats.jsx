import { useMemo } from 'react';

const MoodStats = ({ moods }) => {
  const stats = useMemo(() => {
    if (!moods.length) return null;

    // Count occurrences of each mood
    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});

    // Find most common mood
    const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];

    // Calculate average intensity
    const avgIntensity = moods.reduce((sum, mood) => sum + mood.intensity, 0) / moods.length;

    // Calculate percentage of positive moods (Great or Good)
    const positiveCount = moods.filter(mood => ['Great', 'Good'].includes(mood.mood)).length;
    const positivePercentage = (positiveCount / moods.length) * 100;

    // Find most common activities
    const activityCounts = moods.reduce((acc, mood) => {
      if (mood.activities && mood.activities.length) {
        mood.activities.forEach(activity => {
          acc[activity] = (acc[activity] || 0) + 1;
        });
      }
      return acc;
    }, {});

    const topActivities = Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([activity]) => activity);

    return {
      totalEntries: moods.length,
      mostCommonMood,
      avgIntensity: avgIntensity.toFixed(1),
      positivePercentage: positivePercentage.toFixed(0),
      topActivities
    };
  }, [moods]);

  if (!stats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Mood Insights</h2>
        <p className="text-gray-500">Add more mood entries to see insights</p>
      </div>
    );
  }

  const getMoodColor = (mood) => {
    switch(mood) {
      case 'Great': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Okay': return 'text-yellow-600';
      case 'Bad': return 'text-orange-600';
      case 'Terrible': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Mood Insights</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded p-3">
          <p className="text-sm text-gray-500">Total Entries</p>
          <p className="text-xl font-bold">{stats.totalEntries}</p>
        </div>
        
        <div className="border border-gray-200 rounded p-3">
          <p className="text-sm text-gray-500">Most Common Mood</p>
          <p className={`text-xl font-bold ${getMoodColor(stats.mostCommonMood)}`}>
            {stats.mostCommonMood}
          </p>
        </div>
        
        <div className="border border-gray-200 rounded p-3">
          <p className="text-sm text-gray-500">Average Intensity</p>
          <p className="text-xl font-bold">{stats.avgIntensity}/10</p>
        </div>
        
        <div className="border border-gray-200 rounded p-3">
          <p className="text-sm text-gray-500">Positive Moods</p>
          <p className="text-xl font-bold">{stats.positivePercentage}%</p>
        </div>
      </div>
      
      {stats.topActivities.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Top Activities</p>
          <div className="flex flex-wrap gap-2">
            {stats.topActivities.map(activity => (
              <span 
                key={activity}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodStats;