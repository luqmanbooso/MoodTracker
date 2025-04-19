import React, { useState } from 'react';
import { useChallenges } from '../../contexts/ChallengeContext';
import { useTheme } from '../../context/ThemeContext';

const ChallengesPage = () => {
  const { challenges, userChallenges, isLoading, acceptChallenge } = useChallenges();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('active');
  const [showCompleted, setShowCompleted] = useState(false);
  
  // Get active and completed challenges
  const activeChallenges = userChallenges.filter(uc => !uc.completed);
  const completedChallenges = userChallenges.filter(uc => uc.completed);
  
  // Available challenges (not yet accepted)
  const availableChallenges = challenges.filter(challenge => 
    !userChallenges.some(uc => 
      uc.challenge._id === challenge._id || 
      uc.challenge === challenge._id
    )
  );

  const handleAcceptChallenge = async (challengeId) => {
    try {
      await acceptChallenge(challengeId);
      // Automatically switch to active tab after accepting
      setActiveTab('active');
    } catch (err) {
      console.error('Error accepting challenge:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-emerald-500' : 'border-orange-500'}`}></div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-6">Challenges</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? `border-${darkMode ? 'emerald' : 'orange'}-500 text-${darkMode ? 'emerald' : 'orange'}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active Challenges ({activeChallenges.length})
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'available'
                ? `border-${darkMode ? 'emerald' : 'orange'}-500 text-${darkMode ? 'emerald' : 'orange'}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('available')}
          >
            Available Challenges ({availableChallenges.length})
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? `border-${darkMode ? 'emerald' : 'orange'}-500 text-${darkMode ? 'emerald' : 'orange'}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedChallenges.length})
          </button>
        </nav>
      </div>
      
      {/* Active Challenges */}
      {activeTab === 'active' && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {activeChallenges.length > 0 ? activeChallenges.map((userChallenge) => {
            const challenge = userChallenge.challenge;
            return (
              <div 
                key={challenge._id} 
                className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } shadow relative`}
              >
                {challenge.featured && (
                  <div className={`absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3 px-2 py-1 text-xs font-bold rounded-full ${
                    darkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-orange-500 text-white'
                  }`}>
                    Featured
                  </div>
                )}
                
                <div className="flex items-start">
                  <div 
                    className={`p-2 rounded-lg mr-4 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    } text-2xl`}
                  >
                    {getChallengeIcon(challenge.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{challenge.title}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      {challenge.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Progress
                    </span>
                    <span className={`font-medium ${
                      darkMode ? 'text-emerald-400' : 'text-orange-600'
                    }`}>
                      {userChallenge.progress} / {challenge.requirements.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${darkMode ? 'bg-emerald-500' : 'bg-orange-500'} h-2 rounded-full`}
                      style={{ width: `${(userChallenge.progress / challenge.requirements.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${darkMode ? 'text-emerald-400' : 'text-orange-500'} mr-1`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm font-medium ${darkMode ? 'text-emerald-400' : 'text-orange-500'}`}>
                      {challenge.points} pts
                    </span>
                  </div>
                  
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {userChallenge.expiresAt ? (
                      <span>
                        Expires {formatExpiration(userChallenge.expiresAt)}
                      </span>
                    ) : (
                      <span>No expiration</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full text-center py-12">
              <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No active challenges
              </p>
              <p className={`mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Check out the available challenges tab to get started!
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Available Challenges */}
      {activeTab === 'available' && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {availableChallenges.length > 0 ? availableChallenges.map((challenge) => (
            <div 
              key={challenge._id} 
              className={`p-4 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } shadow relative`}
            >
              {challenge.featured && (
                <div className={`absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3 px-2 py-1 text-xs font-bold rounded-full ${
                  darkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-orange-500 text-white'
                }`}>
                  Featured
                </div>
              )}
              
              <div className="flex items-start">
                <div 
                  className={`p-2 rounded-lg mr-4 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  } text-2xl`}
                >
                  {getChallengeIcon(challenge.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{challenge.title}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                    {challenge.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                {/* Challenge Requirements */}
                <div className="flex space-x-2 mb-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {challenge.type}
                  </span>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getDifficultyLabel(challenge.difficultyLevel)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${darkMode ? 'text-emerald-400' : 'text-orange-500'} mr-1`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  <span className={`text-sm font-medium ${darkMode ? 'text-emerald-400' : 'text-orange-500'}`}>
                    {challenge.points} pts
                  </span>
                </div>
                
                <button
                  onClick={() => handleAcceptChallenge(challenge._id)}
                  className={`px-4 py-1 rounded text-sm font-medium ${
                    darkMode
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  Accept Challenge
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No available challenges right now
              </p>
              <p className={`mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Check back later for more challenges!
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Completed Challenges */}
      {activeTab === 'completed' && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {completedChallenges.length > 0 ? completedChallenges.map((userChallenge) => {
            const challenge = userChallenge.challenge;
            return (
              <div 
                key={challenge._id} 
                className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } shadow relative`}
              >
                <div className={`absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full ${
                  darkMode ? 'bg-emerald-500' : 'bg-green-500'
                } text-white`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="flex items-start">
                  <div 
                    className={`p-2 rounded-lg mr-4 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    } text-2xl`}
                  >
                    {getChallengeIcon(challenge.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{challenge.title}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      {challenge.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Completed
                    </span>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(userChallenge.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${darkMode ? 'bg-emerald-500' : 'bg-green-500'} h-2 rounded-full w-full`}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${darkMode ? 'text-emerald-400' : 'text-green-500'} mr-1`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm font-medium ${darkMode ? 'text-emerald-400' : 'text-green-500'}`}>
                      {challenge.points} pts earned
                    </span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full text-center py-12">
              <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No completed challenges yet
              </p>
              <p className={`mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Check out the available challenges tab to get started!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper functions
const getChallengeIcon = (iconName) => {
  switch (iconName) {
    case 'fire': return '🔥';
    case 'star': return '⭐';
    case 'trophy': return '🏆';
    case 'medal': return '🏅';
    case 'target': return '🎯';
    case 'calendar': return '📅';
    case 'pencil': return '✏️';
    case 'heart': return '❤️';
    case 'book': return '📚';
    default: return '🎮';
  }
};

const getDifficultyLabel = (level) => {
  switch (level) {
    case 1: return 'Easy';
    case 2: return 'Moderate';
    case 3: return 'Intermediate';
    case 4: return 'Hard';
    case 5: return 'Expert';
    default: return 'Unknown';
  }
};

const formatExpiration = (date) => {
  const expirationDate = new Date(date);
  const now = new Date();
  
  const diffTime = expirationDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return 'Expired';
  if (diffDays === 1) return 'Today';
  if (diffDays <= 7) return `in ${diffDays} days`;
  return expirationDate.toLocaleDateString();
};

export default ChallengesPage;