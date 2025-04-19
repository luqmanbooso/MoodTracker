import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get all available challenges
export const getChallenges = async () => {
  try {
    const response = await axios.get(`${API_URL}/challenges`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
};

// Get user challenges
export const getUserChallenges = async () => {
  try {
    const response = await axios.get(`${API_URL}/challenges/user`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    throw error;
  }
};

// Accept a challenge
export const acceptChallenge = async (challengeId) => {
  try {
    const response = await axios.post(
      `${API_URL}/challenges/${challengeId}/accept`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error accepting challenge:', error);
    throw error;
  }
};

// Update challenge progress
export const updateChallengeProgress = async (challengeId, progress, action) => {
  try {
    const response = await axios.patch(
      `${API_URL}/challenges/${challengeId}/progress`,
      { progress, action },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    throw error;
  }
};