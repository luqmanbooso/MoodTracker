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
import MoodAnalysis from './components/MoodAnalysis';
import WeeklyReflection from './components/WeeklyReflection';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import PointsDisplay from './components/PointsDisplay';
import HabitBuilder from './components/HabitBuilder';
import GoalTracker from './components/GoalTracker';
import MoodAssistant from './components/MoodAssistant';
import Settings from './components/Settings';
import EnhancedAnalytics from './components/EnhancedAnalytics';
import WellnessJourneyEntry from './components/WellnessJourneyEntry';
import TodoList from './components/TodoList.jsx';
import RecommendationSelector from './components/RecommendationSelector.jsx';
import ProgressSystem from './components/ProgressSystem.jsx';
import DynamicGreeting from './components/DynamicGreeting.jsx';
import FocusSession from './components/FocusSession.jsx';
import MoodCalendar from './components/MoodCalendar.jsx';
import PointsSystem from './components/PointsSystem.jsx';


import React from 'react';


import Login from './components/Login';
import Register from './components/Register';
import { aiService } from './services/aiService.js';
import authService from './services/authService.js';
import wellnessJourneyService from './services/wellnessJourneyService.js';

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
  // Simplified local progress tracking
  const [localProgress, setLocalProgress] = useState(() => {
    const saved = localStorage.getItem('localProgress');
    return saved ? JSON.parse(saved) : {
      points: 0,
      level: 1,
      totalCheckins: 0
    };
  });
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'log', 'insights', 'progress', 'chat', 'todos'
  const [customMoodCategories, setCustomMoodCategories] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('custom-moods');
    return saved ? JSON.parse(saved) : ['Motivated', 'Anxious', 'Energetic', 'Creative', 'Bored'];
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [showMoodForm, setShowMoodForm] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [currentInsights, setCurrentInsights] = useState(null);
  const [showRecommendationSelector, setShowRecommendationSelector] = useState(false);
  const [currentRecommendations, setCurrentRecommendations] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Wellness Journey state
  const [wellnessEntries, setWellnessEntries] = useState([]);
  const [wellnessLoading, setWellnessLoading] = useState(false);
  const [showWellnessForm, setShowWellnessForm] = useState(false);
  const [editingWellnessEntry, setEditingWellnessEntry] = useState(null);

  
  const streak = computeStreak();

  // Add this state for controlling the settings modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true); // true for login, false for register

  // Consistent theme colors
  const theme = {
    primaryColor: 'emerald',
    cardBg: 'bg-gray-800',
    textColor: 'text-white',
    secondaryText: 'text-gray-300',
    borderColor: 'border-gray-700',
    buttonBg: 'bg-emerald-600',
    buttonHover: 'hover:bg-emerald-700',
  };

  // Initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        authService.initAuth();
        if (authService.isAuthenticated()) {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fetch moods and todos on component mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchMoods();
      fetchTodos();
      fetchWellnessEntries();
    }
  }, [isAuthenticated]);

  // Authentication handlers
  const handleLogin = async (credentials) => {
    try {
      setAuthLoading(true);
      const { user: userData, token } = await authService.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      setShowLogin(true);
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setAuthLoading(true);
      const { user: newUser, token } = await authService.register(userData);
      setUser(newUser);
      setIsAuthenticated(true);
      setShowLogin(true);
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setMoods([]);
    setTodos([]);
    setLocalProgress({
      points: 0,
      level: 1,
      totalCheckins: 0
    });
  };

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const backendTodos = await aiService.getTodos();
      setTodos(backendTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      // Keep existing todos from localStorage if backend fails
    }
  };

  // Save localProgress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('localProgress', JSON.stringify(localProgress));
  }, [localProgress]);

  // Save custom moods to localStorage when they change
  useEffect(() => {
    localStorage.setItem('custom-moods', JSON.stringify(customMoodCategories));
  }, [customMoodCategories]);

  // Save todos to localStorage when they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  


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

  const generateMoodInsights = (newMood, allMoods) => {
    const insights = {
      immediate: [],
      patterns: [],
      recommendations: [],
      wellnessScore: calculateWellnessScore(newMood),
      moodTrend: null,
      triggers: [],
      activities: []
    };

    // Immediate insights based on current mood
    const moodScores = { thriving: 10, good: 8, neutral: 6, struggling: 4, overwhelmed: 2 };
    const currentScore = moodScores[newMood.mood] || 5;

    if (currentScore >= 8) {
      insights.immediate.push({
        type: 'positive',
        title: 'Excellent Wellness State',
        message: 'You\'re in a great mental health space! This is wonderful to see.',
        icon: '🌟',
        color: 'text-emerald-400'
      });
    } else if (currentScore >= 6) {
      insights.immediate.push({
        type: 'stable',
        title: 'Good Wellness State',
        message: 'You\'re maintaining good mental health. Keep up the positive practices!',
        icon: '😊',
        color: 'text-blue-400'
      });
    } else if (currentScore >= 4) {
      insights.immediate.push({
        type: 'attention',
        title: 'Needs Attention',
        message: 'You\'re experiencing some challenges. This is normal and temporary.',
        icon: '🤔',
        color: 'text-yellow-400'
      });
    } else {
      insights.immediate.push({
        type: 'support',
        title: 'Support Needed',
        message: 'You\'re going through a difficult time. Remember, it\'s okay to not be okay.',
        icon: '💙',
        color: 'text-purple-400'
      });
    }

    // Analyze patterns if we have enough data
    if (allMoods.length >= 3) {
      const recentMoods = allMoods.slice(0, 7); // Last 7 entries
      const moodCounts = recentMoods.reduce((acc, mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
      }, {});

      // Pattern analysis
      const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
        moodCounts[a[0]] > moodCounts[b[0]] ? a : b
      )[0];

      if (dominantMood === 'thriving' || dominantMood === 'good') {
        insights.patterns.push({
          type: 'positive_pattern',
          title: 'Positive Pattern Detected',
          message: `You've been feeling ${dominantMood} frequently. Your wellness practices are working well!`,
          icon: '📈',
          color: 'text-green-400'
        });
      } else if (dominantMood === 'struggling' || dominantMood === 'overwhelmed') {
        insights.patterns.push({
          type: 'challenging_pattern',
          title: 'Challenging Pattern Detected',
          message: `You've been feeling ${dominantMood} often. Let's work on some coping strategies.`,
          icon: '📉',
          color: 'text-red-400'
        });
      }

      // Trend analysis
      const recentScores = recentMoods.map(mood => moodScores[mood.mood] || 5);
      const trend = recentScores[0] - recentScores[recentScores.length - 1];
      
      if (trend > 2) {
        insights.moodTrend = {
          type: 'improving',
          message: 'Your wellness has been improving! Keep up the great work.',
          icon: '🚀',
          color: 'text-emerald-400'
        };
      } else if (trend < -2) {
        insights.moodTrend = {
          type: 'declining',
          message: 'I notice your wellness has been challenging lately. Let\'s work on some strategies.',
          icon: '⚠️',
          color: 'text-yellow-400'
        };
      } else {
        insights.moodTrend = {
          type: 'stable',
          message: 'Your wellness has been relatively stable. Consistency is key!',
          icon: '📊',
          color: 'text-blue-400'
        };
      }
    }

    // Analyze triggers and activities
    if (newMood.triggers && newMood.triggers.length > 0) {
      insights.triggers = newMood.triggers.map(trigger => ({
        trigger,
        suggestion: getTriggerSuggestion(trigger)
      }));
    }

    if (newMood.activities && newMood.activities.length > 0) {
      insights.activities = newMood.activities.map(activity => ({
        activity,
        benefit: getActivityBenefit(activity)
      }));
    }

    // Generate personalized recommendations
    insights.recommendations = generateRecommendations(newMood, allMoods);

    return insights;
  };

  const calculateWellnessScore = (mood) => {
    let score = 0;
    
    // Base score from mood
    const moodScores = { thriving: 10, good: 8, neutral: 6, struggling: 4, overwhelmed: 2 };
    score += moodScores[mood.mood] || 5;
    
    // Adjust for intensity
    score += (mood.intensity - 5) * 0.5;
    
    // Adjust for energy level
    score += (mood.energyLevel - 5) * 0.3;
    
    // Adjust for sleep quality
    score += (mood.sleepQuality - 5) * 0.2;
    
    // Adjust for stress level (inverse)
    score -= (mood.stressLevel - 5) * 0.3;
    
    // Bonus for positive activities
    if (mood.activities && mood.activities.length > 0) score += 1;
    
    // Bonus for gratitude
    if (mood.gratitude && mood.gratitude.trim()) score += 1;
    
    return Math.max(1, Math.min(10, Math.round(score)));
  };

  const getTriggerSuggestion = (trigger) => {
    const suggestions = {
      work_stress: 'Consider setting boundaries, taking breaks, or discussing workload with your manager.',
      social_anxiety: 'Practice deep breathing, start with small social interactions, or consider therapy.',
      lack_of_sleep: 'Establish a consistent bedtime routine and avoid screens before bed.',
      financial_worry: 'Create a budget, seek financial counseling, or focus on what you can control.',
      health_concern: 'Schedule a check-up, practice self-care, or talk to a healthcare provider.',
      relationship_issue: 'Consider open communication, couples therapy, or individual counseling.',
      uncertainty: 'Focus on what you can control, practice mindfulness, or break down decisions.',
      overwhelm: 'Prioritize tasks, practice time management, or ask for help when needed.'
    };
    return suggestions[trigger] || 'Consider what\'s within your control and what coping strategies work for you.';
  };

  const getActivityBenefit = (activity) => {
    const benefits = {
      exercise: 'Physical activity releases endorphins and reduces stress hormones.',
      meditation: 'Mindfulness practice helps calm the mind and improve emotional regulation.',
      social_connection: 'Social support is crucial for mental health and resilience.',
      creative_activity: 'Creative expression can be therapeutic and boost mood.',
      nature_time: 'Time in nature reduces stress and improves mental clarity.',
      reading: 'Reading can provide escape, knowledge, and mental stimulation.',
      music: 'Music can regulate emotions and provide comfort.',
      cooking: 'Cooking can be meditative and provide a sense of accomplishment.',
      self_care: 'Self-care practices show self-compassion and build resilience.',
      learning: 'Learning new things can boost confidence and provide purpose.'
    };
    return benefits[activity] || 'This activity contributes to your overall wellness.';
  };

  const generateRecommendations = (newMood, allMoods) => {
    const recommendations = [];
    const moodScores = { thriving: 10, good: 8, neutral: 6, struggling: 4, overwhelmed: 2 };
    const currentScore = moodScores[newMood.mood] || 5;

    // Based on current wellness score
    if (currentScore < 6) {
      recommendations.push({
        title: 'Focus on Self-Care',
        description: 'Try a 10-minute meditation, take a warm bath, or call a friend.',
        category: 'self-care',
        priority: 'high',
        estimatedTime: '10 minutes',
        pointsReward: 15
      });
    }

    // Based on stress level
    if (newMood.stressLevel >= 7) {
      recommendations.push({
        title: 'Stress Management',
        description: 'Practice deep breathing, take a walk, or try progressive muscle relaxation.',
        category: 'mindfulness',
        priority: 'high',
        estimatedTime: '15 minutes',
        pointsReward: 20
      });
    }

    // Based on sleep quality
    if (newMood.sleepQuality <= 4) {
      recommendations.push({
        title: 'Improve Sleep',
        description: 'Create a bedtime routine, avoid screens before bed, and keep your bedroom cool.',
        category: 'sleep',
        priority: 'medium',
        estimatedTime: '30 minutes',
        pointsReward: 15
      });
    }

    // Based on energy level
    if (newMood.energyLevel <= 4) {
      recommendations.push({
        title: 'Boost Energy',
        description: 'Take a short walk, eat a nutritious snack, or listen to upbeat music.',
        category: 'exercise',
        priority: 'medium',
        estimatedTime: '20 minutes',
        pointsReward: 15
      });
    }

    // Based on activities
    if (!newMood.activities || newMood.activities.length === 0) {
      recommendations.push({
        title: 'Add Wellness Activities',
        description: 'Try meditation, exercise, or a creative activity today.',
        category: 'wellness',
        priority: 'medium',
        estimatedTime: '15 minutes',
        pointsReward: 10
      });
    }

    // Based on gratitude
    if (!newMood.gratitude || !newMood.gratitude.trim()) {
      recommendations.push({
        title: 'Practice Gratitude',
        description: 'Write down 3 things you\'re grateful for today.',
        category: 'mindfulness',
        priority: 'low',
        estimatedTime: '5 minutes',
        pointsReward: 10
      });
    }

    return recommendations;
  };

  const handleAddMood = async (moodData) => {
    try {
      console.log('Starting handleAddMood with data:', moodData);
      setLoading(true);
      setError(null);
      
      // Create the mood entry
      const newMood = {
        ...moodData,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };

      console.log('Created new mood entry:', newMood);

      // Add to local state
      setMoods(prev => [newMood, ...prev]);

      // Update local progress
      setLocalProgress(prev => {
        const newPoints = prev.points + 15;
        const newLevel = Math.floor(newPoints / 100) + 1;
        console.log('Updating progress:', { prev, newPoints, newLevel });
        return {
          ...prev,
          points: newPoints,
          level: newLevel,
          totalCheckins: prev.totalCheckins + 1
        };
      });
      console.log('Local progress updated successfully');

      // Generate intelligent insights based on the new mood using AI
      console.log('Generating AI insights...');
      let insights;
      try {
        const aiInsights = await aiService.generateMoodInsights([...moods, newMood], habits, goals);
        console.log('AI insights:', aiInsights);
        
        // Use AI insights as primary, fallback to local insights only if AI fails
        if (aiInsights && aiInsights.summary) {
          insights = {
            immediate: aiInsights.immediate || [],
            patterns: aiInsights.patterns || [],
            recommendations: aiInsights.recommendations || [],
            wellnessScore: calculateWellnessScore(newMood),
            moodTrend: aiInsights.moodTrend || null,
            triggers: aiInsights.triggers || [],
            activities: aiInsights.activities || [],
            aiSummary: aiInsights.summary,
            aiPatterns: aiInsights.patterns || [],
            aiRecommendations: aiInsights.recommendations || []
          };
        } else {
          // Fallback to local insights
          insights = generateMoodInsights(newMood, [...moods, newMood]);
        }
        console.log('Final insights:', insights);
      } catch (error) {
        console.error('Error generating AI insights:', error);
        insights = generateMoodInsights(newMood, [...moods, newMood]);
        console.log('Using local insights:', insights);
      }
      
      // Generate recommendations for todo list
      const recommendations = generateRecommendations(newMood, [...moods, newMood]);
      if (recommendations.length > 0) {
        setCurrentRecommendations(recommendations);
        setShowRecommendationSelector(true);
      }

      // Show insights modal
      if (insights) {
        setShowInsightsModal(true);
        setCurrentInsights(insights);
      }

      // Save to localStorage
      localStorage.setItem('moods', JSON.stringify([newMood, ...moods]));

      // Show success notification
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);

      console.log('Wellness check-in completed successfully');

    } catch (error) {
      console.error('Error adding mood:', error);
      setError('Failed to save wellness check-in: ' + error.message);
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
    // Update local progress for creating a new habit
    setLocalProgress(prev => ({
      ...prev,
      points: prev.points + 10
    }));
  };

  const handleCompleteHabit = (habitId) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const wasCompleted = habit.completed;
        const newStreak = !wasCompleted ? (habit.streak || 0) + 1 : (habit.streak || 0);
        
        // Only update progress if the habit wasn't already completed
        if (!wasCompleted) {
          setLocalProgress(prev => ({
            ...prev,
            points: prev.points + 15
          }));
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
    // Update progress for setting a new goal
    setLocalProgress(prev => ({
      ...prev,
      points: prev.points + 20
    }));
  };

  const handleUpdateGoal = (updatedGoal) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === updatedGoal.id) {
        // Check if a milestone was just completed
        const prevCompletedCount = goal.milestones.filter(m => m.completed).length;
        const newCompletedCount = updatedGoal.milestones.filter(m => m.completed).length;
        
        if (newCompletedCount > prevCompletedCount) {
          // Update progress for completing a milestone
          setLocalProgress(prev => ({
            ...prev,
            points: prev.points + 25
          }));
        }
        
        // Check if the entire goal was completed
        if (updatedGoal.completed && !goal.completed) {
          // Update progress for completing the whole goal
          setLocalProgress(prev => ({
            ...prev,
            points: prev.points + 50
          }));
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

  // Todo management functions
  const handleAddTodo = async (todoData) => {
    try {
      const newTodo = await aiService.addTodo({
        ...todoData,
        aiGenerated: true
      });
      setTodos(prev => [newTodo, ...prev]);
    } catch (error) {
      console.error('Error adding todo:', error);
      // Fallback to local storage if backend fails
      const fallbackTodo = {
        id: Date.now(),
        ...todoData,
        completed: false,
        createdAt: new Date(),
        aiGenerated: true
      };
      setTodos(prev => {
        const updatedTodos = [fallbackTodo, ...prev];
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        return updatedTodos;
      });
    }
  };

  const handleCompleteTodo = async (todoId) => {
    const todo = todos.find(t => t._id === todoId || t.id === todoId);
    if (!todo) return;

    try {
      // Send completion to backend
      const result = await aiService.trackTodoCompletion({
        todoId: todo._id || todoId,
        completedAt: new Date().toISOString(),
        userContext: {
          wellnessScore: calculateWellnessScore(moods[moods.length - 1] || {}),
          moods: moods,
          habits: habits,
          goals: goals
        }
      });

      // Update local state based on backend response
      setTodos(prev => prev.map(t => 
        (t._id === todoId || t.id === todoId) ? { ...t, completed: !t.completed } : t
      ));

      // Update progress if points were awarded
      if (result.pointsEarned > 0) {
        setLocalProgress(prev => ({
          ...prev,
          points: prev.points + result.pointsEarned,
          level: result.newLevel || prev.level
        }));
      }

      // Show level up notification if applicable
      if (result.leveledUp) {
        console.log(`🎉 Level Up! You're now level ${result.newLevel}!`);
      }

    } catch (error) {
      console.error('Error completing todo:', error);
      // Fallback to local completion
      setTodos(prev => {
        const updatedTodos = prev.map(t => 
          (t._id === todoId || t.id === todoId) ? { ...t, completed: !t.completed } : t
        );
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        return updatedTodos;
      });
      
      // Award points locally
      if (!todo.completed) {
        const pointsToAdd = todo.pointsReward || 10;
        setLocalProgress(prev => ({
          ...prev,
          points: prev.points + pointsToAdd,
          level: Math.floor((prev.points + pointsToAdd) / 100) + 1
        }));
      }
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await aiService.deleteTodo(todo._id || todoId);
      setTodos(prev => prev.filter(todo => (todo._id !== todoId && todo.id !== todoId)));
    } catch (error) {
      console.error('Error deleting todo:', error);
      // Fallback to local deletion
      setTodos(prev => {
        const updatedTodos = prev.filter(todo => (todo._id !== todoId && todo.id !== todoId));
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        return updatedTodos;
      });
    }
  };

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    // You can add logic here to automatically log the mood or show the mood form
  };

  const handleCalendarDateClick = (date) => {
    // Handle calendar date click - could open mood form for that date
    console.log('Calendar date clicked:', date);
  };

  // Wellness Journey functions
  const fetchWellnessEntries = async () => {
    if (!user) return;
    
    try {
      setWellnessLoading(true);
      const response = await wellnessJourneyService.getWellnessJourney(user.id || user._id);
      setWellnessEntries(response.entries || []);
    } catch (error) {
      console.error('Error fetching wellness entries:', error);
      // Fallback to local storage
      const localEntries = wellnessJourneyService.getWellnessEntriesLocally();
      setWellnessEntries(localEntries);
    } finally {
      setWellnessLoading(false);
    }
  };

  const handleCreateWellnessEntry = async (entryData) => {
    if (!user) return;
    
    try {
      setWellnessLoading(true);
      const response = await wellnessJourneyService.createWellnessEntry(user.id || user._id, entryData);
      setWellnessEntries(prev => [response.entry, ...prev]);
      setShowWellnessForm(false);
      toast.success('Wellness entry created successfully!');
    } catch (error) {
      console.error('Error creating wellness entry:', error);
      // Fallback to local storage
      const newEntry = wellnessJourneyService.saveWellnessEntryLocally(entryData);
      setWellnessEntries(prev => [newEntry, ...prev]);
      setShowWellnessForm(false);
      toast.success('Wellness entry saved locally!');
    } finally {
      setWellnessLoading(false);
    }
  };

  const handleUpdateWellnessEntry = async (entryId, updateData) => {
    try {
      setWellnessLoading(true);
      const response = await wellnessJourneyService.updateWellnessEntry(entryId, updateData);
      setWellnessEntries(prev => 
        prev.map(entry => entry.id === entryId ? response.entry : entry)
      );
      setEditingWellnessEntry(null);
      toast.success('Wellness entry updated successfully!');
    } catch (error) {
      console.error('Error updating wellness entry:', error);
      toast.error('Failed to update wellness entry');
    } finally {
      setWellnessLoading(false);
    }
  };

  const handleDeleteWellnessEntry = async (entryId) => {
    try {
      setWellnessLoading(true);
      await wellnessJourneyService.deleteWellnessEntry(entryId);
      setWellnessEntries(prev => prev.filter(entry => entry.id !== entryId));
      toast.success('Wellness entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting wellness entry:', error);
      // Fallback to local storage
      wellnessJourneyService.deleteWellnessEntryLocally(entryId);
      setWellnessEntries(prev => prev.filter(entry => entry.id !== entryId));
      toast.success('Wellness entry deleted locally!');
    } finally {
      setWellnessLoading(false);
    }
  };

  const handleEditWellnessEntry = (entry) => {
    setEditingWellnessEntry(entry);
    setShowWellnessForm(true);
  };

  const latestMood = moods.length > 0 ? {
    mood: moods[0].mood,
    time: new Date(moods[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date(moods[0].date).toLocaleDateString()
  } : null;

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  // Show authentication screens if not logged in
  if (!isAuthenticated) {
    return showLogin ? (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowLogin(false)}
        isLoading={authLoading}
      />
    ) : (
      <Register 
        onRegister={handleRegister}
        onSwitchToLogin={() => setShowLogin(true)}
        isLoading={authLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation 
        activeView={view} 
        setView={setView}
        openSettingsModal={() => setIsSettingsModalOpen(true)}
        onLogout={handleLogout}
        user={user}
      />
      

      
      <div className="md:ml-64 pt-16 md:pt-0">
        <div className="pt-16 md:pt-4 px-4 md:px-6 lg:px-8 pb-20">
          {/* Top Bar with Points Display */}
          <div className="sticky top-0 z-20 bg-gray-900 py-3 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </h1>
              <div className="flex items-center gap-4">
                <PointsDisplay 
                  points={localProgress.points}
                  level={localProgress.level}
                  recentActivity={[]}
                />
              </div>
            </div>
          </div>
          
          {/* Error message display */}
          {error && (
            <div className="bg-red-900/30 border-l-4 border-red-500 text-red-300 p-4 rounded mb-6 shadow-md">
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
              {/* Dynamic Greeting */}
              <DynamicGreeting 
                user={user}
                currentMood={currentMood}
                onMoodSelect={handleMoodSelect}
              />

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Focus Session */}
                <div className="lg:col-span-1">
                  <FocusSession />
                </div>

                {/* Points System */}
                <div className="lg:col-span-1">
                  <PointsSystem 
                    points={localProgress.points}
                    streaks={{ moodStreak: streak }}
                    level={localProgress.level}
                    achievements={[]}
                  />
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowMoodForm(true)}
                        className="w-full p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                      >
                        <span className="text-2xl">📝</span>
                        <span className="font-medium">Log Mood</span>
                      </button>
                      
                      <button
                        onClick={() => setView('chat')}
                        className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                      >
                        <span className="text-2xl">💬</span>
                        <span className="font-medium">AI Coach</span>
                      </button>
                      
                      <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                      >
                        <span className="text-2xl">📅</span>
                        <span className="font-medium">View Calendar</span>
                      </button>
                      
                      <button
                        onClick={() => setView('insights')}
                        className="w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                      >
                        <span className="text-2xl">📊</span>
                        <span className="font-medium">View Insights</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Section */}
              {showCalendar && (
                <div className="mb-6">
                  <MoodCalendar 
                    moods={moods}
                    onDateClick={handleCalendarDateClick}
                    points={localProgress.points}
                    streaks={{ moodStreak: streak }}
                  />
                </div>
              )}

              {/* Recent Activity & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Recent Moods */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Recent Moods</h2>
                  {moods.slice(0, 5).map((mood, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          mood.mood === 'thriving' ? 'bg-emerald-500' :
                          mood.mood === 'good' ? 'bg-green-500' :
                          mood.mood === 'neutral' ? 'bg-yellow-500' :
                          mood.mood === 'struggling' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-white font-medium capitalize">{mood.mood}</span>
                      </div>
                      <span className="text-sm text-slate-400">
                        {new Date(mood.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Wellness Stats */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Wellness Stats</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Current Streak</span>
                      <span className="text-emerald-400 font-bold">{streak} days</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Points</span>
                      <span className="text-blue-400 font-bold">{localProgress.points}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Current Level</span>
                      <span className="text-purple-400 font-bold">{localProgress.level}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Moods Logged</span>
                      <span className="text-orange-400 font-bold">{moods.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {view === 'log' && (
            <div className="animate-fade-in">
              {/* Wellness Check-in Header */}
              <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 text-white shadow-xl">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                  <span className="text-emerald-100 text-sm font-medium">Wellness Check-in</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">How's your mental health today?</h1>
                <p className="text-emerald-100 opacity-90">Share your wellness journey and discover patterns in your emotional wellbeing.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Enhanced Wellness Check-in Form */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                  <div className="p-5 border-b border-gray-700 bg-gray-800/50">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      Wellness Check-in
                    </h2>
                  </div>
                  <div className="p-6">
                    <MoodForm 
                      addMood={handleAddMood} 
                      isLoading={loading} 
                      customMoodCategories={customMoodCategories}
                      moods={moods}
                      habits={habits}
                      userGoals={goals}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Wellness Insights Panel */}
                  {moods.length > 0 && (
                    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                      <div className="p-5 border-b border-gray-700 bg-gray-800/50">
                        <h2 className="text-xl font-bold text-white flex items-center">
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-lg mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </span>
                          Wellness Insights
                        </h2>
                      </div>
                      <div className="p-6">
                        <PersonalizedTips moods={moods} />
                      </div>
                    </div>
                  )}
                  
                  {/* Wellness History */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-5 border-b border-gray-700 bg-gray-800/50">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        Your Wellness Journey
                      </h2>
                    </div>
                    <div className="p-6">
                      {loading ? (
                        <div className="flex justify-center items-center h-40">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
                        </div>
                      ) : moods.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="mb-6 inline-flex p-4 rounded-full bg-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-medium mb-3 text-white">Start Your Wellness Journey</h3>
                          <p className="text-gray-400 mb-6">Begin tracking your mental health to discover patterns and get personalized insights.</p>
                          <button
                            onClick={() => setShowMoodForm(true)}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors inline-flex items-center font-medium"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Begin Tracking
                          </button>
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
              
              {/* Wellness Analytics Section */}
              {moods.length > 0 && (
                <div className="mt-6">
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-5 border-b border-gray-700 bg-gray-800/50">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </span>
                        Wellness Analytics
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
            <div className="animate-fade-in">
              {/* Insights Header */}
              <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white shadow-xl">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                  <span className="text-blue-100 text-sm font-medium">Wellness Analytics</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Wellness Insights</h1>
                <p className="text-blue-100 opacity-90">Discover patterns, understand triggers, and gain deeper insights into your mental health journey.</p>
              </div>

              {wellnessEntries.length === 0 && moods.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-6 inline-flex p-4 rounded-full bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-medium mb-3 text-white">No Data to Analyze Yet</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">Start tracking your wellness to unlock personalized insights and discover patterns in your mental health.</p>
                  <button
                    onClick={() => setView('log')}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors inline-flex items-center font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Start Tracking
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Enhanced Analytics */}
                  <EnhancedAnalytics wellnessEntries={wellnessEntries} />
                  
                  {/* Wellness Journey Entries */}
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Your Wellness Journey</h2>
                      <button
                        onClick={() => setShowWellnessForm(true)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Add Entry
                      </button>
                    </div>
                    
                    {wellnessLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                        <span className="ml-3 text-gray-300">Loading wellness entries...</span>
                      </div>
                    ) : wellnessEntries.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">📝</div>
                        <h3 className="text-lg font-semibold text-white mb-2">No Wellness Entries Yet</h3>
                        <p className="text-gray-400 mb-4">Start logging your wellness journey to see detailed insights.</p>
                        <button
                          onClick={() => setShowWellnessForm(true)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Create First Entry
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {wellnessEntries.map((entry) => (
                          <WellnessJourneyEntry
                            key={entry.id}
                            entry={entry}
                            onDelete={handleDeleteWellnessEntry}
                            onEdit={handleEditWellnessEntry}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Legacy Analytics (if mood data exists) */}
                  {moods.length > 0 && (
                    <>
                      {/* Wellness Trends Overview */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                            <div className="p-5 border-b border-gray-700 bg-gray-800/50">
                              <h2 className="text-xl font-bold text-white flex items-center">
                                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-2 rounded-lg mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                </span>
                                Legacy Mood Trends
                              </h2>
                            </div>
                            <div className="p-6">
                              <MoodChart moods={moods} />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <MoodStats moods={moods} />
                        </div>
                      </div>
                      
                      {/* Deep Analytics */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                          <div className="p-5 border-b border-gray-700 bg-gray-800/50">
                            <h2 className="text-xl font-bold text-white flex items-center">
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                              </span>
                              Pattern Analysis
                            </h2>
                          </div>
                          <div className="p-6">
                            <MoodAnalysis moods={moods} />
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                          <div className="p-5 border-b border-gray-700 bg-gray-800/50">
                            <h2 className="text-xl font-bold text-white flex items-center">
                              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-lg mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </span>
                              Weekly Reflection
                            </h2>
                          </div>
                          <div className="p-6">
                            <WeeklyReflection moods={moods} habits={habits} goals={goals} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Wellness Achievements */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-5 border-b border-gray-700 bg-gray-800/50">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </span>
                        Wellness Achievements
                      </h2>
                    </div>
                    <div className="p-6">
                      <MoodAchievements moods={moods} />
                    </div>
                  </div>
                  
                  {/* Actionable Insights */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-5 border-b border-gray-700 bg-gray-800/50">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </span>
                        Personalized Recommendations
                      </h2>
                    </div>
                    <div className="p-6">
                      <PersonalizedTips moods={moods} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat/Coach View */}
          {view === 'chat' && (
            <div className="animate-fade-in">
              {/* Wellness Coach Header */}
              <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-white shadow-xl">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                  <span className="text-purple-100 text-sm font-medium">AI Wellness Coach</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Personal Wellness Coach</h1>
                <p className="text-purple-100 opacity-90">Get personalized guidance, insights, and support for your mental health journey.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Chat Interface */}
                <div className="lg:col-span-3">
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 h-[calc(100vh-12rem)]">
                    <div className="p-5 border-b border-gray-700 bg-gray-800/50">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </span>
                        Wellness Coach Chat
                      </h2>
                    </div>
                    <div className="h-full flex flex-col">
                      <MoodAssistant 
                        moods={moods}
                        habits={habits}
                        goals={goals}

                        setView={setView}
                        expanded={true}
                        fullPage={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Wellness Coach Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                      <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <button
                        onClick={() => setView('log')}
                        className="w-full p-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-left flex items-center transition-colors"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Check In
                      </button>
                      <button
                        onClick={() => setView('insights')}
                        className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-left flex items-center transition-colors"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        View Insights
                      </button>
                      <button
                        onClick={() => setView('progress')}
                        className="w-full p-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-left flex items-center transition-colors"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Track Progress
                      </button>
                    </div>
                  </div>

                  {/* Wellness Status */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                      <h3 className="text-lg font-bold text-white">Wellness Status</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Current Streak</span>
                        <span className="text-white font-medium">{streak} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Wellness Score</span>
                        <span className="text-emerald-400 font-medium">{localProgress.points}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Level</span>
                        <span className="text-blue-400 font-medium">{localProgress.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Total Check-ins</span>
                        <span className="text-purple-400 font-medium">{moods.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Topics */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                      <h3 className="text-lg font-bold text-white">Suggested Topics</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {[
                        "How can I improve my mood?",
                        "What are some stress management techniques?",
                        "How do I build better habits?",
                        "Can you help me understand my patterns?",
                        "What should I do when I'm feeling overwhelmed?",
                        "How can I practice self-care?"
                      ].map((topic, index) => (
                        <button
                          key={index}
                          className="w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-left text-sm transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wellness Tips */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                      <h3 className="text-lg font-bold text-white">Daily Wellness Tip</h3>
                    </div>
                    <div className="p-4">
                      <DailyQuote compact={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress View - Enhanced */}
          {view === 'progress' && (
            <ProgressSystem 
              points={localProgress.points}
              level={localProgress.level}
              todos={todos}
              moods={moods}
              onLevelUp={(newLevel) => {
                setLocalProgress(prev => ({ ...prev, level: newLevel }));
              }}
            />
          )}

          {/* Todos View */}
          {view === 'todos' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">Personalized Wellness Tasks</h2>
                <p className="text-gray-400 mb-6">Track your progress and build healthy habits based on your wellness patterns.</p>
                
                <TodoList 
                  todos={todos}
                  moods={moods}
                  habits={habits}
                  goals={goals}
                  wellnessScore={moods.length > 0 ? calculateWellnessScore(moods[0]) : 5}
                  setView={setView}
                  onTodoComplete={handleCompleteTodo}
                />
              </div>
            </div>
          )}

          {/* Recommendation Selector Modal */}
          {showRecommendationSelector && (
            <RecommendationSelector
              recommendations={currentRecommendations}
              onAddToTodo={handleAddTodo}
              onClose={() => setShowRecommendationSelector(false)}
            />
          )}



          {/* Modal for logging mood */}
          {showMoodForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">How are you feeling?</h2>
                    <button 
                      onClick={() => setShowMoodForm(false)}
                      className="text-gray-400 hover:text-gray-200"
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
                    moods={moods}
                    habits={habits}
                    userGoals={goals}
                  />
                </div>
              </div>
            </div>
          )}
          

        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <Settings 
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          customMoodCategories={customMoodCategories}
          onAddCustomMood={handleAddCustomMood}
          onRemoveCustomMood={handleRemoveCustomMood}
          user={user}
          onLogout={handleLogout}
          onUpdateUser={(updatedUser) => {
            setUser(updatedUser);
            // Update local storage or any other user state
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }}
        />
      )}

      {/* Insights Modal */}
      {showInsightsModal && currentInsights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Wellness Insights</h2>
              <button
                onClick={() => setShowInsightsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Wellness Score */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Your Wellness Score</h3>
                <span className="text-3xl font-bold text-white">{currentInsights.wellnessScore}/10</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(currentInsights.wellnessScore / 10) * 100}%` }}
                ></div>
              </div>
              <p className="text-emerald-100 text-sm mt-2">
                {currentInsights.wellnessScore >= 8 ? 'Excellent wellness!' :
                 currentInsights.wellnessScore >= 6 ? 'Good wellness level' :
                 currentInsights.wellnessScore >= 4 ? 'Room for improvement' :
                 'Focus on self-care needed'}
              </p>
            </div>

            {/* Immediate Insights */}
            {currentInsights.immediate.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Current State</h3>
                <div className="space-y-3">
                  {currentInsights.immediate.map((insight, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border-l-4 border-emerald-500">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{insight.icon}</span>
                        <h4 className={`font-medium ${insight.color}`}>{insight.title}</h4>
                      </div>
                      <p className="text-gray-300">{insight.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mood Trend */}
            {currentInsights.moodTrend && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Trend Analysis</h3>
                <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{currentInsights.moodTrend.icon}</span>
                    <h4 className={`font-medium ${currentInsights.moodTrend.color}`}>
                      {currentInsights.moodTrend.type === 'improving' ? 'Improving Trend' :
                       currentInsights.moodTrend.type === 'declining' ? 'Declining Trend' : 'Stable Trend'}
                    </h4>
                  </div>
                  <p className="text-gray-300">{currentInsights.moodTrend.message}</p>
                </div>
              </div>
            )}

            {/* AI Summary */}
            {currentInsights.aiSummary && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">AI Analysis</h3>
                <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-gray-300">{currentInsights.aiSummary}</p>
                </div>
              </div>
            )}

            {/* AI Patterns */}
            {currentInsights.aiPatterns && currentInsights.aiPatterns.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Pattern Recognition</h3>
                <div className="space-y-3">
                  {currentInsights.aiPatterns.map((pattern, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border-l-4 border-purple-500">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">📊</span>
                        <h4 className="font-medium text-purple-400">Pattern {index + 1}</h4>
                      </div>
                      <p className="text-gray-300">{pattern}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local Patterns */}
            {currentInsights.patterns && currentInsights.patterns.length > 0 && !currentInsights.aiPatterns && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Pattern Recognition</h3>
                <div className="space-y-3">
                  {currentInsights.patterns.map((pattern, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border-l-4 border-purple-500">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{pattern.icon}</span>
                        <h4 className={`font-medium ${pattern.color}`}>{pattern.title}</h4>
                      </div>
                      <p className="text-gray-300">{pattern.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Triggers */}
            {currentInsights.triggers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Trigger Analysis</h3>
                <div className="space-y-3">
                  {currentInsights.triggers.map((trigger, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500">
                      <h4 className="text-yellow-400 font-medium mb-2">Trigger: {trigger.trigger.replace('_', ' ')}</h4>
                      <p className="text-gray-300">{trigger.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {currentInsights.activities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Wellness Activities</h3>
                <div className="space-y-3">
                  {currentInsights.activities.map((activity, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border-l-4 border-green-500">
                      <h4 className="text-green-400 font-medium mb-2">Activity: {activity.activity.replace('_', ' ')}</h4>
                      <p className="text-gray-300">{activity.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Intervention Plan */}
            {currentInsights.interventionPlan && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Intervention Plan</h3>
                <div className="space-y-4">
                  {currentInsights.interventionPlan.immediate && currentInsights.interventionPlan.immediate.length > 0 && (
                    <div>
                      <h4 className="text-red-400 font-medium mb-2">Immediate Actions</h4>
                      <div className="space-y-2">
                        {currentInsights.interventionPlan.immediate.map((action, index) => (
                          <div key={index} className="bg-gray-700 rounded-lg p-3 border-l-4 border-red-500">
                            <p className="text-gray-300">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentInsights.interventionPlan.shortTerm && currentInsights.interventionPlan.shortTerm.length > 0 && (
                    <div>
                      <h4 className="text-yellow-400 font-medium mb-2">Short-term Strategies</h4>
                      <div className="space-y-2">
                        {currentInsights.interventionPlan.shortTerm.map((strategy, index) => (
                          <div key={index} className="bg-gray-700 rounded-lg p-3 border-l-4 border-yellow-500">
                            <p className="text-gray-300">{strategy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentInsights.interventionPlan.longTerm && currentInsights.interventionPlan.longTerm.length > 0 && (
                    <div>
                      <h4 className="text-green-400 font-medium mb-2">Long-term Goals</h4>
                      <div className="space-y-2">
                        {currentInsights.interventionPlan.longTerm.map((goal, index) => (
                          <div key={index} className="bg-gray-700 rounded-lg p-3 border-l-4 border-green-500">
                            <p className="text-gray-300">{goal}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {currentInsights.aiRecommendations && currentInsights.aiRecommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Personalized Recommendations</h3>
                <div className="space-y-3">
                  {currentInsights.aiRecommendations.map((rec, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border-l-4 border-indigo-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-indigo-400 font-medium">Recommendation {index + 1}</h4>
                        <span className="text-xs px-2 py-1 rounded bg-yellow-500 text-black">
                          medium priority
                        </span>
                      </div>
                      <p className="text-gray-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local Recommendations */}
            {currentInsights.recommendations && currentInsights.recommendations.length > 0 && !currentInsights.aiRecommendations && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Personalized Recommendations</h3>
                <div className="space-y-3">
                  {currentInsights.recommendations.map((rec, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border-l-4 border-indigo-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-indigo-400 font-medium">{rec.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          rec.priority === 'high' ? 'bg-red-500 text-white' :
                          rec.priority === 'medium' ? 'bg-yellow-500 text-black' :
                          'bg-green-500 text-white'
                        }`}>
                          {rec.priority} priority
                        </span>
                      </div>
                      <p className="text-gray-300">{rec.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInsightsModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Got it
              </button>
              {currentInsights.wellnessScore < 5 && (
                <button
                  onClick={() => {
                    setShowInsightsModal(false);
                    setView('chat');
                  }}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Talk with Coach
                </button>
              )}
              <button
                onClick={() => {
                  setShowInsightsModal(false);
                  setView('insights');
                }}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                View Full Insights
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Wellness check-in saved successfully!
          </div>
        </div>
      )}
    </div>
  );
}

export default AppWithTheme;
