import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const NotificationSettings = () => {
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('18:00');
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      // If permission is already granted, enable notifications by default
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(localStorage.getItem('notifications-enabled') === 'true');
      }
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notifications-enabled', 'true');
      }
    }
  };
  
  const handleToggleNotifications = () => {
    if (notificationPermission !== 'granted') {
      requestPermission();
    } else {
      const newState = !notificationsEnabled;
      setNotificationsEnabled(newState);
      localStorage.setItem('notifications-enabled', newState.toString());
    }
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setReminderTime(newTime);
    localStorage.setItem('reminder-time', newTime);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Notification Settings</h3>
        
        {!('Notification' in window) ? (
          <div className="text-yellow-600 dark:text-yellow-400 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            Your browser doesn't support notifications.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Mood Check-in</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get a reminder to log your mood</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationsEnabled}
                  onChange={handleToggleNotifications}
                  disabled={notificationPermission === 'denied'}
                />
                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-${theme.primaryColor}-600 ${notificationPermission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
              </label>
            </div>

            {notificationPermission === 'denied' && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                Notifications are blocked. Please update your browser settings to enable notifications.
              </div>
            )}
            
            {notificationsEnabled && (
              <div>
                <label className="block font-medium mb-1">Reminder Time</label>
                <input 
                  type="time"
                  value={reminderTime}
                  onChange={handleTimeChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  You'll receive a notification at this time if you haven't logged your mood for the day.
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="font-medium">Weekly Summary</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get a weekly mood overview</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-${theme.primaryColor}-600`}></div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;