import React, { useState } from 'react';
import { format } from 'date-fns';

const WellnessJourneyEntry = ({ entry, onDelete, onEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const getMoodIcon = (mood) => {
    const icons = {
      'Great': '😊',
      'Good': '🙂',
      'Okay': '😐',
      'Bad': '😔',
      'Terrible': '😢'
    };
    return icons[mood] || '😐';
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(entry.id);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${getMoodColor(entry.mood)}`}>
            {getMoodIcon(entry.mood)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{entry.mood}</h3>
            <p className="text-sm text-gray-400">{format(new Date(entry.date), 'MMM dd, yyyy, h:mm a')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-sm text-gray-400">Intensity</div>
            <div className="text-lg font-semibold text-white">{entry.intensity}/10</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Wellness</div>
            <div className="text-lg font-semibold text-emerald-400">{entry.wellnessScore}/10</div>
          </div>
        </div>
      </div>

      {/* Activities */}
      {entry.activities && entry.activities.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Activities:</h4>
          <div className="flex flex-wrap gap-2">
            {entry.activities.map((activity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {entry.notes && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Notes:</h4>
          <p className="text-gray-200 text-sm leading-relaxed">{entry.notes}</p>
        </div>
      )}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-emerald-900/30 text-emerald-300 rounded text-xs border border-emerald-500/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Wellness Metrics */}
      {(entry.energyLevel || entry.stressLevel || entry.sleepQuality || entry.socialConnections) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Wellness Metrics:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {entry.energyLevel && (
              <div className="text-center p-2 bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-400">Energy</div>
                <div className="text-sm font-semibold text-yellow-400">{entry.energyLevel}/10</div>
              </div>
            )}
            {entry.stressLevel && (
              <div className="text-center p-2 bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-400">Stress</div>
                <div className="text-sm font-semibold text-red-400">{entry.stressLevel}/10</div>
              </div>
            )}
            {entry.sleepQuality && (
              <div className="text-center p-2 bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-400">Sleep</div>
                <div className="text-sm font-semibold text-blue-400">{entry.sleepQuality}/10</div>
              </div>
            )}
            {entry.socialConnections && (
              <div className="text-center p-2 bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-400">Social</div>
                <div className="text-sm font-semibold text-purple-400">{entry.socialConnections}/10</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Self-Care Activities */}
      {entry.selfCareActivities && entry.selfCareActivities.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Self-Care Activities:</h4>
          <div className="flex flex-wrap gap-2">
            {entry.selfCareActivities.map((activity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm border border-purple-500/30"
              >
                💜 {activity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Challenges */}
      {entry.challenges && entry.challenges.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Challenges:</h4>
          <div className="flex flex-wrap gap-2">
            {entry.challenges.map((challenge, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-sm border border-orange-500/30"
              >
                💪 {challenge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gratitude */}
      {entry.gratitude && entry.gratitude.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Gratitude:</h4>
          <div className="flex flex-wrap gap-2">
            {entry.gratitude.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-emerald-900/30 text-emerald-300 rounded-full text-sm border border-emerald-500/30"
              >
                🙏 {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Goals */}
      {entry.goals && entry.goals.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Goals:</h4>
          <div className="flex flex-wrap gap-2">
            {entry.goals.map((goal, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm border border-blue-500/30"
              >
                🎯 {goal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {entry.insights && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Insights:</h4>
          <p className="text-gray-200 text-sm leading-relaxed italic">"{entry.insights}"</p>
        </div>
      )}

      {/* AI Insights */}
      {entry.aiInsights && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <span className="mr-2">🤖</span>
            AI Insights
          </h4>
          {entry.aiInsights.summary && (
            <p className="text-gray-200 text-sm leading-relaxed mb-2">{entry.aiInsights.summary}</p>
          )}
          {entry.aiInsights.recommendations && entry.aiInsights.recommendations.length > 0 && (
            <div className="space-y-1">
              {entry.aiInsights.recommendations.map((rec, index) => (
                <p key={index} className="text-gray-300 text-sm">• {rec}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
        <button
          onClick={() => onEdit(entry)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-400 mb-4">Delete Entry</h3>
            <p className="text-sm text-gray-300 mb-4">
              Are you sure you want to delete this wellness entry? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessJourneyEntry; 