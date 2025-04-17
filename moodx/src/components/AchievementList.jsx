import React, { useState } from 'react';

const AchievementList = ({ achievements, theme }) => {
  const [filter, setFilter] = useState('All');

  // Get unique achievement categories
  const categories = ['All', ...new Set(achievements.map(a => a.category))];
  
  // Filter achievements by category
  const filteredAchievements = filter === 'All' 
    ? achievements 
    : achievements.filter(a => a.category === filter);
  
  // Group achievements by category for display
  const groupedAchievements = filteredAchievements.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Your Achievements</h2>
        <div className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">{achievements.length}</span> achievements unlocked
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === category 
                ? `bg-${theme.primaryColor}-600 text-white` 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {filteredAchievements.length === 0 ? (
        <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 p-10 text-center`}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No Achievements Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Start logging your moods, completing challenges, and building habits to unlock achievements.
          </p>
        </div>
      ) : (
        Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              {category === 'Mood' && (
                <span className="mr-2 text-blue-500">📝</span>
              )}
              {category === 'Habit' && (
                <span className="mr-2 text-green-500">🌱</span>
              )}
              {category === 'Challenge' && (
                <span className="mr-2 text-amber-500">🏆</span>
              )}
              {category === 'Streak' && (
                <span className="mr-2 text-orange-500">🔥</span>
              )}
              {category === 'Engagement' && (
                <span className="mr-2 text-purple-500">⚡</span>
              )}
              {category === 'Special' && (
                <span className="mr-2 text-pink-500">🎯</span>
              )}
              {category} Achievements
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map(achievement => (
                <div 
                  key={achievement._id} 
                  className={`${theme.cardBg} rounded-xl shadow-md overflow-hidden border border-${theme.primaryColor}-200 dark:border-${theme.primaryColor}-900/40`}
                >
                  <div className={`p-4 flex items-start justify-between bg-${theme.primaryColor}-50 dark:bg-${theme.primaryColor}-900/10 border-b border-${theme.primaryColor}-100 dark:border-${theme.primaryColor}-900/30`}>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-white dark:bg-gray-800 shadow-sm">
                        {achievement.icon}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                          {achievement.name}
                        </h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 bg-${theme.primaryColor}-100 text-${theme.primaryColor}-800 dark:bg-${theme.primaryColor}-900/30 dark:text-${theme.primaryColor}-200 rounded-full text-xs font-medium`}>
                      +{achievement.pointsAwarded} pts
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AchievementList;