import { useState, useEffect } from 'react';

// Define point values for different actions
const POINTS = {
  LOG_MOOD: 10,
  ADD_NOTE: 5,
  ADD_ACTIVITIES: 5,
  ADD_TAGS: 5,
  COMPLETE_CHALLENGE: 20,
  CREATE_HABIT: 15,
  COMPLETE_HABIT: 10,
  MAINTAIN_STREAK_3: 30,  // 3-day streak
  MAINTAIN_STREAK_7: 100, // 7-day streak
  MAINTAIN_STREAK_30: 500, // 30-day streak
  SET_GOAL: 20,
  COMPLETE_MILESTONE: 25,
  COMPLETE_GOAL: 100,
  DAILY_REFLECTION: 15
};

// Define levels and their thresholds
const LEVELS = [
  { level: 1, name: "Beginner", threshold: 0, reward: "Access to basic tracking" },
  { level: 2, name: "Observer", threshold: 50, reward: "Unlock mood patterns" },
  { level: 3, name: "Tracker", threshold: 150, reward: "Unlock weekly insights" },
  { level: 4, name: "Analyzer", threshold: 300, reward: "Unlock detailed analytics" },
  { level: 5, name: "Mindfulness Adept", threshold: 500, reward: "Unlock personalized tips" },
  { level: 6, name: "Emotion Master", threshold: 750, reward: "Unlock advanced predictions" },
  { level: 7, name: "Wellbeing Guru", threshold: 1000, reward: "Unlock theme customization" },
  { level: 8, name: "Mood Sage", threshold: 1500, reward: "Unlock all features" },
  { level: 9, name: "Enlightened", threshold: 2000, reward: "Special badge and recognition" },
  { level: 10, name: "Emotional Intelligence Expert", threshold: 3000, reward: "Master badge and status" }
];

const PointsSystem = ({ userId = 'default-user' }) => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(LEVELS[0]);
  const [nextLevel, setNextLevel] = useState(LEVELS[1]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [justEarned, setJustEarned] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [levelUp, setLevelUp] = useState(false);

  // Load points data on component mount
  useEffect(() => {
    loadPointsData();
  }, [userId]);

  // Update level when points change
  useEffect(() => {
    updateLevel();
  }, [points]);

  // Reset animation state after showing it
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
        setJustEarned(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  // Reset level up animation
  useEffect(() => {
    if (levelUp) {
      const timer = setTimeout(() => {
        setLevelUp(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [levelUp]);

  const loadPointsData = () => {
    // In a real app, this would fetch from backend
    // For now, we'll use localStorage
    const savedData = localStorage.getItem(`points-data-${userId}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPoints(parsedData.points || 0);
      setPointsHistory(parsedData.history || []);
    }
  };

  const savePointsData = () => {
    const data = {
      points,
      history: pointsHistory
    };
    localStorage.setItem(`points-data-${userId}`, JSON.stringify(data));
  };

  const updateLevel = () => {
    // Find current level based on points
    const currentLevel = [...LEVELS].reverse().find(l => points >= l.threshold);
    if (currentLevel && currentLevel.level !== level.level) {
      setLevel(currentLevel);
      setLevelUp(true);
    }
    
    // Find next level
    const nextLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level) + 1;
    if (nextLevelIndex < LEVELS.length) {
      setNextLevel(LEVELS[nextLevelIndex]);
    } else {
      setNextLevel(null); // Max level reached
    }
  };

  const awardPoints = (action, details = {}) => {
    if (!POINTS[action]) return;
    
    const pointsToAdd = POINTS[action];
    const newTotal = points + pointsToAdd;
    
    // Create history entry
    const historyEntry = {
      action,
      points: pointsToAdd,
      timestamp: new Date().toISOString(),
      details
    };
    
    setPoints(newTotal);
    setPointsHistory(prev => [historyEntry, ...prev]);
    setJustEarned({ action, points: pointsToAdd });
    setShowAnimation(true);
    
    // Save updated data
    setTimeout(savePointsData, 500);
    
    return pointsToAdd;
  };

  // Calculate progress to next level
  const calculateProgress = () => {
    if (!nextLevel) return 100; // Max level reached
    
    const pointsNeededForNextLevel = nextLevel.threshold - level.threshold;
    const pointsEarnedSinceLastLevel = points - level.threshold;
    return Math.min(100, Math.round((pointsEarnedSinceLastLevel / pointsNeededForNextLevel) * 100));
  };

  // Make sure you return formatted values that can be directly rendered
  return {
    points,
    // Instead of just returning the level object
    level: {
      level: level.level, // Numeric value
      name: level.name,   // String value
      threshold: level.threshold,
      reward: level.reward
    },
    // Add these pre-formatted properties for direct rendering
    levelNumber: level.level,
    levelName: level.name,
    nextLevel: nextLevel ? nextLevel.threshold : null,
    progress: calculateProgress(),
    pointsHistory,
    awardPoints,
    showAnimation,
    justEarned,
    levelUp,
    totalPoints: points
  };
};

export default PointsSystem;