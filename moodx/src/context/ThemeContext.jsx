import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get theme from localStorage or default to light mode with indigo color
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : {
      mode: 'light',
      primaryColor: 'indigo',
      cardBg: 'bg-white',
      textColor: 'text-gray-800'
    };
  });
  
  // Available theme colors
  const themeColors = [
    'indigo', 'purple', 'pink', 'blue', 'teal', 
    'green', 'yellow', 'orange', 'red'
  ];

  // Set theme and update localStorage
  const setTheme = (newTheme) => {
    // Calculate derived properties based on mode
    const updatedTheme = {
      ...newTheme,
      cardBg: newTheme.mode === 'dark' ? 'bg-gray-900' : 'bg-white',
      textColor: newTheme.mode === 'dark' ? 'text-gray-100' : 'text-gray-800'
    };
    
    setThemeState(updatedTheme);
    localStorage.setItem('theme', JSON.stringify(updatedTheme));
  };
  
  // Shortcut to just change the primary color
  const setThemeColor = (color) => {
    setTheme({ ...theme, primaryColor: color });
  };
  
  // Apply theme to document when it changes
  useEffect(() => {
    // Apply dark mode to document
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme,
      themeColors,
      setThemeColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);