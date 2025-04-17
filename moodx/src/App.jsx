import { useState, useEffect } from 'react';
import { getMoods, createMood, deleteMood } from './services/api';
import Navigation from './components/Navigation';
import MoodForm from './components/MoodForm';
import MoodList from './components/MoodList';
import DailyQuote from './components/DailyQuote';
import MoodChart from './components/MoodChart';
import MoodStats from './components/MoodStats';
import MoodAchievements from './components/MoodAchievements';
import PersonalizedTips from './components/PersonalizedTips';
import MoodPrediction from './components/MoodPrediction';
import ThemeSettings from './components/ThemeSettings';
import DailyChallenge from './components/DailyChallenge';
import MoodAnalysis from './components/MoodAnalysis';
import WeeklyReflection from './components/WeeklyReflection';
import KindnessGenerator from './components/KindnessGenerator';
import CustomMoodManager from './components/CustomMoodManager';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import PointsSystem from './components/PointsSystem';
import PointsDisplay from './components/PointsDisplay';
import ResourcesHub from './components/ResourcesHub';
import ResourceRecommendations from './components/ResourceRecommendations';
import AccountabilityDashboard from './components/AccountabilityDashboard';
import HabitBuilder from './components/HabitBuilder';
import GoalTracker from './components/GoalTracker';
import MoodAssistant from './components/MoodAssistant';
import Settings from './components/Settings';
import ProgressTracker from './components/ProgressTracker';
import UserGreeting from './components/UserGreeting';

