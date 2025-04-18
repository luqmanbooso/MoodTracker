import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ProgressContext = createContext(null);

// Create the provider component with demo data
export const ProgressProvider = ({ children }) => {
  // Demo data for progress
  const [points, setPoints] = useState(() => {
    // Load from localStorage if available, otherwise use demo data
    const savedPoints = localStorage.getItem('progress-points');
    return savedPoints ? parseInt(savedPoints) : 120;
  });
  
  const [level, setLevel] = useState(() => {
    const savedLevel = localStorage.getItem('progress-level');
    return savedLevel ? parseInt(savedLevel) : 3;
  });
  
  const [achievements, setAchievements] = useState(() => {
    const savedAchievements = localStorage.getItem('progress-achievements');
    return savedAchievements ? JSON.parse(savedAchievements) : [
      { id: 'first_mood', title: 'First Mood', description: 'Logged your first mood', completed: true, date: '2025-04-15' },
      { id: 'week_streak', title: 'Week Streak', description: 'Logged moods for 7 consecutive days', completed: true, date: '2025-04-16' },
      { id: 'month_streak', title: 'Month Streak', description: 'Logged moods for 30 consecutive days', completed: false }
    ];
  });
  
  const [notifications, setNotifications] = useState([]);
  
  // Save progress data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('progress-points', points.toString());
    localStorage.setItem('progress-level', level.toString());
    localStorage.setItem('progress-achievements', JSON.stringify(achievements));
  }, [points, level, achievements]);
  
  // Calculate level based on points
  useEffect(() => {
    const newLevel = Math.floor(points / 100) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      showNotification(`🎉 Level up! You're now at level ${newLevel}`);
    }
  }, [points]);
  
  // Function to show a notification
  const showNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  // Function to award points - demo implementation
  const awardPoints = async (amount, reason, description) => {
    // Demo implementation - just add points and show notification
    setPoints(prev => prev + amount);
    showNotification(`+${amount} points: ${description}`);
    
    // Check if this action unlocks any achievements
    checkAchievements(reason);
    
    return { success: true, points: points + amount };
  };
  
  // Check if any achievements should be unlocked
  const checkAchievements = (reason) => {
    // This is a simple demo implementation
    if (reason === 'mood_entry' && achievements.find(a => a.id === 'first_mood' && !a.completed)) {
      unlockAchievement('first_mood');
    }
  };
  
  // Unlock an achievement
  const unlockAchievement = (achievementId) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === achievementId && !a.completed) {
        showNotification(`🏆 Achievement unlocked: ${a.title}`);
        return { ...a, completed: true, date: new Date().toISOString().split('T')[0] };
      }
      return a;
    }));
    
    // Award bonus points for achievement
    setPoints(prev => prev + 50);
  };
  
  // Values to be provided by the context
  const value = {
    points,
    level,
    achievements,
    notifications,
    awardPoints,
    experienceToNextLevel: 100 - (points % 100),
    levelProgress: (points % 100) / 100,
    totalPointsEarned: points,
  };
  
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

// Hook for consuming the context
export const useProgress = () => useContext(ProgressContext);