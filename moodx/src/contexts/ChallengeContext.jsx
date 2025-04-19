import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch challenges on component mount
  useEffect(() => {
    fetchChallenges();
  }, []);

  // Fetch all challenges and user challenges
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get available challenges first
      console.log('Fetching available challenges...');
      const challengesResponse = await axios.get(`${API_URL}/challenges`);
      setAvailableChallenges(challengesResponse.data || []);
      
      // Try to get user challenges, but don't fail if it doesn't work
      try {
        console.log('Fetching user challenges...');
        const userChallengesResponse = await axios.get(`${API_URL}/challenges/user`);
        setUserChallenges(userChallengesResponse.data || []);
      } catch (userErr) {
        console.warn('Error fetching user challenges (continuing anyway):', userErr);
        setUserChallenges([]); // Set empty array on error
      }
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Failed to load challenges');
      setAvailableChallenges([]); // Set empty arrays on error
      setUserChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  // Accept a challenge
  const acceptChallenge = async (challengeId) => {
    try {
      const response = await axios.post(
        `${API_URL}/challenges/${challengeId}/accept`
      );
      
      if (response.data.userChallenge) {
        setUserChallenges(prev => [...prev, response.data.userChallenge]);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error accepting challenge:', err);
      throw err;
    }
  };

  // Track an action
  const trackAction = async (action, payload = {}) => {
    try {
      // Find all user challenges that have this action requirement and aren't completed
      const relevantChallenges = userChallenges.filter(
        uc => !uc.completed && uc.challenge?.requirements?.action === action
      );
      
      for (const userChallenge of relevantChallenges) {
        // Update progress locally
        const newProgress = userChallenge.progress + 1;
        
        // Check if challenge is completed
        const isCompleted = newProgress >= userChallenge.challenge.requirements.count;
        
        // Update the challenge progress on the server
        await axios.patch(
          `${API_URL}/challenges/${userChallenge.challenge._id}/progress`,
          { progress: newProgress }
        );
        
        // Update local state
        setUserChallenges(prev => 
          prev.map(uc => 
            uc._id === userChallenge._id 
              ? { ...uc, progress: newProgress, completed: isCompleted } 
              : uc
          )
        );
      }
      
      return {
        updated: relevantChallenges.length > 0,
        challenges: relevantChallenges
      };
    } catch (err) {
      console.error(`Error tracking action ${action}:`, err);
      throw err;
    }
  };

  // Get a random challenge (for daily challenge)
  const getRandomChallenge = async () => {
    try {
      const response = await axios.get(`${API_URL}/challenges/random`);
      return response.data;
    } catch (err) {
      console.error('Error getting random challenge:', err);
      throw err;
    }
  };

  return (
    <ChallengeContext.Provider value={{
      availableChallenges,
      userChallenges,
      loading,
      error,
      fetchChallenges,
      acceptChallenge,
      trackAction,
      getRandomChallenge
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenges = () => useContext(ChallengeContext);