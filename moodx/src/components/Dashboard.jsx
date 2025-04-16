import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import MoodForm from './MoodForm';
import DailyQuote from './DailyQuote';
import MoodStats from './MoodStats';
import MoodChart from './MoodChart';
import MoodAnalysis from './MoodAnalysis';
import DailyChallenge from './DailyChallenge';
import WeeklyReflection from './WeeklyReflection';
import ResourceRecommendations from './ResourceRecommendations';
import QuickMoodEntry from './QuickMoodEntry'; // Create this simplified component

const Dashboard = ({ 
  moods, 
  habits, 
  goals, 
  addMood, 
  isLoading, 
  customMoodCategories, 
  completedChallenges, 
  handleCompleteChallenge,
  setView,
  pointsSystem
}) => {
  const { theme } = useTheme();
  const [showMoodForm, setShowMoodForm] = useState(false);
  
  // Compute streak
  const computeStreak = () => {
    if (moods.length === 0) return 0;
    
    let streak = 1;
    let currentDate = new Date();
    let yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const hasTodayMood = moods.some(mood => 
      new Date(mood.date).toDateString() === currentDate.toDateString()
    );
    
    if (!hasTodayMood) {
      // Check if yesterday has mood
      const hasYesterdayMood = moods.some(mood => 
        new Date(mood.date).toDateString() === yesterday.toDateString()
      );
      
      if (!hasYesterdayMood) return 0;
    }
    
    // Count consecutive days backward
    let checkDate = hasTodayMood ? yesterday : new Date(yesterday);
    checkDate.setDate(checkDate.getDate() - 1);
    
    while (true) {
      const hasMood = moods.some(mood => 
        new Date(mood.date).toDateString() === checkDate.toDateString()
      );
      
      if (!hasMood) break;
      
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  };
  
  // Get user's latest mood status
  const getLatestMoodStatus = () => {
    if (moods.length === 0) return null;
    
    return {
      mood: moods[0].mood,
      time: new Date(moods[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(moods[0].date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }),
      activities: moods[0].activities || [],
      note: moods[0].note || ''
    };
  };
  
  const latestMood = getLatestMoodStatus();
  const streak = computeStreak();

  return (
    <div className="pb-20">
      {/* Welcome Header */}
      <div className={`mb-8 rounded-2xl bg-gradient-to-r from-${theme.primaryColor}-600 to-${theme.primaryColor}-800 text-white p-6 lg:p-8 shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Welcome to MoodX</h1>
        
        {latestMood ? (
          <div className="mt-4">
            <div className="flex items-center">
              <div className={`h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-2xl`}>
                {latestMood.mood === 'Great' ? '😁' : 
                 latestMood.mood === 'Good' ? '🙂' : 
                 latestMood.mood === 'Okay' ? '😐' : 
                 latestMood.mood === 'Bad' ? '😕' : '😞'}
              </div>
              <div className="ml-4">
                <p className="font-medium">You're feeling <span className="font-bold">{latestMood.mood}</span> today</p>
                <p className="text-sm text-white/80">Last updated: {latestMood.time} on {latestMood.date}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-white/90">Start tracking your mood to get personalized insights</p>
        )}
        
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowMoodForm(true)}
            className="px-5 py-2 bg-white text-indigo-700 rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            {latestMood ? 'Update Mood' : 'Log First Mood'}
          </button>
          <button
            onClick={() => setView('chat')}
            className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/30 transition-all"
          >
            Talk to Your Coach
          </button>
        </div>
        
        {streak > 0 && (
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
            <span className="text-xl mr-2">🔥</span>
            <span className="font-bold">{streak} day streak</span>
          </div>
        )}
      </div>
      
      {/* Quick Mood Form Modal */}
      {showMoodForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">How are you feeling?</h2>
                <button 
                  onClick={() => setShowMoodForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <MoodForm 
                addMood={(mood) => {
                  addMood(mood);
                  setShowMoodForm(false);
                }}
                isLoading={isLoading}
                customMoodCategories={customMoodCategories}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily Quote */}
        <div className="col-span-1 lg:col-span-2">
          <DailyQuote />
        </div>
        
        {/* Daily Challenge */}
        <div className="col-span-1">
          <DailyChallenge 
            onComplete={handleCompleteChallenge} 
            completedChallenges={completedChallenges}
          />
        </div>
        
        {/* Mood Analysis */}
        <div className="col-span-1 lg:col-span-2">
          <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800`}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className={`text-xl font-bold ${theme.textColor}`}>Mood Trends</h2>
              <button 
                onClick={() => setView('insights')}
                className={`text-sm text-${theme.primaryColor}-600 hover:text-${theme.primaryColor}-800 dark:text-${theme.primaryColor}-400 dark:hover:text-${theme.primaryColor}-300`}
              >
                View Details
              </button>
            </div>
            <div className="p-5">
              {moods.length > 0 ? (
                <MoodChart moods={moods} simplified={true} />
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>Log your mood to see trends over time</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mood Stats */}
        <div className="col-span-1">
          {moods.length > 0 ? (
            <MoodStats moods={moods} simplified={true} />
          ) : (
            <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 p-6`}>
              <h2 className={`text-xl font-bold mb-4 ${theme.textColor}`}>
                No Data Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start tracking your mood to see personalized stats and insights.
              </p>
              <button
                onClick={() => setShowMoodForm(true)}
                className={`w-full py-3 bg-${theme.primaryColor}-600 hover:bg-${theme.primaryColor}-700 text-white rounded-lg font-medium transition-colors`}
              >
                Log Your First Mood
              </button>
            </div>
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
          <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800`}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className={`text-xl font-bold ${theme.textColor}`}>Recommended For You</h2>
            </div>
            <div className="p-5">
              <ResourceRecommendations moods={moods} customMoodCategories={customMoodCategories} />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setView('resources')}
                  className={`px-4 py-2 bg-${theme.primaryColor}-100 text-${theme.primaryColor}-700 dark:bg-${theme.primaryColor}-900/20 dark:text-${theme.primaryColor}-300 rounded-lg hover:bg-${theme.primaryColor}-200 dark:hover:bg-${theme.primaryColor}-900/40 transition font-medium`}
                >
                  View All Resources
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Summary */}
        <div className="col-span-1 lg:col-span-3">
          <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800`}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className={`text-xl font-bold ${theme.textColor}`}>Progress Tracker</h2>
              <button 
                onClick={() => setView('progress')}
                className={`text-sm text-${theme.primaryColor}-600 hover:text-${theme.primaryColor}-800 dark:text-${theme.primaryColor}-400 dark:hover:text-${theme.primaryColor}-300`}
              >
                Manage
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Habit Completion */}
                <div className={`p-4 rounded-lg bg-${theme.primaryColor}-50 dark:bg-${theme.primaryColor}-900/10 border border-${theme.primaryColor}-100 dark:border-${theme.primaryColor}-900/20`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Habits</h3>
                    <span className={`text-${theme.primaryColor}-600 dark:text-${theme.primaryColor}-400 text-lg font-bold`}>
                      {habits.filter(h => h.completed).length}/{habits.length}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {habits.length > 0 
                      ? `${Math.round((habits.filter(h => h.completed).length / habits.length) * 100)}% completed today` 
                      : 'No habits set up yet'}
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => setView('progress')}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {habits.length > 0 ? 'Check in' : 'Create habit'}
                    </button>
                  </div>
                </div>
                
                {/* Goal Completion */}
                <div className={`p-4 rounded-lg bg-${theme.primaryColor}-50 dark:bg-${theme.primaryColor}-900/10 border border-${theme.primaryColor}-100 dark:border-${theme.primaryColor}-900/20`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Goals</h3>
                    <span className={`text-${theme.primaryColor}-600 dark:text-${theme.primaryColor}-400 text-lg font-bold`}>
                      {goals.filter(g => g.completed).length}/{goals.length}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {goals.length > 0 
                      ? `${Math.round((goals.filter(g => g.completed).length / goals.length) * 100)}% completed` 
                      : 'No goals set up yet'}
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => setView('progress')}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {goals.length > 0 ? 'Review' : 'Set a goal'}
                    </button>
                  </div>
                </div>
                
                {/* Points System */}
                <div className={`p-4 rounded-lg bg-${theme.primaryColor}-50 dark:bg-${theme.primaryColor}-900/10 border border-${theme.primaryColor}-100 dark:border-${theme.primaryColor}-900/20`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Points</h3>
                    <span className={`text-${theme.primaryColor}-600 dark:text-${theme.primaryColor}-400 text-lg font-bold`}>
                      {pointsSystem.totalPoints}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Earn points by completing habits and goals
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => setView('progress')}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View Points
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;