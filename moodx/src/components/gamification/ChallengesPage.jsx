import React, { useState, useEffect } from 'react';
import { useChallenges } from '../../contexts/ChallengeContext';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChallengesPage = () => {
  const { darkMode } = useTheme();
  const { 
    availableChallenges, 
    userChallenges, 
    loading, 
    error, 
    fetchChallenges,
    acceptChallenge 
  } = useChallenges();
  const [activeTab, setActiveTab] = useState('active');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter challenges
  const activeChallenges = userChallenges.filter(uc => !uc.completed);
  const completedChallenges = userChallenges.filter(uc => uc.completed);
  
  // Filter available challenges to exclude those the user already has
  const userChallengeIds = userChallenges.map(uc => uc.challenge._id);
  const filteredAvailableChallenges = availableChallenges.filter(
    c => !userChallengeIds.includes(c._id)
  );
  
  // Handle accepting a challenge
  const handleAcceptChallenge = async (challengeId) => {
    try {
      setIsLoading(true);
      await acceptChallenge(challengeId);
      // Refresh challenges to update lists
      await fetchChallenges();
      // Switch to active tab to show the new challenge
      setActiveTab('active');
    } catch (err) {
      console.error('Error accepting challenge:', err);
      alert('Failed to accept challenge. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle manually creating challenges if none exist
  const createSampleChallenges = async () => {
    try {
      setIsLoading(true);
      
      const sampleChallenges = [
        {
          title: 'Daily Mood Check-in',
          description: 'Log your mood today',
          type: 'daily',
          requirements: {
            count: 1,
            action: 'log_mood'
          },
          points: 10,
          difficultyLevel: 1,
          icon: 'star',
          active: true,
          featured: true
        },
        {
          title: 'Add a Note',
          description: 'Add a note to your mood entry',
          type: 'daily',
          requirements: {
            count: 1,
            action: 'add_note'
          },
          points: 5,
          difficultyLevel: 1,
          icon: 'pencil',
          active: true
        }
      ];
      
      // Create challenges on the server
      for (const challenge of sampleChallenges) {
        await axios.post(`${API_URL}/challenges`, challenge);
      }
      
      // Refresh challenges
      await fetchChallenges();
      alert('Created sample challenges successfully!');
    } catch (err) {
      console.error('Error creating sample challenges:', err);
      alert('Failed to create sample challenges: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading || isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500 mx-auto"></div>
        <p className="mt-4">Loading challenges...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-emerald-600' : 'bg-orange-500'} text-white`}
          onClick={fetchChallenges}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="challenges-page">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 ${
            activeTab === 'active' 
              ? `border-b-2 ${darkMode ? 'border-emerald-500 text-emerald-500' : 'border-orange-500 text-orange-500'} font-medium` 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Active Challenges ({activeChallenges.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 ${
            activeTab === 'available' 
              ? `border-b-2 ${darkMode ? 'border-emerald-500 text-emerald-500' : 'border-orange-500 text-orange-500'} font-medium` 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Available ({filteredAvailableChallenges.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 ${
            activeTab === 'completed' 
              ? `border-b-2 ${darkMode ? 'border-emerald-500 text-emerald-500' : 'border-orange-500 text-orange-500'} font-medium` 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Completed ({completedChallenges.length})
        </button>
      </div>
      
      {/* Challenge Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Active Challenges Tab */}
        {activeTab === 'active' && (
          activeChallenges.length > 0 ? (
            activeChallenges.map(userChallenge => (
              <div 
                key={userChallenge._id} 
                className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{userChallenge.challenge.title}</h3>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    +{userChallenge.challenge.points} pts
                  </div>
                </div>
                
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {userChallenge.challenge.description}
                </p>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{userChallenge.progress || 0}/{userChallenge.challenge.requirements.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${darkMode ? 'bg-emerald-500' : 'bg-orange-500'}`} 
                      style={{ width: `${(userChallenge.progress / userChallenge.challenge.requirements.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {userChallenge.expiresAt && (
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Expires: {new Date(userChallenge.expiresAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No active challenges
              </p>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Check the Available tab to accept new challenges
              </p>
            </div>
          )
        )}
        
        {/* Available Challenges Tab */}
        {activeTab === 'available' && (
          filteredAvailableChallenges.length > 0 ? (
            filteredAvailableChallenges.map(challenge => (
              <div 
                key={challenge._id} 
                className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{challenge.title}</h3>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    +{challenge.points} pts
                  </div>
                </div>
                
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {challenge.description}
                </p>
                
                <div className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span className="inline-block mr-3">
                    Type: {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                  </span>
                  <span className="inline-block">
                    Difficulty: {'⭐'.repeat(challenge.difficultyLevel || 1)}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAcceptChallenge(challenge._id)}
                  className={`w-full py-2 px-4 rounded-md ${
                    darkMode 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  } text-white font-medium transition-colors duration-150`}
                >
                  Accept Challenge
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No available challenges right now
              </p>
              <p className={`mt-2 mb-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Create some starter challenges to get going!
              </p>
              <button 
                onClick={createSampleChallenges}
                className={`px-4 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white`}
              >
                Create Sample Challenges
              </button>
            </div>
          )
        )}
        
        {/* Completed Challenges Tab */}
        {activeTab === 'completed' && (
          completedChallenges.length > 0 ? (
            completedChallenges.map(userChallenge => (
              <div 
                key={userChallenge._id} 
                className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{userChallenge.challenge.title}</h3>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    darkMode ? 'bg-emerald-900' : 'bg-emerald-100'
                  } ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    +{userChallenge.challenge.points} pts
                  </div>
                </div>
                
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {userChallenge.challenge.description}
                </p>
                
                <div className="mt-3 flex items-center">
                  <svg 
                    className={`w-5 h-5 ${darkMode ? 'text-emerald-500' : 'text-emerald-500'} mr-2`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span className="text-sm">
                    Completed on {new Date(userChallenge.completedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No completed challenges yet
              </p>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Complete challenges to see them here
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;