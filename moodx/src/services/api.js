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
    console.log('Sending mood data to API:', moodData);
    const response = await fetch(`${API_URL}/moods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood: moodData.mood,
        customMood: moodData.customMood || '',
        intensity: moodData.intensity,
        note: moodData.note || '',
        activities: moodData.activities || [],
        tags: moodData.tags || [],
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to create mood: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }
    const responseData = await response.json();
    console.log('Mood created successfully:', responseData);
    return responseData;
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

// Quote API endpoints
export const getDailyQuote = async () => {
  try {
    const response = await fetch(`${API_URL}/quotes/daily`);
    if (!response.ok) {
      throw new Error(`Failed to fetch daily quote: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching daily quote:', error);
    throw error;
  }
};