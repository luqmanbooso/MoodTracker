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
import ProgressPage from './components/gamification/ProgressPage';
import PointsNotification from './components/gamification/PointsNotification';
import UserGreeting from './components/UserGreeting';
import React from 'react';
import { ProgressProvider } from './contexts/ProgressContext';

// Main App component wrapper with ThemeProvider
function AppWithTheme() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <AppContent />
      </ProgressProvider>
    </ThemeProvider>
  );
}

// Main App content
function AppContent() {
  const { darkMode } = useTheme();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'log', 'stats', 'challenges', 'resources', 'settings', 'progress'
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

  // Update the theme object to handle colors consistently across all views
  const theme = {
    primaryColor: darkMode ? 'emerald' : 'orange',
    cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
    textColor: darkMode ? 'text-white' : 'text-gray-800',
    secondaryText: darkMode ? 'text-gray-300' : 'text-gray-600',
    borderColor: darkMode ? 'border-gray-700' : 'border-gray-200',
    buttonBg: darkMode ? 'bg-emerald-500' : 'bg-orange-500',
    buttonHover: darkMode ? 'hover:bg-emerald-600' : 'hover:bg-orange-600',
  };

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

  // Rest of your functions (fetchMoods, handleAddMood, etc.)
  // [Keeping original implementation]

  // Add this for the function parameters we need from your original code
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
        openSettingsModal={() => setIsSettingsModalOpen(true)}
      />
      
      <PointsNotification />
      
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
          
          {/* Views */}
          {view === 'dashboard' && (
  <>
    {/* Top Hero Section with Quote Carousel */}
    <div className={`mb-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-white to-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg overflow-hidden`}>
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="300" height="300" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill={darkMode ? '#4ade80' : '#f97316'} />
            <path d="M50,10 A40,40 0 0,1 50,90 A40,40 0 0,1 50,10" fill="none" stroke={darkMode ? '#34d399' : '#fb923c'} strokeWidth="8" />
          </svg>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:w-3/5 mb-6 md:mb-0">
              <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Are You Ready to Share Your Mind?
              </h1>
              <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Track your emotions, discover patterns, and grow with every check-in.
              </p>
              
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setShowMoodForm(true)}
                  className={`px-5 py-2.5 ${theme.buttonBg} ${theme.buttonHover} text-white rounded-lg flex items-center shadow-sm transition-all font-medium`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Log My Mood
                </button>
                
                {streak > 0 && (
                  <div className={`px-4 py-2.5 ${darkMode ? 'bg-gray-700/70' : 'bg-white'} rounded-lg flex items-center shadow-sm`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {streak} Day Streak! 🔥
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Daily Quote Carousel */}
            <div className={`md:w-2/5 p-5 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col justify-center relative overflow-hidden`}>
              <div className="absolute -top-2 -right-2">
                <svg className="w-12 h-12 text-gray-300 dark:text-gray-700 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              
              <span className={`text-sm uppercase font-semibold mb-1 ${darkMode ? 'text-emerald-400' : 'text-orange-500'}`}>Daily Inspiration</span>
              <div className="animate-fade-in">
                <DailyQuote compact={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Quick Mood Check-in */}
    <div className={`mb-6 p-6 rounded-xl ${theme.cardBg} border ${theme.borderColor} shadow-md`}>
      <h2 className={`text-xl font-bold mb-4 ${theme.textColor}`}>
        How are you feeling right now?
      </h2>
      <div className="grid grid-cols-5 gap-3">
        {[
          {mood: 'Great', emoji: '😀', intensity: 10, color: 'green'},
          {mood: 'Good', emoji: '🙂', intensity: 7, color: 'emerald'},
          {mood: 'Okay', emoji: '😐', intensity: 5, color: 'yellow'},
          {mood: 'Down', emoji: '🙁', intensity: 3, color: 'orange'},
          {mood: 'Bad', emoji: '😞', intensity: 1, color: 'red'}
        ].map((item) => (
          <button
            key={item.mood}
            onClick={() => handleAddMood({ 
              mood: item.mood,
              customMood: '',
              intensity: item.intensity,
              note: '',
              activities: [],
              tags: []
            })}
            className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all border ${
              darkMode 
                ? `border-gray-700 hover:bg-${item.color}-900/20 hover:border-${item.color}-700/50` 
                : `border-gray-200 hover:bg-${item.color}-50 hover:border-${item.color}-200`
            }`}
          >
            <span className="text-3xl mb-2">{item.emoji}</span>
            <span className={`text-sm font-medium ${theme.secondaryText}`}>{item.mood}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowMoodForm(true)}
        className={`mt-4 w-full py-2 text-${theme.primaryColor}-600 hover:bg-${theme.primaryColor}-50 dark:hover:bg-${theme.primaryColor}-900/10 rounded-lg text-center text-sm font-medium`}
      >
        Need more options? Log detailed mood
      </button>
    </div>

    {/* What We Offer Section */}
    <div className="mb-6">
      <h2 className={`text-xl font-bold mb-4 ${theme.textColor}`}>
        What MoodX Offers You
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Mood Tracking",
            description: "Record and visualize your emotional patterns over time",
            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            color: darkMode ? "emerald" : "orange"
          },
          {
            title: "Insights & Analysis",
            description: "Understand what affects your mental wellbeing",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            color: darkMode ? "teal" : "amber"
          },
          {
            title: "Goal Tracking",
            description: "Set wellness goals and track your progress",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
            color: darkMode ? "cyan" : "rose"
          },
          {
            title: "Mindset Coach",
            description: "Get personalized tips and mental wellness guidance",
            icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
            color: darkMode ? "blue" : "indigo"
          },
        ].map((feature, i) => (
          <div 
            key={i} 
            className={`p-5 rounded-xl ${theme.cardBg} border ${theme.borderColor} hover:shadow-md transition-shadow`}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 bg-${feature.color}-100 dark:bg-${feature.color}-900/20`}>
              <svg xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
              </svg>
            </div>
            <h3 className={`font-bold text-lg mb-1 ${theme.textColor}`}>{feature.title}</h3>
            <p className={`${theme.secondaryText}`}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Gamification & Progress Section */}
    <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main chart/stats area */}
      <div className="lg:col-span-2 space-y-6">
        {moods.length > 0 ? (
          <div className={`rounded-xl shadow-md ${theme.cardBg} ${theme.borderColor} border overflow-hidden`}>
            <div className="p-5 border-b ${theme.borderColor} flex justify-between items-center">
              <h2 className={`text-xl font-bold ${theme.textColor}`}>
                Your Mood Journey
              </h2>
              <button 
                onClick={() => setView('insights')}
                className={`text-sm text-${theme.primaryColor}-600 hover:text-${theme.primaryColor}-800 dark:text-${theme.primaryColor}-400 dark:hover:text-${theme.primaryColor}-300`}
              >
                View Insights
              </button>
            </div>
            <div className="p-5">
              <MoodChart moods={moods} simplified={true} />
            </div>
          </div>
        ) : (
          <div className={`p-6 rounded-xl shadow-md ${theme.cardBg} ${theme.borderColor} border text-center`}>
            <div className="py-8">
              <div className="mb-6 inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-medium mb-3 ${theme.textColor}`}>
                Start Your Mood Journey
              </h3>
              <p className={`${theme.secondaryText} max-w-md mx-auto mb-6`}>
                Track your moods regularly to see patterns and get personalized insights about your emotional wellbeing.
              </p>
              <button
                onClick={() => setShowMoodForm(true)}
                className={`px-6 py-3 ${theme.buttonBg} ${theme.buttonHover} text-white rounded-lg transition-colors inline-flex items-center font-medium text-lg`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Log Your First Mood
              </button>
            </div>
          </div>
        )}

        {/* Daily Challenge */}
        <div className={`p-6 rounded-xl shadow-md ${theme.cardBg} ${theme.borderColor} border`}>
          <h2 className={`text-xl font-bold mb-4 ${theme.textColor} flex items-center`}>
            <span className="mr-2">🎯</span> Today's Wellness Challenge
          </h2>
          <DailyChallenge 
            onComplete={handleCompleteChallenge} 
            completedChallenges={completedChallenges}
          />
        </div>
      </div>
      
      {/* Right sidebar for progress and achievements */}
      <div className="lg:col-span-1 space-y-6">
        {/* User Level & Progress */}
        <div className={`p-6 rounded-xl shadow-md ${theme.cardBg} ${theme.borderColor} border`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-lg font-bold ${theme.textColor}`}>
              Your Progress
            </h2>
            <span className={`px-3 py-1 text-sm font-bold rounded-full ${darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-orange-100 text-orange-600'}`}>
              Level {pointsSystem.levelNumber || 1}
            </span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className={theme.secondaryText}>XP Progress</span>
              <span className="font-medium">{pointsSystem.points}/{pointsSystem.nextLevel} points</span>
            </div>
            <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-${theme.primaryColor}-500 transition-all duration-500`}
                style={{ width: `${Math.round(pointsSystem.progress * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className={`p-3 text-center rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-xl font-bold">{moods.length}</div>
              <div className="text-xs uppercase mt-1 text-gray-500">Entries</div>
            </div>
            <div className={`p-3 text-center rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-xl font-bold">{streak}</div>
              <div className="text-xs uppercase mt-1 text-gray-500">Streak</div>
            </div>
            <div className={`p-3 text-center rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-xl font-bold">{pointsSystem.points}</div>
              <div className="text-xs uppercase mt-1 text-gray-500">Points</div>
            </div>
          </div>
          
          <button
            onClick={() => setView('progress')}
            className={`w-full py-2 rounded-lg text-center border ${darkMode 
              ? 'border-gray-700 hover:bg-gray-700 text-white' 
              : 'border-gray-200 hover:bg-gray-50 text-gray-800'}`}
          >
            View All Progress
          </button>
        </div>
        
        {/* Getting Started Tips */}
        <div className={`p-6 rounded-xl shadow-md ${theme.cardBg} ${theme.borderColor} border`}>
          <h2 className={`text-lg font-bold mb-3 ${theme.textColor}`}>
            Getting Started
          </h2>
          <ul className="space-y-3">
            {[
              { text: "Log your mood daily", complete: moods.length > 0 },
              { text: "Complete today's challenge", complete: completedChallenges.some(c => c.includes(new Date().toDateString())) },
              { text: "Create your first habit", complete: habits.length > 0 },
              { text: "Set a wellness goal", complete: goals.length > 0 }
            ].map((step, i) => (
              <li key={i} className="flex items-start">
                <div className={`mt-0.5 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full border ${
                  step.complete 
                    ? `bg-${theme.primaryColor}-500 border-${theme.primaryColor}-600` 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {step.complete && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`ml-2 ${step.complete ? 'line-through opacity-70' : ''} ${theme.secondaryText}`}>
                  {step.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {moods.length > 0 && (
          <div className={`rounded-xl shadow-md ${theme.cardBg} ${theme.borderColor} border overflow-hidden`}>
            <div className="p-4 border-b ${theme.borderColor}">
              <h2 className={`font-bold ${theme.textColor} flex items-center`}>
                <span className="mr-2">📝</span> Recent Entries
              </h2>
            </div>
            <div>
              <MoodList moods={moods.slice(0, 3)} deleteMood={handleDeleteMood} compact={true} />
              {moods.length > 3 && (
                <div className="px-4 py-2 border-t ${theme.borderColor}">
                  <button 
                    onClick={() => setView('log')}
                    className={`w-full text-center text-sm text-${theme.primaryColor}-600 hover:text-${theme.primaryColor}-700 dark:text-${theme.primaryColor}-400`}
                  >
                    View all entries →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </>
)}
          
          {view === 'log' && (
            <div className="animate-fade-in">
              <div className={`mb-6 p-6 rounded-xl bg-gradient-to-r from-${theme.primaryColor}-600 via-${theme.primaryColor}-500 to-${theme.primaryColor}-700 text-white shadow-xl`}>
                <h1 className="text-3xl font-bold mb-2">How Are You Feeling Today?</h1>
                <p className="opacity-90">Track your emotions to build self-awareness and identify patterns.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border ${theme.borderColor}`}>
                  <div className="p-5 border-b ${theme.borderColor}">
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
                    <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border ${theme.borderColor}`}>
                      <div className="p-5 border-b ${theme.borderColor}">
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
                  
                  <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border ${theme.borderColor}`}>
                    <div className="p-5 border-b ${theme.borderColor}">
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
                  <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border ${theme.borderColor}`}>
                    <div className="p-5 border-b ${theme.borderColor}">
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
                <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border ${theme.borderColor} p-6`}>
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
            <ProgressPage />
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
