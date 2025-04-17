import React from 'react';

const HabitCard = ({ habit, theme, onComplete }) => {
  // Check if habit is completed today
  const isCompletedToday = () => {
    if (!habit.completedDates || habit.completedDates.length === 0) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return habit.completedDates.some(date => {
      const completionDate = new Date(date);
      completionDate.setHours(0, 0, 0, 0);
      return completionDate.getTime() === today.getTime();
    });
  };
  
  // Format date to show relative time (today, yesterday, etc)
  const formatLastCompleted = () => {
    if (!habit.lastCompletedAt) return 'Never';
    
    const lastCompleted = new Date(habit.lastCompletedAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastCompleted >= today) {
      return 'Today';
    } else if (lastCompleted >= yesterday) {
      return 'Yesterday';
    } else {
      return lastCompleted.toLocaleDateString();
    }
  };
  
  const completed = isCompletedToday();

  return (
    <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border ${completed ? `border-${theme.primaryColor}-400 dark:border-${theme.primaryColor}-600` : 'border-gray-200 dark:border-gray-800'} transition-all ${completed ? `bg-${theme.primaryColor}-50 dark:bg-${theme.primaryColor}-900/10` : ''}`}>
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl ${completed ? `bg-${theme.primaryColor}-100 dark:bg-${theme.primaryColor}-900/30` : 'bg-gray-100 dark:bg-gray-800'}`}>
            <span>{habit.icon}</span>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {habit.name}
            </h3>
            <div className="flex items-center text-xs">
              <span className={`px-2 py-0.5 rounded-full ${completed ? `bg-${theme.primaryColor}-100 text-${theme.primaryColor}-800 dark:bg-${theme.primaryColor}-900/30 dark:text-${theme.primaryColor}-200` : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                {habit.category}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400">{habit.frequency}</span>
            </div>
          </div>
        </div>
        
        {habit.currentStreak > 0 && (
          <div className="text-center">
            <div className={`text-${theme.primaryColor}-500 flex items-center`}>
              <span className="mr-1">🔥</span>
              <span className="font-semibold">{habit.currentStreak}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
          </div>
        )}
      </div>
      
      <div className="px-5 pb-5">
        {completed ? (
          <div className={`bg-${theme.primaryColor}-100 dark:bg-${theme.primaryColor}-900/30 rounded-lg p-3 flex items-center justify-between`}>
            <div className={`text-${theme.primaryColor}-800 dark:text-${theme.primaryColor}-200 font-medium flex items-center`}>
              <svg className={`w-5 h-5 mr-2 text-${theme.primaryColor}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Completed Today
            </div>
            
            <div className={`text-${theme.primaryColor}-800 dark:text-${theme.primaryColor}-200 text-sm`}>
              {habit.currentStreak > 2 && `+${habit.streakBonus} bonus`}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Last completed:</span>
              <span className="text-gray-800 dark:text-gray-200">{formatLastCompleted()}</span>
            </div>
            
            <button
              onClick={onComplete}
              className={`w-full py-2 bg-${theme.primaryColor}-600 hover:bg-${theme.primaryColor}-700 text-white rounded-lg font-medium transition-colors`}
            >
              Complete Today (+{habit.currentStreak >= 2 ? habit.pointsPerCompletion + habit.streakBonus : habit.pointsPerCompletion} pts)
            </button>
          </div>
        )}
      </div>
      
      {habit.description && (
        <div className="px-5 pb-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
          {habit.description}
        </div>
      )}
    </div>
  );
};

export default HabitCard;