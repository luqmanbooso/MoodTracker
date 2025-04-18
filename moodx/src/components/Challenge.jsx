// In your challenge completion handler:
import { completeChallenge } from '../services/api';
import { useProgress } from '../contexts/ProgressContext';

const ChallengeComponent = () => {
  // Your existing state
  const { awardPoints } = useProgress();
  
  const handleCompleteChallenge = async (challengeId) => {
    try {
      // Complete challenge
      await completeChallenge(challengeId);
      
      // Award points
      await awardPoints(15, 'challenge_complete', 'Completed daily challenge');
      
      // Update UI
      
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };
  
  // Rest of component
};