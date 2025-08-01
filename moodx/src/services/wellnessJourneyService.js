import axios from 'axios';

const API_URL = 'http://localhost:5000/api/wellness-journey';

// Create authenticated axios instance
const createAuthenticatedAxios = () => {
  const token = localStorage.getItem('token');
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });
  return instance;
};

// Get wellness journey entries
export const getWellnessJourney = async (userId, page = 1, limit = 20) => {
  try {
    const axiosInstance = createAuthenticatedAxios();
    const response = await axiosInstance.get(`/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wellness journey:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch wellness journey');
  }
};

// Create wellness entry
export const createWellnessEntry = async (userId, entryData) => {
  try {
    const axiosInstance = createAuthenticatedAxios();
    const response = await axiosInstance.post(`/${userId}`, entryData);
    return response.data;
  } catch (error) {
    console.error('Error creating wellness entry:', error);
    throw new Error(error.response?.data?.message || 'Failed to create wellness entry');
  }
};

// Update wellness entry
export const updateWellnessEntry = async (entryId, updateData) => {
  try {
    const axiosInstance = createAuthenticatedAxios();
    const response = await axiosInstance.put(`/entry/${entryId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating wellness entry:', error);
    throw new Error(error.response?.data?.message || 'Failed to update wellness entry');
  }
};

// Delete wellness entry
export const deleteWellnessEntry = async (entryId) => {
  try {
    const axiosInstance = createAuthenticatedAxios();
    const response = await axiosInstance.delete(`/entry/${entryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting wellness entry:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete wellness entry');
  }
};

// Get wellness analytics
export const getWellnessAnalytics = async (userId, period = '30d') => {
  try {
    const axiosInstance = createAuthenticatedAxios();
    const response = await axiosInstance.get(`/${userId}/analytics`, {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wellness analytics:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch wellness analytics');
  }
};

// Get wellness statistics
export const getWellnessStats = async (userId) => {
  try {
    const axiosInstance = createAuthenticatedAxios();
    const response = await axiosInstance.get(`/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wellness stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch wellness statistics');
  }
};

// Local storage fallback for offline functionality
export const saveWellnessEntryLocally = (entry) => {
  try {
    const existingEntries = JSON.parse(localStorage.getItem('wellnessEntries') || '[]');
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    existingEntries.unshift(newEntry);
    localStorage.setItem('wellnessEntries', JSON.stringify(existingEntries));
    return newEntry;
  } catch (error) {
    console.error('Error saving wellness entry locally:', error);
    throw new Error('Failed to save wellness entry locally');
  }
};

export const getWellnessEntriesLocally = () => {
  try {
    return JSON.parse(localStorage.getItem('wellnessEntries') || '[]');
  } catch (error) {
    console.error('Error getting wellness entries locally:', error);
    return [];
  }
};

export const deleteWellnessEntryLocally = (entryId) => {
  try {
    const existingEntries = JSON.parse(localStorage.getItem('wellnessEntries') || '[]');
    const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
    localStorage.setItem('wellnessEntries', JSON.stringify(updatedEntries));
    return true;
  } catch (error) {
    console.error('Error deleting wellness entry locally:', error);
    throw new Error('Failed to delete wellness entry locally');
  }
};

export default {
  getWellnessJourney,
  createWellnessEntry,
  updateWellnessEntry,
  deleteWellnessEntry,
  getWellnessAnalytics,
  getWellnessStats,
  saveWellnessEntryLocally,
  getWellnessEntriesLocally,
  deleteWellnessEntryLocally
}; 