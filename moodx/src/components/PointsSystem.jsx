import { useState, useEffect } from 'react';
import { awardPoints, getProgress } from '../services/progressApi';

// Action point values
const POINT_VALUES = {
  LOG_MOOD: 10,
  ADD_NOTE: 5,
  ADD_ACTIVITIES: 5,
  ADD_TAGS: 5,
  COMPLETE_HABIT: 15,
  COMPLETE_MILESTONE: 20,
  COMPLETE_GOAL: 50,
  COMPLETE_CHALLENGE: 25,
  DAILY_STREAK: 10,
  WEEKLY_STREAK: 30,
  MONTHLY_STREAK: 100
};

const PointsSystem = ({ userId = 'default-user' }) => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState({ level: 1, name: "Beginner" });
  const [nextLevel, setNextLevel] = useState({ level: 2, name: "Novice", threshold: 100 });
  const [pointsHistory, setPointsHistory] = useState([]);
  const [justEarned, setJustEarned] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  // Load points data on component mount
  useEffect(() => {
    loadPointsData();
  }, [userId]);

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

  const loadPointsData = async () => {
    try {
      const progressData = await getProgress();
      
      // Set points, level
      setPoints(progressData.points);
      
      // Determine level name based on level number
      let levelName = "Beginner";
      if (progressData.level >= 10) levelName = "Emotional Intelligence Expert";
      else if (progressData.level >= 8) levelName = "Mindfulness Master";
      else if (progressData.level >= 6) levelName = "Emotion Navigator";
      else if (progressData.level >= 4) levelName = "Wellbeing Enthusiast";
      else if (progressData.level >= 2) levelName = "Novice";
      
      setLevel({
        level: progressData.level,
        name: levelName,
        threshold: progressData.points - (progressData.points % 100)
      });
      
      // Calculate next level
      setNextLevel({
        level: progressData.level + 1,
        name: "Next Level",
        threshold: progressData.points + (100 - (progressData.points % 100))
      });
      
      // Set points history
      if (progressData.recentHistory) {
        setPointsHistory(progressData.recentHistory);
      }
    } catch (error) {
      console.error('Error loading points data:', error);
    }
  };

  // Award points for specific actions
  const awardPointsForAction = async (action) => {
    // Prevent spamming by requiring at least 1 second between point awards
    const now = Date.now();
    if (now - lastUpdateTime < 1000) {
      return 0;
    }
    setLastUpdateTime(now);
    
    // Get points for this action
    const pointsToAdd = POINT_VALUES[action] || 1;
    
    // Generate a description based on the action
    let description = "Points earned";
    let reason = "misc";
    
    switch(action) {
      case 'LOG_MOOD': 
        description = "Logged your mood";
        reason = "mood_entry";
        break;
      case 'ADD_NOTE': 
        description = "Added mood details";
        reason = "mood_entry";
        break;
      case 'ADD_ACTIVITIES':
        description = "Tracked activities";
        reason = "mood_entry";
        break;
      case 'ADD_TAGS':
        description = "Tagged your mood";
        reason = "mood_entry"; 
        break;
      case 'COMPLETE_HABIT':
        description = "Completed a habit";
        reason = "habit_complete";
        break;
      case 'COMPLETE_MILESTONE':
        description = "Reached a goal milestone";
        reason = "goal_progress";
        break;
      case 'COMPLETE_GOAL':
        description = "Achieved a goal";
        reason = "goal_complete";
        break;
      case 'COMPLETE_CHALLENGE':
        description = "Completed a challenge";
        reason = "challenge_complete";
        break;
      default:
        description = "Activity completed";
        reason = "misc";
    }
    
    try {
      // Call the API to award points
      const result = await awardPoints(pointsToAdd, reason, description);
      
      // Update local state with new data
      setPoints(result.points);
      
      // Check for level up
      if (result.level > level.level) {
        setLevelUp(true);
        
        // Update level information
        let newLevelName = "Beginner";
        if (result.level >= 10) newLevelName = "Emotional Intelligence Expert";
        else if (result.level >= 8) newLevelName = "Mindfulness Master";
        else if (result.level >= 6) newLevelName = "Emotion Navigator";
        else if (result.level >= 4) newLevelName = "Wellbeing Enthusiast";
        else if (result.level >= 2) newLevelName = "Novice";
        
        setLevel({
          level: result.level,
          name: newLevelName,
          threshold: result.points - (result.points % 100)
        });
        
        // Update next level
        setNextLevel({
          level: result.level + 1,
          name: "Next Level",
          threshold: result.points + (100 - (result.points % 100))
        });
      }
      
      // Show animation
      setJustEarned({ action, points: pointsToAdd });
      setShowAnimation(true);
      
      return pointsToAdd;
      
    } catch (error) {
      console.error('Error awarding points:', error);
      return 0;
    }
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
    nextLevel: nextLevel.threshold,
    progress: calculateProgress(),
    pointsHistory,
    awardPoints: awardPointsForAction,
    showAnimation,
    justEarned,
    levelUp,
    totalPoints: points
  };
};

export default PointsSystem;