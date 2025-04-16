const API_URL = 'http://localhost:5000/api';

// Mood API endpoints
export const getMoods = async () => {
  try {
    const response = await fetch(`${API_URL}/moods`);
    if (!response.ok) {
      throw new Error(`Failed to fetch moods: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching moods:', error);
    throw error;
  }
};

export const createMood = async (moodData) => {
  try {
    const response = await fetch(`${API_URL}/moods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moodData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create mood: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating mood:', error);
    throw error;
  }
};

export const deleteMood = async (id) => {
  try {
    const response = await fetch(`${API_URL}/moods/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete mood: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting mood:', error);
    throw error;
  }
};

// Challenge API endpoints
export const getTodayChallenge = async () => {
  try {
    const response = await fetch(`${API_URL}/challenges/today`);
    if (!response.ok) {
      throw new Error(`Failed to fetch challenge: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching challenge:', error);
    throw error;
  }
};

export const completeChallenge = async (id) => {
  try {
    const response = await fetch(`${API_URL}/challenges/complete/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to complete challenge: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error completing challenge:', error);
    throw error;
  }
};

export const getChallengeHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/challenges/history`);
    if (!response.ok) {
      throw new Error(`Failed to fetch challenge history: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching challenge history:', error);
    throw error;
  }
};