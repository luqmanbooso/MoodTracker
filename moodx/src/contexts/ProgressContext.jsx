import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ProgressContext = createContext(null);

// Demo data
const DEMO_ACHIEVEMENTS = [
  { id: 'first_mood', title: 'First Mood', description: 'Logged your first mood', completed: true, date: '2025-04-15' },
  { id: 'week_streak', title: 'Week Streak', description: 'Logged moods for 7 consecutive days', completed: true, date: '2025-04-16' },
  { id: 'month_streak', title: 'Month Streak', description: 'Logged moods for 30 consecutive days', completed: false }
];

export const ProgressProvider = ({ children }) => {
  // State initialization with demo data
  const [points, setPoints] = useState(120);
  const [level, setLevel] = useState(3);
  const [achievements, setAchievements] = useState(DEMO_ACHIEVEMENTS);
  const [notifications, setNotifications] = useState([]);
  
  // Calculate level progress
  const levelProgress = (points % 100) / 100;
  const experienceToNextLevel = 100 - (points % 100);
  
  // Function to show notifications
  const showNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  // Award points function
  const awardPoints = async (amount, reason, description) => {
    setPoints(prev => prev + amount);
    showNotification(`+${amount} points: ${description}`);
    return { success: true };
  };
  
  // Context value
  const value = {
    points,
    level,
    achievements,
    notifications,
    awardPoints,
    levelProgress,
    experienceToNextLevel
  };
  
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);