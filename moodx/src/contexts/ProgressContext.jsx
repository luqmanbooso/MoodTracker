import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProgress, getAchievements, getStats, getActivities, awardPoints as apiAwardPoints } from '../services/progressApi';

// Create context
const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  // State based on actual data from API
  const [progress, setProgress] = useState({});
  const [activities, setActivities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load initial data
  const fetchProgress = async () => {
    setLoading(true);
    try {
      // Get user progress data
      const progressData = await getProgress();
      setProgress(progressData);
      
      // Get activities
      const activitiesData = await getActivities();
      setActivities(activitiesData);
      
      // Get achievements
      const achievementsData = await getAchievements();
      setAchievements(achievementsData);
      
      // Get stats
      const statsData = await getStats();
      setStats(statsData);
      
      setError(null);
    } catch (err) {
      console.error('Error loading progress data:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProgress();
  }, []);
  
  // Function to show notifications
  const showNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  // Award points function - actually calls the API
  const awardPoints = async (amount, reason, description) => {
    try {
      console.log('ProgressContext: Awarding points:', { amount, reason, description });
      
      // Call the API
      const result = await apiAwardPoints(amount, reason, description);
      console.log('ProgressContext: API call successful:', result);
      
      // Refresh progress data
      await fetchProgress();
      
      // Show notification
      showNotification(`+${amount} points: ${description}`);
      
      return result;
    } catch (err) {
      console.error('ProgressContext: Error awarding points:', err);
      setError('Failed to award points: ' + err.message);
      return { success: false, error: err.message };
    }
  };
  
  // Context value
  const value = {
    progress,
    activities,
    achievements,
    stats,
    notifications,
    loading,
    error,
    fetchProgress,
    awardPoints,
    showNotification
  };
  
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);