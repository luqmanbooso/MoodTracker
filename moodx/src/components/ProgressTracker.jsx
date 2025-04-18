import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import HabitBuilder from './HabitBuilder';
import GoalTracker from './GoalTracker';

const ProgressTracker = ({ habits = [], goals = [], onAddHabit, onCompleteHabit, onAddGoal, onUpdateGoal }) => {
  const { theme, darkMode } = useTheme();

  // Create theme-aware styles
  const styles = {
    primaryColor: darkMode ? 'emerald' : 'orange',
    primaryText: darkMode ? 'text-emerald-500' : 'text-orange-500',
    primaryBg: darkMode ? 'bg-emerald-500' : 'bg-orange-500',
    primaryHover: darkMode ? 'hover:bg-emerald-600' : 'hover:bg-orange-600',
    primaryLight: darkMode ? 'bg-emerald-500/20' : 'bg-orange-500/10',
    progressTrack: darkMode ? 'bg-gray-700' : 'bg-gray-200',
    progressFill: darkMode ? 'bg-emerald-500' : 'bg-orange-500',
    cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
    cardBorder: darkMode ? 'border-gray-700' : 'border-gray-200',
    headerText: darkMode ? 'text-white' : 'text-gray-800',
    bodyText: darkMode ? 'text-gray-300' : 'text-gray-600',
  };

  const [activeTab, setActiveTab] = useState('habits');
  
  const stats = {
    habits: {
      total: habits.length,
      completed: habits.filter(h => h.completed).length,
      streaks: habits.reduce((sum, habit) => sum + (habit.streak || 0), 0)
    },
    goals: {
      total: goals.length,
      completed: goals.filter(g => g.completed).length,
      inProgress: goals.filter(g => !g.completed).length
    }
  };
  
  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className={`mb-6 p-6 rounded-xl bg-gradient-to-r from-${styles.primaryColor}-600 via-${styles.primaryColor}-500 to-${styles.primaryColor}-700 text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20v-6M6 20V10M18 20V4"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Progress Tracker</h1>
        <p className="opacity-90">Build habits and achieve your goals.</p>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{stats.habits.total}</div>
            <div className="text-sm opacity-90">Active Habits</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{stats.habits.streaks}</div>
            <div className="text-sm opacity-90">Total Streaks</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{stats.goals.total}</div>
            <div className="text-sm opacity-90">Goals Set</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{stats.goals.completed}</div>
            <div className="text-sm opacity-90">Goals Achieved</div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab('habits')}
          className={`py-3 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'habits'
              ? `border-${styles.primaryColor}-500 text-${styles.primaryColor}-600 dark:text-${styles.primaryColor}-400`
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Habits
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`py-3 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'goals'
              ? `border-${styles.primaryColor}-500 text-${styles.primaryColor}-600 dark:text-${styles.primaryColor}-400`
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Goals
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`py-3 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'achievements'
              ? `border-${styles.primaryColor}-500 text-${styles.primaryColor}-600 dark:text-${styles.primaryColor}-400`
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`py-3 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'challenges'
              ? `border-${styles.primaryColor}-500 text-${styles.primaryColor}-600 dark:text-${styles.primaryColor}-400`
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Challenges
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'habits' && (
        <div>
          <HabitBuilder 
            habits={habits}
            onAddHabit={onAddHabit}
            onCompleteHabit={onCompleteHabit}
          />
        </div>
      )}
      
      {activeTab === 'goals' && (
        <div>
          <GoalTracker 
            goals={goals}
            onAddGoal={onAddGoal}
            onUpdateGoal={onUpdateGoal}
          />
        </div>
      )}
      
      {activeTab === 'achievements' && (
        <div className={`${styles.cardBg} rounded-xl shadow-lg overflow-hidden border ${styles.cardBorder} p-6`}>
          <h2 className={`text-xl font-bold mb-6 ${styles.headerText}`}>Your Achievements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Achievement Cards */}
            <div className={`p-4 border ${styles.cardBorder} rounded-lg ${styles.cardBg} relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 bg-${styles.primaryColor}-100 dark:bg-${styles.primaryColor}-900/30 text-${styles.primaryColor}-800 dark:text-${styles.primaryColor}-200 text-xs px-2 py-1 rounded-bl-lg`}>
                Unlocked
              </div>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full bg-${styles.primaryColor}-100 dark:bg-${styles.primaryColor}-900/20 flex items-center justify-center mr-4`}>
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${styles.headerText}`}>Consistency Master</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Complete a 7-day streak</p>
                </div>
              </div>
              <div className={`w-full ${styles.progressTrack} rounded-full h-2.5 mb-1`}>
                <div className={`${styles.progressFill} rounded-full h-2.5`} style={{ width: '100%' }}></div>
              </div>
              <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                Completed
              </div>
            </div>
            
            <div className={`p-4 border ${styles.cardBorder} rounded-lg ${styles.cardBg} relative overflow-hidden grayscale opacity-70`}>
              <div className="absolute top-0 right-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-bl-lg">
                Locked
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${styles.headerText}`}>Goal Getter</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Complete 5 goals</p>
                </div>
              </div>
              <div className={`w-full ${styles.progressTrack} rounded-full h-2.5 mb-1`}>
                <div className="bg-gray-400 dark:bg-gray-600 rounded-full h-2.5" style={{ width: '40%' }}></div>
              </div>
              <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                2/5 completed
              </div>
            </div>
            
            {/* More achievement cards would go here */}
          </div>
        </div>
      )}
      
      {activeTab === 'challenges' && (
        <div className={`${styles.cardBg} rounded-xl shadow-lg overflow-hidden border ${styles.cardBorder} p-6`}>
          <h2 className={`text-xl font-bold mb-6 ${styles.headerText}`}>Challenge History</h2>
          
          <div className="space-y-4">
            <div className={`p-4 border ${styles.cardBorder} rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-green-50 dark:bg-green-900/20`}>
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-3">
                  <span className="text-xl">🙏</span>
                </div>
                <div>
                  <h3 className="font-medium">3 Things Gratitude</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Mindfulness</p>
                </div>
              </div>
              <div className={`text-sm ${styles.bodyText} col-span-1 md:col-span-2`}>
                Write down three things you're grateful for today.
              </div>
              <div className="flex items-center justify-end">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completed
                </span>
              </div>
            </div>
            
            <div className={`p-4 border ${styles.cardBorder} rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-white dark:bg-gray-800`}>
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 mr-3">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <h3 className="font-medium">Give a Compliment</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Social</p>
                </div>
              </div>
              <div className={`text-sm ${styles.bodyText} col-span-1 md:col-span-2`}>
                Give a genuine compliment to someone in your life.
              </div>
              <div className="flex items-center justify-end">
                <span className="text-gray-500 dark:text-gray-400 text-xs">April 15, 2025</span>
              </div>
            </div>
            
            {/* More challenge history entries would go here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;