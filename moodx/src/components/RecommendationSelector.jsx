import React, { useState } from 'react';

const RecommendationSelector = ({ recommendations, onAddToTodo, onClose }) => {
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);

  const handleToggleRecommendation = (recommendation) => {
    setSelectedRecommendations(prev => {
      const isSelected = prev.find(r => r.title === recommendation.title);
      if (isSelected) {
        return prev.filter(r => r.title !== recommendation.title);
      } else {
        return [...prev, recommendation];
      }
    });
  };

  const handleAddSelected = () => {
    selectedRecommendations.forEach(rec => {
      onAddToTodo({
        title: rec.title,
        description: rec.description,
        category: rec.category || 'wellness',
        priority: rec.priority || 'medium',
        estimatedTime: rec.estimatedTime || '15 minutes',
        wellnessImpact: 'positive',
        pointsReward: rec.pointsReward || 10
      });
    });
    onClose();
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'mindfulness': return '🧘‍♀️';
      case 'exercise': return '🏃‍♀️';
      case 'social': return '👥';
      case 'self-care': return '💆‍♀️';
      case 'nutrition': return '🥗';
      case 'sleep': return '😴';
      case 'stress-relief': return '😌';
      default: return '💪';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Your Wellness Actions</h2>
              <p className="text-gray-400 mt-2">Select recommendations to add to your todo list and earn points</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedRecommendations.find(r => r.title === rec.title)
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
                onClick={() => handleToggleRecommendation(rec)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-white">{rec.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {rec.priority} priority
                        </span>
                        <span className="text-emerald-400 text-sm font-medium">
                          +{rec.pointsReward || 10} pts
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{rec.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>⏱️ {rec.estimatedTime}</span>
                        <span>💪 {rec.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {selectedRecommendations.find(r => r.title === rec.title) ? (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-gray-400">
              {selectedRecommendations.length} selected • 
              +{selectedRecommendations.reduce((sum, rec) => sum + (rec.pointsReward || 10), 0)} points
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleAddSelected}
                disabled={selectedRecommendations.length === 0}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Add {selectedRecommendations.length} to Todo List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationSelector; 