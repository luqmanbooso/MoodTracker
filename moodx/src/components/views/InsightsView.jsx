import React from 'react';
import { useTheme } from '../../context/ThemeContext';

// Create a basic working version first
const InsightsView = ({ moods = [] }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Mood Insights
        </h1>
      </div>
      
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
          {moods.length === 0 
            ? "Start logging your moods to see insights and patterns." 
            : `You have logged ${moods.length} moods. More detailed insights will appear here.`}
        </p>
      </div>
    </div>
  );
};

// Make sure this line exists at the end of the file
export default InsightsView;