import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../context/ThemeContext';

const PointsNotification = () => {
  const { notifications } = useProgress();
  const { darkMode } = useTheme();
  
  if (!notifications || notifications.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse space-y-reverse space-y-2">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`px-4 py-2 rounded-lg shadow-lg animate-fade-in ${
            darkMode 
              ? 'bg-emerald-900/80 text-emerald-100 backdrop-blur-sm' 
              : 'bg-orange-500/90 text-white backdrop-blur-sm'
          } transition-all duration-300`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default PointsNotification;