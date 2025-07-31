import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';

const WeeklyReflection = ({ moods, habits, goals }) => {
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateWeeklySummary();
  }, [moods, habits, goals]);

  const generateWeeklySummary = async () => {
    setLoading(true);
    try {
      // Get AI-generated weekly summary
      const aiSummary = await aiService.generateWeeklySummary(moods, habits, goals);
      setWeeklySummary(aiSummary);
    } catch (error) {
      console.error('Error generating weekly summary:', error);
      // Fallback to local summary
      setWeeklySummary(generateLocalSummary());
    } finally {
      setLoading(false);
    }
  };

  const generateLocalSummary = () => {
    if (!moods || moods.length === 0) {
      return {
        summary: "Start your wellness journey this week!",
        highlights: [],
        challenges: [],
        recommendations: []
      };
    }

    const weeklyMoods = moods.slice(0, 7);
    const moodScores = { thriving: 5, good: 4, neutral: 3, struggling: 2, overwhelmed: 1 };
    const averageMood = weeklyMoods.reduce((sum, mood) => {
      return sum + (moodScores[mood.mood] || 3);
    }, 0) / weeklyMoods.length;

    return {
      summary: `This week, your average wellness score was ${averageMood.toFixed(1)}/5.`,
      highlights: ['You completed wellness check-ins', 'You\'re building awareness of your patterns'],
      challenges: ['Continue tracking consistently', 'Practice self-care regularly'],
      recommendations: ['Keep up the good work!', 'Try adding one new wellness activity']
    };
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span className="ml-3 text-gray-300">Generating your weekly summary...</span>
        </div>
      </div>
    );
  }

  if (!weeklySummary) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Weekly Wellness Summary</h2>
        <p className="text-gray-300">No data available for this week.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Weekly Wellness Summary</h2>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm text-emerald-400">AI Generated</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-4">
          <p className="text-white text-lg">{weeklySummary.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Highlights */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="text-2xl mr-2">🌟</span>
            Week's Highlights
          </h3>
          <ul className="space-y-2">
            {weeklySummary.highlights && weeklySummary.highlights.length > 0 ? (
              weeklySummary.highlights.map((highlight, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start">
                  <span className="text-emerald-400 mr-2">•</span>
                  {highlight}
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm">No highlights recorded this week</li>
            )}
          </ul>
        </div>

        {/* Challenges */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="text-2xl mr-2">💪</span>
            Week's Challenges
          </h3>
          <ul className="space-y-2">
            {weeklySummary.challenges && weeklySummary.challenges.length > 0 ? (
              weeklySummary.challenges.map((challenge, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  {challenge}
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm">No major challenges this week</li>
            )}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            Recommendations
          </h3>
          <ul className="space-y-2">
            {weeklySummary.recommendations && weeklySummary.recommendations.length > 0 ? (
              weeklySummary.recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  {recommendation}
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm">Continue your current wellness practices</li>
            )}
          </ul>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{moods.length}</div>
          <div className="text-xs text-gray-400">Check-ins</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{habits.length}</div>
          <div className="text-xs text-gray-400">Active Habits</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{goals.length}</div>
          <div className="text-xs text-gray-400">Goals</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {moods.length > 0 ? Math.round((moods.filter(m => m.mood === 'thriving' || m.mood === 'good').length / moods.length) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-400">Positive Days</div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReflection;