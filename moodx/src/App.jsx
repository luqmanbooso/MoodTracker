import { useState, useEffect } from 'react';
import { getMoods, createMood, deleteMood } from './services/api';
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
  const { theme } = useTheme();
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
      // setMoods(prevMoods => prevMoods.filter(mood => mood._id !== id));
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

  // Add this function in the AppContent component
  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  // Modify the useEffect that sets up notifications
  useEffect(() => {
    // Set up reminder notification (without permission request)
    const checkAndSendReminder = () => {
      const lastMoodDate = moods[0]?.date ? new Date(moods[0].date) : null;
      const now = new Date();
      
      // If no mood logged today and it's after 6pm, remind user
      if (!lastMoodDate || lastMoodDate.toDateString() !== now.toDateString()) {
        if (now.getHours() >= 18) {
          // Only send notification if permission is already granted
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Mood Check-in", {
              body: "Don't forget to log your mood today! 🙂",
              icon: "/favicon.ico"
            });
          }
        }
      }
    };
    
    // Check every hour
    const interval = setInterval(checkAndSendReminder, 3600000);
    return () => clearInterval(interval);
  }, [moods]);

  return (
    <div className={`min-h-screen ${theme.backgroundColor} py-8 px-4 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className={`text-4xl font-bold text-${theme.primaryColor}-800 dark:text-${theme.primaryColor}-400`}>
            Mood Tracker
          </h1>
          <p className={`mt-2 ${theme.textColor}`}>
            Track and understand your emotional wellbeing
          </p>
        </header>
        
        {/* Points Display */}
        <div className="mb-6">
          <PointsDisplay 
            points={pointsSystem.points}
            level={pointsSystem.level}
            nextLevel={pointsSystem.nextLevel}
            progress={pointsSystem.progress}
            showAnimation={pointsSystem.showAnimation}
            justEarned={pointsSystem.justEarned}
            levelUp={pointsSystem.levelUp}
          />
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          <button 
            onClick={() => setView('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'dashboard' 
                ? `bg-${theme.primaryColor}-600 text-white` 
                : `bg-${theme.cardBg} text-gray-700 hover:bg-${theme.primaryColor}-100`
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setView('log')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'log' 
                ? `bg-${theme.primaryColor}-600 text-white` 
                : `bg-${theme.cardBg} text-gray-700 hover:bg-${theme.primaryColor}-100`
            }`}
          >
            Log Mood
          </button>
          <button 
            onClick={() => setView('stats')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'stats' 
                ? `bg-${theme.primaryColor}-600 text-white` 
                : `bg-${theme.cardBg} text-gray-700 hover:bg-${theme.primaryColor}-100`
            }`}
          >
            Insights
          </button>
          <button 
            onClick={() => setView('challenges')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'challenges' 
                ? `bg-${theme.primaryColor}-600 text-white` 
                : `bg-${theme.cardBg} text-gray-700 hover:bg-${theme.primaryColor}-100`
            }`}
          >
            Challenges
          </button>
          <button 
            onClick={() => setView('resources')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'resources' 
                ? `bg-${theme.primaryColor}-600 text-white` 
                : `bg-${theme.cardBg} text-gray-700 hover:bg-${theme.primaryColor}-100`
            }`}
          >
            Resources
          </button>
          <button 
            onClick={() => setView('settings')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'settings' 
                ? `bg-${theme.primaryColor}-600 text-white` 
                : `bg-${theme.cardBg} text-gray-700 hover:bg-${theme.primaryColor}-100`
            }`}
          >
            Settings
          </button>
          <button 
            onClick={() => setView('progress')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'progress' 
                ? `bg-${theme.primaryColor}-600 text-white` 
                : `bg-${theme.cardBg} text-gray-700 hover:bg-${theme.primaryColor}-100`
            }`}
          >
            Progress
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Dashboard View */}
        {view === 'dashboard' && (
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
            
            {/* Quick Mood Entry */}
            <div className={`${theme.cardBg} rounded-lg shadow-md p-6 col-span-1 lg:col-span-2`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme.textColor}`}>
                How are you feeling?
              </h2>
              <MoodForm 
                addMood={handleAddMood} 
                isLoading={loading} 
                customMoodCategories={customMoodCategories}
                simplified={true} // Simplified version for dashboard
              />
            </div>
            
            {/* Mood Stats Summary */}
            <div className="col-span-1">
              {moods.length > 0 ? (
                <MoodStats moods={moods} simplified={true} />
              ) : (
                <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
                  <h2 className={`text-xl font-semibold mb-2 ${theme.textColor}`}>
                    Welcome!
                  </h2>
                  <p className="text-gray-600">
                    Log your first mood to start seeing insights and trends.
                  </p>
                </div>
              )}
            </div>
            
            {/* Random Act of Kindness */}
            <div className="col-span-1">
              <KindnessGenerator mood={moods[0]?.mood || 'Okay'} />
            </div>
            
            {/* Mood Prediction */}
            {moods.length >= 5 && (
              <div className="col-span-1">
                <MoodPrediction moods={moods} />
              </div>
            )}
            
            {/* Resource Recommendations - ADD THIS NEW SECTION HERE */}
            <div className="col-span-1">
              <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
                <h2 className={`text-xl font-semibold mb-4 ${theme.textColor}`}>
                  For You
                </h2>
                <ResourceRecommendations moods={moods} customMoodCategories={customMoodCategories} />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setView('resources')}
                    className={`px-4 py-2 bg-${theme.primaryColor}-600 text-white rounded hover:bg-${theme.primaryColor}-700 transition`}
                  >
                    View All Resources
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Moods */}
            <div className="col-span-1 lg:col-span-3">
              <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
                <h2 className={`text-xl font-semibold mb-4 ${theme.textColor}`}>
                  Recent Moods
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-${theme.primaryColor}-500`}></div>
                  </div>
                ) : moods.length === 0 ? (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-gray-600">No mood entries yet. Add your first mood!</p>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto">
                    <MoodList moods={moods.slice(0, 5)} deleteMood={handleDeleteMood} />
                  </div>
                )}
              </div>
            </div>

            {/* Streak Display */}
            <div className="mb-4 text-center">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 inline-flex items-center">
                <span className="text-2xl mr-2">🔥</span>
                <div>
                  <div className="font-bold text-amber-800">{computeStreak()} day streak</div>
                  <div className="text-xs text-amber-600">Keep the momentum going!</div>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <MoodAssistant 
                moods={moods} 
                habits={habits} 
                goals={goals} 
                pointsSystem={pointsSystem}
                setView={setView}
              />
            </div>
          </div>
        )}
        
        {/* Log Mood View */}
        {view === 'log' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme.textColor}`}>
                Log Your Mood
              </h2>
              <MoodForm 
                addMood={handleAddMood} 
                isLoading={loading} 
                customMoodCategories={customMoodCategories}
              />
            </div>
            
            <div>
              {/* Personalized Tips */}
              {moods.length > 0 && (
                <div className="mb-6">
                  <PersonalizedTips moods={moods} />
                </div>
              )}
              
              {/* Mood History */}
              <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
                <h2 className={`text-xl font-semibold mb-4 ${theme.textColor}`}>
                  Your Mood History
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-${theme.primaryColor}-500`}></div>
                  </div>
                ) : moods.length === 0 ? (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-gray-600">No mood entries yet. Add your first mood!</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    <MoodList moods={moods} deleteMood={handleDeleteMood} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Stats/Insights View */}
        {view === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
                <h2 className={`text-xl font-semibold mb-4 ${theme.textColor}`}>
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
        
        {/* Challenges View */}
        {view === 'challenges' && (
          <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme.textColor}`}>
              Daily Challenges
            </h2>
            <DailyChallenge 
              onComplete={handleCompleteChallenge} 
              completedChallenges={completedChallenges}
              showHistory={true}
            />
          </div>
        )}
        
        {/* Resources View */}
        {view === 'resources' && (
          <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme.textColor}`}>
              Mental Health Resources
            </h2>
            <p className="text-gray-600 mb-6">
              Access helpful resources for managing your mental health. If you're in crisis, please use the 
              emergency contacts at the top.
            </p>
            <ResourcesHub userMood={moods[0]?.mood || 'Okay'} />
          </div>
        )}
        
        {/* Settings View */}
        {view === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme.textColor}`}>
                Custom Mood Categories
              </h2>
              <CustomMoodManager 
                categories={customMoodCategories}
                onAdd={handleAddCustomMood}
                onRemove={handleRemoveCustomMood}
              />
            </div>
            
            <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme.textColor}`}>
                Appearance
              </h2>
              <ThemeSettings />
            </div>
          </div>
        )}

        {/* Progress & Accountability View */}
        {view === 'progress' && (
          <div className="space-y-6">
            <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
              <AccountabilityDashboard 
                moods={moods} 
                habits={habits} 
                goals={goals}
              />
            </div>
            
            <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
              <HabitBuilder 
                onAddHabit={handleAddHabit}
                onCompleteHabit={handleCompleteHabit}
                userHabits={habits}
              />
            </div>
            
            <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
              <GoalTracker 
                goals={goals}
                onAddGoal={handleAddGoal}
                onUpdateGoal={handleUpdateGoal}
                onDeleteGoal={(id) => setGoals(prev => prev.filter(goal => goal.id !== id))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppWithTheme;
