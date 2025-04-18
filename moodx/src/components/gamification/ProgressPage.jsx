import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../context/ThemeContext';

const ProgressPage = () => {
  const { points, level, achievements, levelProgress, experienceToNextLevel } = useProgress();
  const { darkMode } = useTheme();

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
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`p-4 rounded-lg border ${
              achievement.completed 
                ? darkMode ? 'border-emerald-500 bg-emerald-900/20' : 'border-orange-500 bg-orange-50' 
                : 'border-gray-300 dark:border-gray-700 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {achievement.completed ? '🏆' : '🔒'}
              </div>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                {achievement.completed && achievement.date && (
                  <p className="text-xs mt-2 font-medium">
                    Unlocked on {achievement.date}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Activity Feed - Demo data */}
      <h2 className="text-2xl font-bold mt-10 mb-4">Recent Activity</h2>
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <ul className="space-y-3">
          <li className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <span>Logged your mood</span>
              <span className="text-green-500">+10 pts</span>
            </div>
            <p className="text-xs text-gray-500">Today</p>
          </li>
          <li className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <span>Completed daily reflection</span>
              <span className="text-green-500">+15 pts</span>
            </div>
            <p className="text-xs text-gray-500">Yesterday</p>
          </li>
          <li className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <span>Completed Week Streak achievement</span>
              <span className="text-green-500">+50 pts</span>
            </div>
            <p className="text-xs text-gray-500">Apr 16, 2025</p>
          </li>
          <li>
            <div className="flex justify-between">
              <span>Logged your first mood</span>
              <span className="text-green-500">+50 pts</span>
            </div>
            <p className="text-xs text-gray-500">Apr 15, 2025</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProgressPage;