import React, { useState, useMemo } from 'react';

const MoodAnalysis = ({ moods }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const analysis = useMemo(() => {
    if (!moods || moods.length === 0) {
      return {
        patterns: [],
        triggers: [],
        improvements: [],
        recommendations: [],
        moodDistribution: {},
        weeklyTrends: [],
        stressIndicators: [],
        wellnessScore: 0
      };
    }

    // Calculate time-based data
    const now = new Date();
    const filteredMoods = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      const diffTime = Math.abs(now - moodDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (selectedTimeframe) {
        case 'week': return diffDays <= 7;
        case 'month': return diffDays <= 30;
        case 'year': return diffDays <= 365;
        default: return true;
      }
    });

    if (filteredMoods.length === 0) {
      return {
        patterns: [],
        triggers: [],
        improvements: [],
        recommendations: [],
        moodDistribution: {},
        weeklyTrends: [],
        stressIndicators: [],
        wellnessScore: 0
      };
    }

    // Mood distribution analysis
    const moodDistribution = filteredMoods.reduce((acc, mood) => {
      const moodType = mood.mood || 'neutral';
      acc[moodType] = (acc[moodType] || 0) + 1;
      return acc;
    }, {});

    // Weekly trends
    const weeklyTrends = [];
    const weeks = {};
    filteredMoods.forEach(mood => {
      const date = new Date(mood.date);
      const weekKey = `${date.getFullYear()}-W${Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)}`;
      if (!weeks[weekKey]) {
        weeks[weekKey] = { total: 0, count: 0, avg: 0 };
      }
      weeks[weekKey].total += mood.intensity || 5;
      weeks[weekKey].count += 1;
    });

    Object.keys(weeks).forEach(week => {
      weeks[week].avg = weeks[week].total / weeks[week].count;
      weeklyTrends.push({
        week,
        averageMood: weeks[week].avg,
        entries: weeks[week].count
      });
    });

    // Pattern analysis
    const patterns = [];
    const moodTypes = Object.keys(moodDistribution);
    
    if (moodTypes.length > 1) {
      const dominantMood = moodTypes.reduce((a, b) => 
        moodDistribution[a] > moodDistribution[b] ? a : b
      );
      
      patterns.push({
        type: 'dominant_mood',
        title: 'Most Common Wellness State',
        description: `You've been feeling ${dominantMood} most often`,
        insight: `This suggests your mental health baseline is ${dominantMood}`,
        recommendation: dominantMood === 'thriving' ? 
          'Keep up the great work! Your wellness practices are effective.' :
          'Consider exploring what contributes to your most positive states.'
      });
    }

    // Stress indicators
    const stressIndicators = [];
    const highStressDays = filteredMoods.filter(mood => 
      (mood.mood === 'overwhelmed' || mood.mood === 'struggling') && 
      (mood.intensity || 5) >= 7
    );
    
    if (highStressDays.length > 0) {
      stressIndicators.push({
        type: 'stress_pattern',
        title: 'Stress Pattern Detected',
        description: `${highStressDays.length} high-stress days identified`,
        insight: 'You experience periods of high stress that may need attention',
        recommendation: 'Consider stress management techniques and self-care practices'
      });
    }

    // Wellness score calculation
    const wellnessScore = Math.round(
      filteredMoods.reduce((total, mood) => {
        let score = 0;
        switch (mood.mood) {
          case 'thriving': score = 10; break;
          case 'good': score = 8; break;
          case 'neutral': score = 6; break;
          case 'struggling': score = 4; break;
          case 'overwhelmed': score = 2; break;
          default: score = 5;
        }
        return total + score;
      }, 0) / filteredMoods.length
    );

    // Recommendations based on patterns
    const recommendations = [];
    
    if (wellnessScore < 6) {
      recommendations.push({
        type: 'improvement',
        title: 'Focus on Wellness Building',
        description: 'Your wellness score suggests room for improvement',
        action: 'Try daily mindfulness practices and self-care routines'
      });
    }
    
    if (highStressDays.length > filteredMoods.length * 0.3) {
      recommendations.push({
        type: 'stress_management',
        title: 'Stress Management Priority',
        description: 'High stress levels detected frequently',
        action: 'Consider stress reduction techniques and boundary setting'
      });
    }

    return {
      patterns,
      triggers: [],
      improvements: [],
      recommendations,
      moodDistribution,
      weeklyTrends,
      stressIndicators,
      wellnessScore
    };
  }, [moods, selectedTimeframe]);

  if (!moods || moods.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 inline-flex p-3 rounded-full bg-gray-700">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Data to Analyze</h3>
        <p className="text-gray-400">Start tracking your wellness to unlock personalized insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Pattern Analysis</h3>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Wellness Score */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-semibold">Wellness Score</h4>
          <span className="text-2xl font-bold text-white">{analysis.wellnessScore}/10</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${(analysis.wellnessScore / 10) * 100}%` }}
          ></div>
        </div>
        <p className="text-emerald-100 text-sm mt-2">
          {analysis.wellnessScore >= 8 ? 'Excellent wellness!' :
           analysis.wellnessScore >= 6 ? 'Good wellness level' :
           analysis.wellnessScore >= 4 ? 'Room for improvement' :
           'Focus on self-care needed'}
        </p>
      </div>

      {/* Mood Distribution */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-3">Wellness State Distribution</h4>
        <div className="space-y-2">
          {Object.entries(analysis.moodDistribution).map(([mood, count]) => (
            <div key={mood} className="flex items-center justify-between">
              <span className="text-gray-300 capitalize">{mood}</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-600 rounded-full h-2 mr-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${(count / moods.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patterns */}
      {analysis.patterns.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Key Patterns</h4>
          <div className="space-y-3">
            {analysis.patterns.map((pattern, index) => (
              <div key={index} className="border-l-4 border-emerald-500 pl-3">
                <h5 className="text-white font-medium">{pattern.title}</h5>
                <p className="text-gray-300 text-sm">{pattern.insight}</p>
                <p className="text-emerald-400 text-sm mt-1">{pattern.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stress Indicators */}
      {analysis.stressIndicators.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Stress Indicators</h4>
          <div className="space-y-3">
            {analysis.stressIndicators.map((indicator, index) => (
              <div key={index} className="border-l-4 border-yellow-500 pl-3">
                <h5 className="text-white font-medium">{indicator.title}</h5>
                <p className="text-gray-300 text-sm">{indicator.description}</p>
                <p className="text-yellow-400 text-sm mt-1">{indicator.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Personalized Recommendations</h4>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-3">
                <h5 className="text-white font-medium">{rec.title}</h5>
                <p className="text-gray-300 text-sm">{rec.description}</p>
                <p className="text-blue-400 text-sm mt-1">{rec.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodAnalysis;