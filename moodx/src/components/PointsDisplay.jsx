import { useState } from 'react';

const PointsDisplay = ({ points, level, nextLevel, progress, showAnimation, justEarned, levelUp }) => {
  const [showHistory, setShowHistory] = useState(false);
  
  const formatActionName = (action) => {
    return action
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return (
    <div className="relative">
      {/* Points Animation */}
      {showAnimation && justEarned && (
        <div className="absolute -top-10 right-0 animate-float">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            +{justEarned.points} points: {formatActionName(justEarned.action)}
          </div>
        </div>
      )}
      
      {/* Level Up Animation */}
      {levelUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 transform animate-level-up text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-2xl font-bold text-indigo-600 mb-2">Level Up!</h3>
            <p className="text-lg font-medium">You reached level {level.level}</p>
            <p className="text-gray-600 mb-4">"{level.name}"</p>
            <p className="font-medium text-green-600">Reward: {level.reward}</p>
            <button 
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              onClick={() => setLevelUp(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-xs text-gray-500">LEVEL {level.level}</div>
            <div className="font-bold text-lg">{level.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">POINTS</div>
            <div className="font-bold text-lg text-indigo-600">{points}</div>
          </div>
        </div>
        
        {nextLevel ? (
          <div className="mb-1">
            <div className="flex justify-between text-xs mb-1">
              <span>{points} / {nextLevel.threshold}</span>
              <span>Level {nextLevel.level}: {nextLevel.name}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-center text-gray-600 mb-1">
            Maximum level reached!
          </div>
        )}
        
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 flex items-center"
        >
          {showHistory ? 'Hide' : 'Show'} point history
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            {showHistory ? (
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PointsDisplay;