import React, { useMemo } from 'react';

const MoodChart = ({ moods, simplified = false }) => {
  const chartData = useMemo(() => {
    if (!moods || moods.length === 0) return null;

    // Get last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentMoods = moods.filter(mood => 
      new Date(mood.date) >= thirtyDaysAgo
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (recentMoods.length === 0) return null;

    // Create daily data points
    const dailyData = [];
    const moodScores = { thriving: 10, good: 8, neutral: 6, struggling: 4, overwhelmed: 2 };
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMoods = recentMoods.filter(mood => 
        new Date(mood.date).toISOString().split('T')[0] === dateStr
      );
      
      if (dayMoods.length > 0) {
        const avgScore = dayMoods.reduce((sum, mood) => 
          sum + (moodScores[mood.mood] || 5), 0
        ) / dayMoods.length;
        dailyData.push({ date: dateStr, score: avgScore, count: dayMoods.length });
      } else {
        dailyData.push({ date: dateStr, score: null, count: 0 });
      }
    }

    return dailyData;
  }, [moods]);

  const insights = useMemo(() => {
    if (!moods || moods.length === 0) return [];

    const recentMoods = moods.slice(-7); // Last 7 days
    const insights = [];

    // Calculate average wellness score
    const moodScores = { thriving: 10, good: 8, neutral: 6, struggling: 4, overwhelmed: 2 };
    const avgScore = recentMoods.reduce((sum, mood) => 
      sum + (moodScores[mood.mood] || 5), 0
    ) / recentMoods.length;

    if (avgScore >= 8) {
      insights.push({
        type: 'positive',
        title: 'Excellent Wellness',
        description: 'Your mental health has been consistently strong',
        icon: '🌟',
        color: 'text-emerald-400'
      });
    } else if (avgScore >= 6) {
      insights.push({
        type: 'stable',
        title: 'Stable Wellness',
        description: 'Your mental health is in a good place',
        icon: '😊',
        color: 'text-blue-400'
      });
    } else if (avgScore >= 4) {
      insights.push({
        type: 'attention',
        title: 'Needs Attention',
        description: 'Consider focusing on self-care practices',
        icon: '🤔',
        color: 'text-yellow-400'
      });
    } else {
      insights.push({
        type: 'support',
        title: 'Support Needed',
        description: 'Consider reaching out for professional help',
        icon: '💙',
        color: 'text-purple-400'
      });
    }

    // Check for patterns
    const moodCounts = recentMoods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});

    const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];

    if (dominantMood === 'thriving' || dominantMood === 'good') {
      insights.push({
        type: 'pattern',
        title: 'Positive Pattern',
        description: `You've been feeling ${dominantMood} most often`,
        icon: '📈',
        color: 'text-green-400'
      });
    } else if (dominantMood === 'struggling' || dominantMood === 'overwhelmed') {
      insights.push({
        type: 'pattern',
        title: 'Challenging Pattern',
        description: `You've been feeling ${dominantMood} frequently`,
        icon: '📉',
        color: 'text-red-400'
      });
    }

    return insights;
  }, [moods]);

  if (!chartData) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 inline-flex p-3 rounded-full bg-gray-700">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Data to Chart</h3>
        <p className="text-gray-400">Start tracking your wellness to see your progress.</p>
      </div>
    );
  }

  if (simplified) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Wellness Trends</h3>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium">30-Day Overview</span>
            <span className="text-emerald-400 text-sm">
              {chartData.filter(d => d.score !== null).length} days tracked
            </span>
          </div>
          <div className="h-32 flex items-end justify-between gap-1">
            {chartData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                {day.score !== null ? (
                  <div 
                    className="w-full bg-emerald-500 rounded-t transition-all duration-300 hover:bg-emerald-400"
                    style={{ height: `${(day.score / 10) * 100}%` }}
                    title={`${day.date}: ${day.score.toFixed(1)}/10`}
                  />
                ) : (
                  <div className="w-full bg-gray-600 rounded-t" style={{ height: '10%' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Wellness Journey</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span className="text-xs text-gray-400">Wellness Score</span>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-gray-700 rounded-lg p-6">
        <div className="h-48 flex items-end justify-between gap-1 mb-4">
          {chartData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              {day.score !== null ? (
                <div 
                  className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all duration-300 hover:from-emerald-500 hover:to-emerald-300 cursor-pointer"
                  style={{ height: `${(day.score / 10) * 100}%` }}
                  title={`${day.date}: ${day.score.toFixed(1)}/10 (${day.count} entries)`}
                />
              ) : (
                <div className="w-full bg-gray-600 rounded-t" style={{ height: '10%' }} />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Wellness Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Recent Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 border-l-4 border-emerald-500">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{insight.icon}</span>
                  <h5 className={`font-medium ${insight.color}`}>{insight.title}</h5>
                </div>
                <p className="text-gray-300 text-sm">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {chartData.filter(d => d.score !== null).length}
          </div>
          <div className="text-gray-400 text-sm">Days Tracked</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {chartData.filter(d => d.score !== null).length > 0 
              ? (chartData.filter(d => d.score !== null).reduce((sum, d) => sum + d.score, 0) / chartData.filter(d => d.score !== null).length).toFixed(1)
              : '0'
            }
          </div>
          <div className="text-gray-400 text-sm">Avg Score</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {chartData.filter(d => d.score !== null).length > 0 
              ? Math.max(...chartData.filter(d => d.score !== null).map(d => d.score)).toFixed(1)
              : '0'
            }
          </div>
          <div className="text-gray-400 text-sm">Best Day</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {chartData.filter(d => d.score !== null).length > 0 
              ? Math.min(...chartData.filter(d => d.score !== null).map(d => d.score)).toFixed(1)
              : '0'
            }
          </div>
          <div className="text-gray-400 text-sm">Lowest Day</div>
        </div>
      </div>
    </div>
  );
};

export default MoodChart;