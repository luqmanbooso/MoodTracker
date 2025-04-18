import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';

const PointsNotification = () => {
  const { notifications } = useProgress();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-10 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 animate-slide-up text-sm md:text-base border-l-4 border-green-500"
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default PointsNotification;