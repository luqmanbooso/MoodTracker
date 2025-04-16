import { useState } from 'react';

const MoodList = ({ moods, deleteMood }) => {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMoodColor = (mood) => {
    switch(mood) {
      case 'Great': return 'bg-green-100 border-green-300';
      case 'Good': return 'bg-blue-100 border-blue-300';
      case 'Okay': return 'bg-yellow-100 border-yellow-300';
      case 'Bad': return 'bg-orange-100 border-orange-300';
      case 'Terrible': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {moods.map(mood => (
        <div 
          key={mood._id} 
          className={`p-4 border rounded-lg shadow-sm ${getMoodColor(mood.mood)}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{mood.mood}</h3>
              <p className="text-sm text-gray-600">
                Intensity: {mood.intensity}/10
              </p>
              <p className="text-sm text-gray-600">{formatDate(mood.date)}</p>
            </div>
            <button
              onClick={() => deleteMood(mood._id)}
              className="text-red-500 hover:text-red-700"
              aria-label="Delete mood entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {mood.activities && mood.activities.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-semibold">Activities:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {mood.activities.map(activity => (
                  <span 
                    key={activity} 
                    className="px-2 py-0.5 bg-white/50 rounded-full text-xs"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {mood.note && (
            <div className="mt-2">
              <p className="text-sm font-semibold">Notes:</p>
              <p className="text-sm mt-1">{mood.note}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MoodList;