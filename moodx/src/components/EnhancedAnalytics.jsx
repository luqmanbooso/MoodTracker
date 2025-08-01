import React, { useState, useEffect, useMemo } from 'react';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

const EnhancedAnalytics = ({ wellnessEntries, moods = [], period = '30d' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [viewMode, setViewMode] = useState('overview');

  // Filter entries based on selected period
  const filteredEntries = useMemo(() => {
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const startDate = subDays(new Date(), days);
    
    return wellnessEntries.filter(entry => 
      new Date(entry.date) >= startDate
    );
  }, [wellnessEntries, selectedPeriod]);

  // Filter moods based on selected period
  const filteredMoods = useMemo(() => {
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const startDate = subDays(new Date(), days);
    
    return moods.filter(mood => 
      new Date(mood.date) >= startDate
    );
  }, [moods, selectedPeriod]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const allData = [...filteredEntries, ...filteredMoods];
    if (allData.length === 0) return null;

    const totalEntries = allData.length;
    const wellnessEntries = filteredEntries.length;
    const moodEntries = filteredMoods.length;
    
    // Calculate average wellness score from both sources
    const wellnessScores = filteredEntries.map(entry => entry.wellnessScore || 5);
    const moodScores = filteredMoods.map(mood => {
      const moodScoreMap = { Great: 9, Good: 7, Okay: 5, Bad: 3, Terrible: 1 };
      return moodScoreMap[mood.mood] || 5;
    });
    
    const allScores = [...wellnessScores, ...moodScores];
    const averageWellnessScore = allScores.length > 0 ? 
      allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 0;
    
    // Combined mood distribution
    const moodDistribution = allData.reduce((acc, entry) => {
      const mood = entry.mood || 'Unknown';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    // Activity analysis from wellness entries
    const activityAnalysis = filteredEntries.reduce((acc, entry) => {
      if (entry.activities) {
        entry.activities.forEach(activity => {
          acc[activity] = (acc[activity] || 0) + 1;
        });
      }
      return acc;
    }, {});

    // Add activities from mood entries
    filteredMoods.forEach(mood => {
      if (mood.activities) {
        mood.activities.forEach(activity => {
          activityAnalysis[activity] = (activityAnalysis[activity] || 0) + 1;
        });
      }
    });

    const topActivities = Object.entries(activityAnalysis)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([activity, count]) => ({ activity, count }));

    // Trend analysis
    const recentData = allData.slice(-7);
    const olderData = allData.slice(-14, -7);
    
    const recentAvg = recentData.length > 0 ? 
      recentData.reduce((sum, entry) => {
        if (entry.wellnessScore) return sum + entry.wellnessScore;
        const moodScoreMap = { Great: 9, Good: 7, Okay: 5, Bad: 3, Terrible: 1 };
        return sum + (moodScoreMap[entry.mood] || 5);
      }, 0) / recentData.length : 0;
      
    const olderAvg = olderData.length > 0 ? 
      olderData.reduce((sum, entry) => {
        if (entry.wellnessScore) return sum + entry.wellnessScore;
        const moodScoreMap = { Great: 9, Good: 7, Okay: 5, Bad: 3, Terrible: 1 };
        return sum + (moodScoreMap[entry.mood] || 5);
      }, 0) / olderData.length : 0;
    
    const trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
    const change = Math.abs(recentAvg - olderAvg).toFixed(1);

    // Streak calculation
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = subDays(today, i);
      const hasEntry = allData.some(entry => 
        isSameDay(new Date(entry.date), checkDate)
      );
      
      if (hasEntry) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate insights
    const insights = [];
    
    // Consistency insight
    if (currentStreak >= 7) {
      insights.push({
        type: 'positive',
        message: `Amazing! You've been tracking for ${currentStreak} consecutive days.`,
        icon: '🔥'
      });
    } else if (currentStreak >= 3) {
      insights.push({
        type: 'positive',
        message: `Great consistency! You're on a ${currentStreak}-day streak.`,
        icon: '📈'
      });
    }

    // Trend insight
    if (trend === 'improving') {
      insights.push({
        type: 'positive',
        message: 'Your wellness is improving! Keep up the great work.',
        icon: '🚀'
      });
    } else if (trend === 'declining') {
      insights.push({
        type: 'improvement',
        message: 'I notice some challenges. Consider adding more self-care activities.',
        icon: '💪'
      });
    }

    // Activity insight
    if (topActivities.length > 0) {
      insights.push({
        type: 'info',
        message: `Your most common activity is ${topActivities[0].activity}.`,
        icon: '🎯'
      });
    }

    return {
      totalEntries,
      wellnessEntries,
      moodEntries,
      averageWellnessScore: averageWellnessScore.toFixed(1),
      moodDistribution,
      topActivities,
      trend,
      change,
      currentStreak,
      recentAverage: recentAvg.toFixed(1),
      olderAverage: olderAvg.toFixed(1),
      insights
    };
  }, [filteredEntries, filteredMoods]);

  // Generate calendar data
  const calendarData = useMemo(() => {
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const startDate = subDays(new Date(), days);
    const endDate = new Date();
    
    const daysArray = eachDayOfInterval({ start: startDate, end: endDate });
    
    return daysArray.map(day => {
      const wellnessEntry = filteredEntries.find(entry => 
        isSameDay(new Date(entry.date), day)
      );
      const moodEntry = filteredMoods.find(mood => 
        isSameDay(new Date(mood.date), day)
      );
      
      // Combine data from both sources
      const entry = wellnessEntry || moodEntry;
      const hasWellnessEntry = !!wellnessEntry;
      const hasMoodEntry = !!moodEntry;
      
      return {
        date: day,
        hasEntry: !!entry,
        hasWellnessEntry,
        hasMoodEntry,
        wellnessScore: entry?.wellnessScore || 0,
        mood: entry?.mood || null
      };
    });
  }, [filteredEntries, selectedPeriod]);

  if (!analytics) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Data Yet</h3>
          <p className="text-gray-400">Start logging your wellness journey to see beautiful insights!</p>
        </div>
      </div>
    );
  }

  const getMoodColor = (mood) => {
    const colors = {
      'Great': 'bg-emerald-500',
      'Good': 'bg-blue-500',
      'Okay': 'bg-yellow-500',
      'Bad': 'bg-orange-500',
      'Terrible': 'bg-red-500'
    };
    return colors[mood] || 'bg-gray-500';
  };

  const getTrendIcon = (trend) => {
    return trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️';
  };

  const getTrendColor = (trend) => {
    return trend === 'improving' ? 'text-emerald-400' : trend === 'declining' ? 'text-red-400' : 'text-yellow-400';
  };

  return (
    <div className="space-y-6">
      {/* Header with period selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Wellness Analytics</h2>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Total Entries</p>
              <p className="text-2xl font-bold text-white">{analytics.totalEntries}</p>
            </div>
            <div className="text-3xl">📝</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Avg Wellness Score</p>
              <p className="text-2xl font-bold text-white">{analytics.averageWellnessScore}/10</p>
            </div>
            <div className="text-3xl">💚</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-white">{analytics.currentStreak} days</p>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Trend</p>
              <p className={`text-2xl font-bold text-white flex items-center`}>
                <span className="mr-2">{getTrendIcon(analytics.trend)}</span>
                {analytics.trend}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Wellness Calendar</h3>
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square rounded-sm border border-gray-600 flex items-center justify-center text-xs
                ${day.hasEntry 
                  ? day.wellnessScore >= 7 
                    ? 'bg-emerald-500 text-white' 
                    : day.wellnessScore >= 5 
                      ? 'bg-blue-500 text-white'
                      : day.wellnessScore >= 3
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                  : 'bg-gray-700 text-gray-400'
                }
              `}
              title={`${format(day.date, 'MMM dd')} - ${day.hasEntry ? `Score: ${day.wellnessScore}/10` : 'No entry'}`}
            >
              {day.hasEntry ? '●' : ''}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mt-4 space-x-4 text-xs text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded mr-1"></div>
            High (7-10)
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
            Good (5-6)
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
            Fair (3-4)
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
            Low (1-2)
          </div>
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Mood Distribution</h3>
        <div className="space-y-3">
          {Object.entries(analytics.moodDistribution).map(([mood, count]) => {
            const percentage = ((count / analytics.totalEntries) * 100).toFixed(1);
            return (
              <div key={mood} className="flex items-center">
                <div className="w-20 text-sm text-gray-300">{mood}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getMoodColor(mood)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-300 text-right">
                  {count} ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Activities */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Top Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.topActivities.map((activity, index) => (
            <div key={activity.activity} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                <span className="text-white font-medium">{activity.activity}</span>
              </div>
              <div className="text-emerald-400 font-semibold">{activity.count}x</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Trend Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl mb-2">{getTrendIcon(analytics.trend)}</div>
            <div className={`text-lg font-semibold ${getTrendColor(analytics.trend)}`}>
              {analytics.trend.charAt(0).toUpperCase() + analytics.trend.slice(1)}
            </div>
            <div className="text-sm text-gray-400">Overall trend</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">{analytics.recentAverage}</div>
            <div className="text-sm text-gray-400">Recent average</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{analytics.change}</div>
            <div className="text-sm text-gray-400">Score change</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
        <div className="space-y-3">
          {analytics.averageWellnessScore >= 7 && (
            <div className="flex items-start p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
              <span className="text-2xl mr-3">🌟</span>
              <div>
                <div className="text-emerald-400 font-medium">Excellent Wellness!</div>
                <div className="text-gray-300 text-sm">Your wellness score is outstanding. Keep up the amazing work!</div>
              </div>
            </div>
          )}
          
          {analytics.currentStreak >= 7 && (
            <div className="flex items-start p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <span className="text-2xl mr-3">🔥</span>
              <div>
                <div className="text-blue-400 font-medium">Consistent Check-ins!</div>
                <div className="text-gray-300 text-sm">You've been checking in for {analytics.currentStreak} days straight. This consistency is key to wellness!</div>
              </div>
            </div>
          )}
          
          {analytics.trend === 'improving' && (
            <div className="flex items-start p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <span className="text-2xl mr-3">📈</span>
              <div>
                <div className="text-green-400 font-medium">Improving Trend!</div>
                <div className="text-gray-300 text-sm">Your wellness is getting better! Your recent average is {analytics.recentAverage} vs {analytics.olderAverage} previously.</div>
              </div>
            </div>
          )}
          
          {analytics.topActivities.length > 0 && (
            <div className="flex items-start p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <div className="text-purple-400 font-medium">Activity Insights</div>
                <div className="text-gray-300 text-sm">Your most common activity is "{analytics.topActivities[0].activity}". This seems to be working well for you!</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics; 