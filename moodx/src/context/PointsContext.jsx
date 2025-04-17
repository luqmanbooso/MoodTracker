import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import axios from 'axios';

const PointsContext = createContext();

export const usePoints = () => useContext(PointsContext);

export const PointsProvider = ({ children }) => {
  const { theme } = useTheme();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [nextLevelPoints, setNextLevelPoints] = useState(100);
  
  // Calculate level based on points
  const calculateLevel = (pts) => {
    // Level formula: Level = 1 + floor(sqrt(points/20))
    // This creates a progressively harder level curve
    const newLevel = 1 + Math.floor(Math.sqrt(pts / 20));
    
    // Calculate points needed for next level
    const nextLevelPts = Math.pow(newLevel + 1, 2) * 20;
    
    setLevel(newLevel);
    setNextLevelPoints(nextLevelPts);
  };

  // Add points and recalculate level
  const addPoints = (pts) => {
    const newTotal = points + pts;
    setPoints(newTotal);
    calculateLevel(newTotal);
    
    // Store in localStorage for persistence
    localStorage.setItem('userPoints', newTotal.toString());
    
    // Try to update points in backend
    try {
      axios.post('/api/users/points', { points: newTotal });
    } catch (err) {
      console.log('Could not update points in API, using localStorage only');
    }
    
    return {
      newTotal,
      level: 1 + Math.floor(Math.sqrt(newTotal / 20))
    };
  };
  
  // Fetch points data from API or localStorage on mount
  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        // Try to get from localStorage first (for quicker loading)
        const storedPoints = localStorage.getItem('userPoints');
        if (storedPoints) {
          const pts = parseInt(storedPoints);
          setPoints(pts);
          calculateLevel(pts);
        }
        
        // Then try to get from API
        try {
          const response = await axios.get('/api/users/points');
          const pts = response.data.points;
          setPoints(pts);
          calculateLevel(pts);
          localStorage.setItem('userPoints', pts.toString());
        } catch (err) {
          console.log('Could not fetch points from API, using localStorage');
        }
      } catch (err) {
        console.error('Error loading points:', err);
        // Default to 0 points
        setPoints(0);
        calculateLevel(0);
      }
    };
    
    fetchPointsData();
  }, []);
  
  return (
    <PointsContext.Provider value={{ 
      points, 
      level, 
      nextLevelPoints, 
      addPoints,
      progress: (points / nextLevelPoints) * 100
    }}>
      {children}
    </PointsContext.Provider>
  );
};