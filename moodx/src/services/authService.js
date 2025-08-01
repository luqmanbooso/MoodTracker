import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Set up axios to include auth token in requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Initialize auth token on app load
const initAuth = () => {
  const token = getToken();
  if (token) {
    setAuthToken(token);
  }
};

// Register new user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    const { token, user } = response.data;
    setAuthToken(token);
    return { user, token };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Login user
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const { token, user } = response.data;
    setAuthToken(token);
    return { user, token };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Logout user
const logout = () => {
  setAuthToken(null);
};

// Get user profile
const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data.user;
  } catch (error) {
    console.error('Get profile error:', error);
    throw new Error(error.response?.data?.message || 'Failed to get profile');
  }
};

// Update user profile
const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, profileData);
    return response.data.user;
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Change password
const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.put(`${API_URL}/change-password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

// Delete account
const deleteAccount = async (password) => {
  try {
    const response = await axios.delete(`${API_URL}/account`, {
      data: { password }
    });
    return response.data;
  } catch (error) {
    console.error('Delete account error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete account');
  }
};

// Export user data
const exportData = async () => {
  try {
    const response = await axios.get(`${API_URL}/export-data`);
    return response.data;
  } catch (error) {
    console.error('Export data error:', error);
    throw new Error(error.response?.data?.message || 'Failed to export data');
  }
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  exportData,
  isAuthenticated,
  setAuthToken,
  getToken,
  initAuth
};

export default authService; 