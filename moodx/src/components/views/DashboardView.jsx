import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import DailyQuote from '../DailyQuote';
import DailyChallenge from '../DailyChallenge';
import MoodChart from '../MoodChart';
import MoodStats from '../MoodStats';
import WeeklyReflection from '../WeeklyReflection';
import ResourceRecommendations from '../ResourceRecommendations';
import CardPanel from '../common/CardPanel';

const DashboardView = ({ 
  moods, 
  habits, 
  goals,
  onLogMood, 
  onCompleteChallenge,
  completedChallenges,
  customMoodCategories,
  pointsSystem,
  setView
}) => {
  const { darkMode } = useTheme();
  
  // Calculate habit completion rate
  const habitCompletionRate = habits && habits.length > 0
    ? Math.round((habits.filter(h => h.completedToday).length / habits.length) * 100)
    : 0;
  
  // Calculate goal progress
  const goalProgress = goals && goals.length > 0
    ? Math.round((goals.filter(g => g.completed).length / goals.length) * 100)
    : 0;
  
  return (
    <>
      {/* Welcome Hero Section */}
      <div className={`mb-6 p-6 rounded-xl ${darkMode 
        ? 'bg-gradient-to-r from-emerald-800 to-emerald-900 text-white' 
        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'} shadow-xl`}
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Mood Dashboard</h1>
        <p className="opacity-90">Track, analyze and improve your mental wellbeing.</p>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => onLogMood()}
            className="px-4 py-2 bg-white text-emerald-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Log Your Mood
          </button>
          <button
            onClick={() => setView('insights')}
            className="px-4 py-2 bg-emerald-800/30 hover:bg-emerald-800/50 text-white rounded-lg font-medium border border-white/20 transition-colors"
          >
            View Insights
          </button>
        </div>
      </div>

      {/* Three Column Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily Quote */}
        <div className="col-span-1 lg:col-span-2">
          <DailyQuote />
        </div>
        
        {/* Daily Challenge */}
        <div className="col-span-1">
          <DailyChallenge 
            onComplete={onCompleteChallenge} 
            completedChallenges={completedChallenges}
          />
        </div>
        
        {/* Mood Trends */}
        <div className="col-span-1 lg:col-span-2">
          <CardPanel 
            title="Mood Trends" 
            action={
              <button 
                onClick={() => setView('insights')}
                className={`text-sm ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-800'}`}
              >
                View Details
              </button>
            }
          >
            {moods.length > 0 ? (
              <MoodChart moods={moods} simplified={true} />
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>Log your mood to see trends over time</p>
              </div>
            )}
          </CardPanel>
        </div>
        
        {/* Mood Stats */}
        <div className="col-span-1">
          {moods.length > 0 ? (
            <MoodStats moods={moods} simplified={true} />
          ) : (
            <CardPanel title="No Data Yet">
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                Start tracking your mood to see personalized stats and insights.
              </p>
              <button
                onClick={() => onLogMood()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                Log Your First Mood
              </button>
            </CardPanel>
          )}
        </div>
        
        {/* Weekly Reflection */}
        {moods.length >= 3 && (
          <div className="col-span-1 lg:col-span-2">
            <WeeklyReflection moods={moods} />
          </div>
        )}
        
        {/* Resource Recommendations */}
        <div className="col-span-1">
          <CardPanel title="Recommended For You">
            <ResourceRecommendations moods={moods} customMoodCategories={customMoodCategories} />
            <div className="mt-4 text-center">
              <button
                onClick={() => setView('resources')}
                className={`px-4 py-2 ${darkMode 
                  ? 'bg-emerald-900/20 text-emerald-300 hover:bg-emerald-900/40' 
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                } rounded-lg transition font-medium`}
              >
                View All Resources
              </button>
            </div>
          </CardPanel>
        </div>
        
        {/* Progress Summary */}
        <div className="col-span-1 lg:col-span-3">
          <CardPanel 
            title="Progress Tracker" 
            action={
              <button 
                onClick={() => setView('progress')}
                className={`text-sm ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-800'}`}
              >
                Manage
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Habit Completion */}
              <div className={`p-4 rounded-lg ${darkMode
                ? 'bg-emerald-900/10 border-emerald-900/20'
                : 'bg-emerald-50 border-emerald-100'
              } border`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Habits</h3>
                  <span className={`text-sm font-medium ${
                    habitCompletionRate >= 75 ? 'text-green-500' :
                    habitCompletionRate >= 50 ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>{habitCompletionRate}%</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-emerald-600 h-2.5 rounded-full" 
                      style={{ width: `${habitCompletionRate}%` }}
                    ></div>
                  </div>
                </div>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {habits?.filter(h => h.completedToday)?.length || 0}/{habits?.length || 0} habits completed
                </p>
              </div>
              
              {/* Goals Progress */}
              <div className={`p-4 rounded-lg ${darkMode
                ? 'bg-blue-900/10 border-blue-900/20'
                : 'bg-blue-50 border-blue-100'
              } border`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Goals</h3>
                  <span className={`text-sm font-medium ${
                    goalProgress >= 75 ? 'text-green-500' :
                    goalProgress >= 50 ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>{goalProgress}%</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${goalProgress}%` }}
                    ></div>
                  </div>
                </div>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {goals?.filter(g => g.completed)?.length || 0}/{goals?.length || 0} goals achieved
                </p>
              </div>
              
              {/* Points & Level */}
              <div className={`p-4 rounded-lg ${darkMode
                ? 'bg-purple-900/10 border-purple-900/20'
                : 'bg-purple-50 border-purple-100'
              } border`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Level</h3>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    {pointsSystem?.level || 1}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${pointsSystem?.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {pointsSystem?.points || 0} points earned
                </p>
              </div>
            </div>
          </CardPanel>
        </div>
      </div>
    </>
  );
};

export default DashboardView;