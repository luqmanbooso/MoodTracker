import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getChallenges, 
  getUserChallenges, 
  acceptChallenge as apiAcceptChallenge,
  updateChallengeProgress as apiUpdateProgress
} from '../services/challengeApi';
import { useProgress } from './ProgressContext';

// Create context
const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { awardPoints } = useProgress();

  // Fetch challenges and user progress
  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        // Get all challenges with user progress
        const allChallenges = await getChallenges();
        setChallenges(allChallenges);
        
        // Get user's accepted challenges
        const userChallengeData = await getUserChallenges();
        setUserChallenges(userChallengeData);
        
        setError(null);
      } catch (err) {
        console.error('Error loading challenges:', err);
        setError('Failed to load challenges');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChallenges();
  }, []);

  // Accept a challenge
  const acceptChallenge = async (challengeId) => {
    try {
      const result = await apiAcceptChallenge(challengeId);
      
      // Update state
      setUserChallenges(prev => [...prev, result.userChallenge]);
      
      // Update challenges with accept status
      setChallenges(prev => prev.map(challenge => 
        challenge._id === challengeId 
          ? { ...challenge, accepted: true, progress: 0 }
          : challenge
      ));
      
      return result;
    } catch (err) {
      console.error('Error accepting challenge:', err);
      setError('Failed to accept challenge');
      throw err;
    }
  };
  
  // Update challenge progress
  const updateChallengeProgress = async (challengeId, progressIncrement = 1, action) => {
    try {
      // Find current user challenge
      const currentChallenge = userChallenges.find(
        uc => uc.challenge._id === challengeId
      );
      
      if (!currentChallenge) {
        throw new Error('Challenge not found or not accepted');
      }
      
      // Calculate new progress
      const newProgress = Math.min(
        currentChallenge.progress + progressIncrement,
        currentChallenge.challenge.requirements.count
      );
      
      const result = await apiUpdateProgress(challengeId, newProgress, action);
      
      // Update local state
      setUserChallenges(prev => prev.map(uc => 
        uc.challenge._id === challengeId
          ? result.userChallenge
          : uc
      ));
      
      // If challenge was completed, show notification through progress system
      if (result.completed) {
        // This will use the ProgressContext to show a notification
        awardPoints(
          result.pointsAwarded,
          'challenge_complete',
          `Completed challenge: ${result.userChallenge.challenge.title}`
        );
      }
      
      return result;
    } catch (err) {
      console.error('Error updating challenge progress:', err);
      setError('Failed to update challenge progress');
      throw err;
    }
  };
  
  // Track challenge action (e.g., when user logs a mood)
  const trackAction = async (actionType) => {
    try {
      // Find challenges that match this action type
      const matchingChallenges = userChallenges.filter(
        uc => !uc.completed && 
        uc.challenge.requirements.action === actionType
      );
      
      // Update progress for each matching challenge
      for (const challenge of matchingChallenges) {
        await updateChallengeProgress(challenge.challenge._id, 1, actionType);
      }
    } catch (err) {
      console.error('Error tracking challenge action:', err);
    }
  };

  return (
    <ChallengeContext.Provider 
      value={{
        challenges,
        userChallenges,
        isLoading,
        error,
        acceptChallenge,
        updateChallengeProgress,
        trackAction
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenges = () => useContext(ChallengeContext);