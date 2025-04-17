import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider component
export function ThemeProvider({ children }) {
  // Initialize theme from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Update localStorage and body class when theme changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    
    // Apply or remove dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Define theme properties
  const theme = {
    primaryColor: darkMode ? 'emerald' : 'orange',
    cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
    textColor: darkMode ? 'text-white' : 'text-gray-800',
    borderColor: darkMode ? 'border-gray-700' : 'border-gray-200',
    mutedText: darkMode ? 'text-gray-400' : 'text-gray-600',
    chartColors: darkMode ? 
      ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'] : 
      ['#F97316', '#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B']
  };

  // Add additional theme colors that can be used separately
  const themeColors = {
    primary: darkMode ? '#10B981' : '#F97316', // Green for dark mode, Orange for light mode
    secondary: darkMode ? '#065F46' : '#FDBA74',
    background: darkMode ? '#111827' : '#FFFFFF',
    cardBackground: darkMode ? '#1F2937' : '#F9FAFB',
    text: darkMode ? '#F9FAFB' : '#1F2937',
    textSecondary: darkMode ? '#9CA3AF' : '#6B7280',
    border: darkMode ? '#374151' : '#E5E7EB',
  };

  // Context value
  const value = {
    darkMode,
    toggleDarkMode,
    themeColors,
    theme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for using the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}