// Main App component wrapper with ThemeProvider
function AppWithTheme() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// Main App content
function AppContent() {
  const { theme, darkMode } = useTheme();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'log', 'stats', 'challenges', 'resources', 'settings'
  const [customMoodCategories, setCustomMoodCategories] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('custom-moods');
    return saved ? JSON.parse(saved) : ['Motivated', 'Anxious', 'Energetic', 'Creative', 'Bored'];
  });
  
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem('completed-challenges');
    return saved ? JSON.parse(saved) : [];
  });

  const pointsSystem = PointsSystem({ userId: 'default-user' });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [showMoodForm, setShowMoodForm] = useState(false);
  
  const streak = computeStreak();

  // Add this state for controlling the settings modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Fetch moods on component mount
  useEffect(() => {
    fetchMoods();
  }, []);

  // Save custom moods to localStorage when they change
  useEffect(() => {
    localStorage.setItem('custom-moods', JSON.stringify(customMoodCategories));
  }, [customMoodCategories]);
  
  // Save completed challenges
  useEffect(() => {
    localStorage.setItem('completed-challenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  // Add to App.jsx (in the useEffect section)
  useEffect(() => {
    // Set up reminder notification
    const checkAndSendReminder = () => {
      const lastMoodDate = moods[0]?.date ? new Date(moods[0].date) : null;
      const now = new Date();
      
      // If no mood logged today and it's after 6pm, remind user
      if (!lastMoodDate || lastMoodDate.toDateString() !== now.toDateString()) {
        if (now.getHours() >= 18) {
          // Check if browser supports notifications
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Mood Check-in", {
              body: "Don't forget to log your mood today! 🙂",
              icon: "/favicon.ico"
            });
          }
        }
      }
    };
    
    // Request notification permission
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    
    // Check every hour
    const interval = setInterval(checkAndSendReminder, 3600000);
    return () => clearInterval(interval);
  }, [moods]);

  const fetchMoods = async () => {
    try {
      setLoading(true);
      // Using dummy data for now - replace with actual API call
      setTimeout(() => {
        const dummyData = [
          {
            _id: '1',
            mood: 'Good',
            customMood: 'Motivated',
            intensity: 7,
            note: 'Had a productive day at work!',
            activities: ['Work', 'Exercise'],
            tags: ['productive', 'active'],
            date: new Date()
          },
          {
            _id: '2',
            mood: 'Okay',
            customMood: 'Reflective',
            intensity: 5,
            note: 'Feeling a bit tired today but had some good moments of reflection',
            activities: ['Rest', 'Reading'],
            tags: ['tired', 'peaceful'],
            date: new Date(Date.now() - 86400000) // Yesterday
          }
        ];
        setMoods(dummyData);
        setLoading(false);
      }, 1000);
      
      // Uncomment when API is ready
      // const data = await getMoods();
      // setMoods(data);
      setError(null);
    } catch (err) {
      setError('Failed to load moods. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMood = async (moodData) => {
    try {
      setLoading(true);
      // In a real app, this would call an API
      const newMood = {
        _id: Date.now().toString(),
        ...moodData,
        date: new Date()
      };
      setMoods(prevMoods => [newMood, ...prevMoods]);
      
      // Award points for logging mood
      pointsSystem.awardPoints('LOG_MOOD');
      
      // Award points for additional actions
      if (moodData.note && moodData.note.trim().length > 0) {
        pointsSystem.awardPoints('ADD_NOTE');
      }
      
      if (moodData.activities && moodData.activities.length > 0) {
        pointsSystem.awardPoints('ADD_ACTIVITIES');
      }
      
      if (moodData.tags && moodData.tags.length > 0) {
        pointsSystem.awardPoints('ADD_TAGS');
      }

      // Close the mood form if it was shown as modal
      setShowMoodForm(false);
      
      // Uncomment when API is ready
      // const newMood = await createMood(moodData);
      // setMoods(prevMoods => [newMood, ...prevMoods]);
    } catch (err) {
      setError('Failed to add mood. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMood = async (id) => {
    try {
      // In a real app, this would call an API
      setMoods(prevMoods => prevMoods.filter(mood => mood._id !== id));
      
      // Uncomment when API is ready
      // await deleteMood(id);
      // setMoods(prevMoods => prevMoods.filter(mood._id !== id));
    } catch (err) {
      setError('Failed to delete mood. Please try again.');
      console.error(err);
    }
  };

  const handleAddCustomMood = (newCategory) => {
    if (newCategory && !customMoodCategories.includes(newCategory)) {
      setCustomMoodCategories(prev => [...prev, newCategory]);
    }
  };

  const handleRemoveCustomMood = (category) => {
    setCustomMoodCategories(prev => prev.filter(c => c !== category));
  };

  const handleCompleteChallenge = (challengeId) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges(prev => [...prev, challengeId]);
      
      // Award points for completing challenge
      pointsSystem.awardPoints('COMPLETE_CHALLENGE', { challengeId });
    }
  };

  // Add to App.jsx - computeStreak function
  function computeStreak() {
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

  const handleAddHabit = (habit) => {
    setHabits(prev => [habit, ...prev]);
    // Award points for creating a new habit
    pointsSystem.awardPoints('CREATE_HABIT');
  };

  const handleCompleteHabit = (habitId) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const wasCompleted = habit.completed;
        const newStreak = !wasCompleted ? (habit.streak || 0) + 1 : (habit.streak || 0);
        
        // Only award points if the habit wasn't already completed
        if (!wasCompleted) {
          pointsSystem.awardPoints('COMPLETE_HABIT');
        }
        
        return { ...habit, completed: !wasCompleted, streak: newStreak };
      }
      return habit;
    }));
  };

  const handleAddGoal = (goal) => {
    // Format milestones as objects
    const formattedGoal = {
      ...goal,
      milestones: goal.milestones.map(milestone => ({
        text: milestone,
        completed: false
      }))
    };
    
    setGoals(prev => [formattedGoal, ...prev]);
    // Award points for setting a new goal
    pointsSystem.awardPoints('SET_GOAL');
  };

  const handleUpdateGoal = (updatedGoal) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === updatedGoal.id) {
        // Check if a milestone was just completed
        const prevCompletedCount = goal.milestones.filter(m => m.completed).length;
        const newCompletedCount = updatedGoal.milestones.filter(m => m.completed).length;
        
        if (newCompletedCount > prevCompletedCount) {
          // Award points for completing a milestone
          pointsSystem.awardPoints('COMPLETE_MILESTONE');
        }
        
        // Check if the entire goal was completed
        if (updatedGoal.completed && !goal.completed) {
          // Award points for completing the whole goal
          pointsSystem.awardPoints('COMPLETE_GOAL');
        }
        
        return updatedGoal;
      }
      return goal;
    }));
  };

  // Add useEffect to save habits and goals
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const latestMood = moods.length > 0 ? {
    mood: moods[0].mood,
    time: new Date(moods[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date(moods[0].date).toLocaleDateString()
  } : null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <Navigation 
        activeView={view} 
        setView={setView}
        // This is the important part - pass the function to open the modal
        openSettingsModal={() => setIsSettingsModalOpen(true)}
      />
      
      <div className="md:ml-64 pt-16 md:pt-0">
        <div className="pt-16 md:pt-4 px-4 md:px-6 lg:px-8 pb-20">
          {/* Top Bar with Points Display */}
          <div className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 py-3 mb-6">
            <div className="flex justify-between items-center">
              <h1 className={`text-2xl font-bold text-gray-800 dark:text-gray-100`}>
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </h1>
              <div className="flex items-center gap-4">
                <PointsDisplay 
                  points={pointsSystem.points}
                  level={pointsSystem.levelNumber || (typeof pointsSystem.level === 'object' ? pointsSystem.level.level : pointsSystem.level)}
                  nextLevel={pointsSystem.nextLevel}
                  progress={pointsSystem.progress}
                  showAnimation={pointsSystem.showAnimation}
                  justEarned={pointsSystem.justEarned}
                  levelUp={pointsSystem.levelUp}
                />
              </div>
            </div>
          </div>
          
          {/* Error message display */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 shadow-md">
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* Dashboard View */}
          {view === 'dashboard' && (
            <>
              {/* Welcome Hero Section */}
              <UserGreeting 
                moods={moods} 
                onLogMood={(mood) => {
                  if (mood) {
                    handleAddMood({ 
                      mood: mood,
                      customMood: '',
                      intensity: 5,
                      note: '',
                      activities: [],
                      tags: []
                    });
                  } else {
                    setShowMoodForm(true);
                  }
                }} 
              />

              {/* Three Column Dashboard Grid */}
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
                
                {/* Mood Trends */}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                        
                        {/* Goals Completion */}
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
                        
                        {/* Points */}
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
            </>
          )}
          
          {/* Other views - just include the basic structure here */}
          {view === 'log' && (
            <div className="animate-fade-in">
              <div className={`mb-6 p-6 rounded-xl bg-gradient-to-r from-${theme.primaryColor}-600 via-${theme.primaryColor}-500 to-${theme.primaryColor}-700 text-white shadow-xl`}>
                <h1 className="text-3xl font-bold mb-2">How Are You Feeling Today?</h1>
                <p className="opacity-90">Track your emotions to build self-awareness and identify patterns.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800`}>
                  <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                    <h2 className={`text-xl font-bold ${theme.textColor} flex items-center`}>
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2 rounded-lg mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      Log Your Mood
                    </h2>
                  </div>
                  <div className="p-6">
                    <MoodForm 
                      addMood={handleAddMood} 
                      isLoading={loading} 
                      customMoodCategories={customMoodCategories}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  {moods.length > 0 && (
                    <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800`}>
                      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                        <h2 className={`text-xl font-bold ${theme.textColor} flex items-center`}>
                          <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-2 rounded-lg mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </span>
                          Personalized Tips
                        </h2>
                      </div>
                      <div className="p-6">
                        <PersonalizedTips moods={moods} />
                      </div>
                    </div>
                  )}
                  
                  <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800`}>
                    <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                      <h2 className={`text-xl font-bold ${theme.textColor} flex items-center`}>
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-lg mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        Your Mood History
                      </h2>
                    </div>
                    <div className="p-6">
                      {loading ? (
                        <div className="flex justify-center items-center h-40">
                          <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-${theme.primaryColor}-500`}></div>
                        </div>
                      ) : moods.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-gray-600 dark:text-gray-400">No mood entries yet. Add your first mood!</p>
                        </div>
                      ) : (
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                          <MoodList moods={moods} deleteMood={handleDeleteMood} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {moods.length > 0 && (
                <div className="mt-6">
                  <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800`}>
                    <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                      <h2 className={`text-xl font-bold ${theme.textColor} flex items-center`}>
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-2 rounded-lg mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </span>
                        Quick Mood Insights
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <MoodChart moods={moods} simplified={true} />
                        </div>
                        <div>
                          <MoodStats moods={moods} simplified={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Insights View */}
          {view === 'insights' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 p-6`}>
                  <h2 className={`text-xl font-bold mb-4 ${theme.textColor}`}>
                    Mood Trends
                  </h2>
                  <MoodChart moods={moods} />
                </div>
              </div>
              
              <div>
                <MoodStats moods={moods} />
              </div>
              
              <div className="lg:col-span-3">
                <MoodAnalysis moods={moods} />
              </div>
              
              <div className="lg:col-span-2">
                <WeeklyReflection moods={moods} />
              </div>
              
              <div>
                <MoodAchievements moods={moods} />
              </div>
            </div>
          )}
          
          {/* Other views would go here */}
          {/* ... */}

          {/* Modal for logging mood */}
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
                      handleAddMood(mood);
                      setShowMoodForm(false);
                    }}
                    isLoading={loading}
                    customMoodCategories={customMoodCategories}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Add dedicated Chat view */}
          {view === 'chat' && (
            <div className="h-[calc(100vh-8rem)]">
              <MoodAssistant 
                moods={moods}
                habits={habits}
                goals={goals}
                pointsSystem={pointsSystem}
                setView={setView}
                expanded={true}
                fullPage={true}
              />
            </div>
          )}

          {/* Resources View */}
          {view === 'resources' && (
            <ResourcesHub 
              moods={moods}
              customMoodCategories={customMoodCategories}
            />
          )}

          {/* Settings View */}
          {view === 'settings' && (
            <Settings
              customMoodCategories={customMoodCategories}
              onAddCustomMood={handleAddCustomMood}
              onRemoveCustomMood={handleRemoveCustomMood}
            />
          )}

          {/* Progress View */}
          {view === 'progress' && (
            <ProgressTracker
              habits={habits}
              goals={goals}
              onAddHabit={handleAddHabit}
              onCompleteHabit={handleCompleteHabit}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
            />
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <Settings 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        customMoodCategories={customMoodCategories}
        onAddCustomMood={handleAddCustomMood}
        onRemoveCustomMood={handleRemoveCustomMood}
      />
    </div>
  );
}

export default AppWithTheme;
