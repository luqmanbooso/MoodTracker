import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // No more toggleDarkMode or theme state - always dark
  
  // Fixed dark theme values
  const theme = {
    primaryColor: 'emerald',
    cardBg: 'bg-gray-800',
    textColor: 'text-white',
    secondaryText: 'text-gray-300',
    borderColor: 'border-gray-700',
    buttonBg: 'bg-emerald-500',
    buttonHover: 'hover:bg-emerald-600',
  };

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};