import { useState, useEffect } from 'react';
import { awardPoints, getProgress } from '../services/progressApi';

// Wellness-focused point values
const WELLNESS_VALUES = {
  LOG_MOOD: 15,           // Base wellness check-in
  ADD_NOTE: 10,           // Self-reflection bonus
  ADD_ACTIVITIES: 8,      // Activity awareness
  ADD_TAGS: 5,            // Emotional awareness
  COMPLETE_HABIT: 20,     // Healthy habit completion
  COMPLETE_MILESTONE: 25, // Goal progress
  COMPLETE_GOAL: 50,      // Major achievement
  DAILY_STREAK: 15,       // Consistency bonus
  WEEKLY_STREAK: 40,      // Weekly consistency
  MONTHLY_STREAK: 100,    // Monthly dedication
  WELLNESS_INSIGHT: 12,   // Understanding patterns
  SELF_CARE_ACTIVITY: 18  // Self-care actions
};

const PointsSystem = ({ userId = 'default-user' }) => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState({ level: 1, name: "Wellness Beginner" });
  const [nextLevel, setNextLevel] = useState({ level: 2, name: "Wellness Explorer", threshold: 100 });
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
      
      // Determine wellness level name based on level number
      let levelName = "Wellness Beginner";
      if (progressData.level >= 10) levelName = "Wellness Master";
      else if (progressData.level >= 8) levelName = "Wellness Advocate";
      else if (progressData.level >= 6) levelName = "Wellness Enthusiast";
      else if (progressData.level >= 4) levelName = "Wellness Explorer";
      else if (progressData.level >= 2) levelName = "Wellness Learner";
      
      setLevel({
        level: progressData.level,
        name: levelName,
        threshold: progressData.points - (progressData.points % 100)
      });
      
      // Calculate next level
      setNextLevel({
        level: progressData.level + 1,
        name: "Next Wellness Level",
        threshold: progressData.points + (100 - (progressData.points % 100))
      });
      
      // Set points history
      if (progressData.recentHistory) {
        setPointsHistory(progressData.recentHistory);
      }
    } catch (error) {
      console.error('Error loading wellness data:', error);
    }
  };

  // Award wellness points for specific actions
  const awardPointsForAction = async (action) => {
    // Prevent spamming by requiring at least 1 second between point awards
    const now = Date.now();
    if (now - lastUpdateTime < 1000) {
      return 0;
    }
    setLastUpdateTime(now);
    
    // Get wellness points for this action
    const pointsToAdd = WELLNESS_VALUES[action] || 1;
    
    // Generate a meaningful description based on the wellness action
    let description = "Wellness activity completed";
    let reason = "wellness_activity";
    
    switch(action) {
      case 'LOG_MOOD': 
        description = "Completed wellness check-in";
        reason = "wellness_checkin";
        break;
      case 'ADD_NOTE': 
        description = "Added self-reflection";
        reason = "self_reflection";
        break;
      case 'ADD_ACTIVITIES':
        description = "Tracked wellness activities";
        reason = "activity_awareness";
        break;
      case 'ADD_TAGS':
        description = "Enhanced emotional awareness";
        reason = "emotional_awareness"; 
        break;
      case 'COMPLETE_HABIT':
        description = "Completed healthy habit";
        reason = "healthy_habit";
        break;
      case 'COMPLETE_MILESTONE':
        description = "Achieved wellness milestone";
        reason = "wellness_milestone";
        break;
      case 'COMPLETE_GOAL':
        description = "Reached major wellness goal";
        reason = "wellness_goal";
        break;
      case 'WELLNESS_INSIGHT':
        description = "Gained wellness insight";
        reason = "wellness_insight";
        break;
      case 'SELF_CARE_ACTIVITY':
        description = "Completed self-care activity";
        reason = "self_care";
        break;
      default:
        description = "Wellness activity completed";
        reason = "wellness_activity";
    }
    
    try {
      // Call the API to award wellness points
      const result = await awardPoints(pointsToAdd, reason, description);
      
      // Update local state with new data
      setPoints(result.points);
      
      // Check for level up
      if (result.level > level.level) {
        setLevelUp(true);
        
        // Update level information
        let newLevelName = "Wellness Beginner";
        if (result.level >= 10) newLevelName = "Wellness Master";
        else if (result.level >= 8) newLevelName = "Wellness Advocate";
        else if (result.level >= 6) newLevelName = "Wellness Enthusiast";
        else if (result.level >= 4) newLevelName = "Wellness Explorer";
        else if (result.level >= 2) newLevelName = "Wellness Learner";
        
        setLevel({
          level: result.level,
          name: newLevelName,
          threshold: result.points - (result.points % 100)
        });
        
        // Update next level
        setNextLevel({
          level: result.level + 1,
          name: "Next Wellness Level",
          threshold: result.points + (100 - (result.points % 100))
        });
      }
      
      // Show animation
      setJustEarned({ action, points: pointsToAdd });
      setShowAnimation(true);
      
      return pointsToAdd;
      
    } catch (error) {
      console.error('Error awarding wellness points:', error);
      return 0;
    }
  };

  // Calculate progress to next wellness level
  const calculateProgress = () => {
    if (!nextLevel) return 100; // Max level reached
    
    const pointsNeededForNextLevel = nextLevel.threshold - level.threshold;
    const pointsEarnedSinceLastLevel = points - level.threshold;
    return Math.min(100, Math.round((pointsEarnedSinceLastLevel / pointsNeededForNextLevel) * 100));
  };

  // Make sure you return formatted values that can be directly rendered
  return {
    points,
    // Wellness level information
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