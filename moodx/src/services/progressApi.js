const API_URL = 'http://localhost:5000/api';

export const getProgress = async () => {
  try {
    const response = await fetch(`${API_URL}/progress`);
    if (!response.ok) {
      throw new Error(`Failed to fetch progress: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
};

export const getAchievements = async () => {
  try {
    const response = await fetch(`${API_URL}/progress/achievements`);
    if (!response.ok) {
      throw new Error(`Failed to fetch achievements: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    const response = await fetch(`${API_URL}/progress/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const awardPoints = async (points, reason, description) => {
  try {
    const response = await fetch(`${API_URL}/progress/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ points, reason, description }),
    });
    if (!response.ok) {
      throw new Error(`Failed to award points: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};