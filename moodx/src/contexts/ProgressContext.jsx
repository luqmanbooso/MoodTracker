import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProgress, getAchievements, getStats, awardPoints as apiAwardPoints } from '../services/progressApi';

// Create context
const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  // State based on actual data from API
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Calculate level progress
  const levelProgress = (points % 100) / 100;
  const experienceToNextLevel = 100 - (points % 100);
  
  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get user progress data
        const progressData = await getProgress();
        setPoints(progressData.points);
        setLevel(progressData.level);
        
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
        setIsLoading(false);
      }
    };
    
    fetchData();
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
      // Call the API
      const result = await apiAwardPoints(amount, reason, description);
      
      // Update local state
      setPoints(result.points);
      setLevel(result.level);
      
      // Show notification
      showNotification(`+${amount} points: ${description}`);
      
      // If there are new achievements, update achievements state
      if (result.newAchievements && result.newAchievements.length > 0) {
        setAchievements(prev => [...result.newAchievements, ...prev]);
        
        // Show notifications for new achievements
        result.newAchievements.forEach(achievement => {
          showNotification(`🏆 New achievement: ${achievement.title}`);
        });
      }
      
      return result;
    } catch (err) {
      console.error('Error awarding points:', err);
      setError('Failed to award points');
      return { success: false, error: err.message };
    }
  };
  
  // Context value
  const value = {
    points,
    level,
    achievements,
    notifications,
    awardPoints,
    levelProgress,
    experienceToNextLevel,
    stats,
    isLoading,
    error
  };
  
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);