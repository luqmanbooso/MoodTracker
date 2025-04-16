import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const DailyChallenge = ({ onComplete, completedChallenges = [], showHistory = false }) => {
  const { theme } = useTheme();
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [completionAnimation, setCompletionAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const challenges = [
    {
      id: 'mindfulness-1',
      title: 'Give a Compliment',
      description: 'Give a genuine compliment to someone in your life.',
      category: 'Social',
      difficulty: 'Easy',
      icon: '💬'
    },
    {
      id: 'gratitude-1',
      title: '3 Things Gratitude',
      description: `Write down three things you're grateful for today.`,
      category: 'Mindfulness',
      difficulty: 'Easy',
      icon: '🙏'
    },
    {
      id: 'activity-1',
      title: '10-Minute Walk',
      description: 'Take a 10-minute walk outside and notice nature around you.',
      category: 'Physical',
      difficulty: 'Medium',
      icon: '🚶'
    },
    {
      id: 'reflection-1',
      title: 'Emotion Journaling',
      description: 'Write about an emotion that was challenging today and how you handled it.',
      category: 'Reflection',
      difficulty: 'Medium',
      icon: '📓'
    },
    {
      id: 'connection-1',
      title: 'Reach Out',
      description: `Message someone you haven't spoken to in a while.`,
      category: 'Social',
      difficulty: 'Medium',
      icon: '📱'
    }
  ];

  useEffect(() => {
    // Get today's date string for deterministic but changing challenge
    const today = new Date().toISOString().split('T')[0];
    const seed = parseInt(today.replace(/-/g, ''), 10);
    
    // Use the date as a seed to pick a challenge
    const challengeIndex = seed % challenges.length;
    setCurrentChallenge(challenges[challengeIndex]);
    setLoading(false);
  }, []);

  const isChallengeCompleted = currentChallenge && 
    completedChallenges.includes(currentChallenge.id);

  const handleCompleteClick = () => {
    if (currentChallenge && !isChallengeCompleted) {
      setCompletionAnimation(true);
      setTimeout(() => {
        onComplete(currentChallenge.id);
        setCompletionAnimation(false);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className={`${theme.cardBg} rounded-xl shadow-lg h-full flex items-center justify-center p-6 border border-gray-200 dark:border-gray-800`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-${theme.primaryColor}-500 mx-auto`}></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your daily challenge...</p>
        </div>
      </div>
    );
  }

  if (!currentChallenge) {
    return (
      <div className={`${theme.cardBg} rounded-xl shadow-lg h-full flex items-center justify-center p-6 border border-gray-200 dark:border-gray-800`}>
        <div className="text-center">
          <p className="mt-4 text-gray-600 dark:text-gray-400">No challenge available right now. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 relative`}>
      {/* Challenge Category Banner */}
      <div className={`bg-${theme.primaryColor}-600 text-white py-1 px-4 text-xs font-medium flex items-center justify-between`}>
        <span>{currentChallenge.category} Challenge</span>
        <span className={`px-2 py-0.5 rounded-full text-xs bg-${theme.primaryColor}-700`}>
          {currentChallenge.difficulty}
        </span>
      </div>

      <div className="p-5">
        <h2 className={`text-xl font-bold ${theme.textColor} flex items-center mb-2`}>
          <span className="text-2xl mr-2">{currentChallenge.icon}</span>
          Daily Challenge
        </h2>
        
        <div className="mt-3">
          <h3 className={`font-bold text-lg ${theme.textColor}`}>{currentChallenge.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{currentChallenge.description}</p>
        </div>
        
        <div className="mt-6">
          {isChallengeCompleted ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg px-4 py-3 flex items-center text-green-800 dark:text-green-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Challenge completed! Great work!</span>
            </div>
          ) : (
            <button 
              onClick={handleCompleteClick}
              disabled={completionAnimation}
              className={`w-full py-3 px-4 bg-${theme.primaryColor}-600 hover:bg-${theme.primaryColor}-700 text-white rounded-lg font-medium transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-${theme.primaryColor}-500 focus:ring-offset-2 ${
                completionAnimation ? 'animate-pulse' : ''
              }`}
            >
              {completionAnimation ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mark as Completed
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Challenge statistics footer */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">{completedChallenges.length}</span> challenges completed
        </div>
        <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          View all challenges
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DailyChallenge;