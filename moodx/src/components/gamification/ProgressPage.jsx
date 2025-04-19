import React, { useState, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { getProgress, getAchievements, getStats } from '../../services/progressApi';

const ProgressPage = () => {
  const { points, level, achievements, levelProgress, experienceToNextLevel, isLoading, error } = useProgress();
  const { darkMode } = useTheme();
  const [activityHistory, setActivityHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchActivityHistory = async () => {
      try {
        // Get user progress data which includes points history
        const progressData = await getProgress();
        
        // Format points history for display
        const formattedHistory = progressData.recentHistory.map(item => ({
          id: item.date,
          action: item.description,
          points: item.points,
          date: new Date(item.date).toLocaleDateString(),
          timestamp: new Date(item.date).getTime()
        }));
        
        // Sort by most recent first
        formattedHistory.sort((a, b) => b.timestamp - a.timestamp);
        
        setActivityHistory(formattedHistory);
      } catch (err) {
        console.error('Error fetching activity history:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivityHistory();
  }, []);

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-emerald-500' : 'border-orange-500'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'}`}>
        <p>Error: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-6">Your Progress</h1>
      
      {/* Level and Points */}
      <div className={`mb-8 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Level {level}</h2>
          <div className="text-xl font-medium">
            <span className={darkMode ? 'text-emerald-400' : 'text-orange-500'}>
              {points} points
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-4 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full ${darkMode ? 'bg-emerald-500' : 'bg-orange-500'} transition-all duration-500 ease-out`}
            style={{ width: `${levelProgress * 100}%` }}
          ></div>
        </div>
        <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
          {experienceToNextLevel} points to level {level + 1}
        </p>
      </div>
      
      {/* Achievements */}
      <h2 className="text-2xl font-bold mb-4">Achievements</h2>
      {achievements.length === 0 ? (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mb-8 text-center`}>
          <p className="text-gray-500 dark:text-gray-400">No achievements unlocked yet. Start logging moods and completing challenges to earn them!</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {achievements.map((achievement) => (
            <div 
              key={achievement._id || achievement.id}
              className={`p-4 rounded-lg border ${
                darkMode ? 'border-emerald-500 bg-emerald-900/20' : 'border-orange-500 bg-orange-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  🏆
                </div>
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  {achievement.earnedDate && (
                    <p className="text-xs mt-2 font-medium">
                      Unlocked on {new Date(achievement.earnedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Activity Feed - Real data */}
      <h2 className="text-2xl font-bold mt-10 mb-4">Recent Activity</h2>
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        {activityHistory.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No activity recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {activityHistory.map((item) => (
              <li key={item.id} className="border-b pb-2 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span>{item.action}</span>
                  <span className="text-green-500">+{item.points} pts</span>
                </div>
                <p className="text-xs text-gray-500">{item.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;