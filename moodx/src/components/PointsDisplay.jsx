import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const PointsDisplay = ({ 
  points = 0, 
  level = 1, 
  nextLevel = 100, 
  progress = 0, 
  showAnimation = false, 
  justEarned = 0, 
  levelUp = false 
}) => {
  const { theme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [animatingPoints, setAnimatingPoints] = useState(false);
  
  // Extract numeric level if an object was passed
  const levelValue = typeof level === 'object' ? level.level : level;
  const levelName = typeof level === 'object' ? level.name : `Level ${levelValue}`;
  
  // Handle level up animation
  useEffect(() => {
    if (levelUp) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 5000);
    }
  }, [levelUp]);
  
  // Handle points animation
  useEffect(() => {
    if (justEarned > 0) {
      setAnimatingPoints(true);
      setTimeout(() => setAnimatingPoints(false), 2000);
    }
  }, [justEarned]);

  return (
    <div className="relative">
      <div 
        className={`flex items-center rounded-full px-3 py-1 ${theme.cardBg} shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-all duration-200`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Level Badge */}
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${theme.primaryColor}-500 to-${theme.primaryColor}-700 text-white flex items-center justify-center font-bold text-sm`}>
          {levelValue}
        </div>
        
        {/* Points Info */}
        <div className="ml-2">
          <div className="flex items-center">
            <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">{points} pts</span>
            {/* Animated points indicator */}
            {justEarned > 0 && animatingPoints && (
              <div className="ml-2 text-green-600 dark:text-green-400 text-xs font-medium animate-bounce flex items-center">
                +{justEarned}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
            <div 
              className={`bg-${theme.primaryColor}-500 rounded-full h-1.5 ${showAnimation ? 'transition-all duration-1000' : ''}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Detailed tooltip */}
      {showTooltip && (
        <div className={`absolute top-full mt-2 right-0 w-64 ${theme.cardBg} rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-10 animate-fade-in`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">
              {levelName}
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">{points} / {nextLevel} points</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
            <div 
              className={`bg-${theme.primaryColor}-500 rounded-full h-2.5`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Next level:</span>
              <span>{nextLevel - points} points needed</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Total earned:</span>
              <span>{points} points</span>
            </div>
            {typeof level === 'object' && level.reward && (
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Reward:</span>
                <span>{level.reward}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">Earn points by logging moods, completing challenges, and maintaining streaks</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Level up animation overlay */}
      {showLevelUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md text-center animate-scale-in">
            <div className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-${theme.primaryColor}-500 to-${theme.primaryColor}-700 text-white flex items-center justify-center text-4xl font-bold mb-4`}>
              {levelValue}
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Level Up!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Congratulations! You've reached {levelName}!
            </p>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">New Rewards Unlocked</h3>
              <ul className="space-y-2">
                {typeof level === 'object' && level.reward ? (
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${theme.primaryColor}-500 mr-2`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {level.reward}
                  </li>
                ) : (
                  <>
                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${theme.primaryColor}-500 mr-2`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      New challenge types
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${theme.primaryColor}-500 mr-2`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Advanced insights
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${theme.primaryColor}-500 mr-2`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Custom theme options
                    </li>
                  </>
                )}
              </ul>
            </div>
            <button
              onClick={() => setShowLevelUp(false)}
              className={`px-6 py-3 bg-${theme.primaryColor}-600 hover:bg-${theme.primaryColor}-700 text-white rounded-lg font-medium transition-colors`}
            >
              Keep Going
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsDisplay;
