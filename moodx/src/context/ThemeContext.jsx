import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const themes = {
  light: {
    backgroundColor: 'bg-gray-100',
    textColor: 'text-gray-900',
    cardBg: 'bg-white',
    primaryColor: 'blue',
    accentColor: 'indigo'
  },
  dark: {
    backgroundColor: 'bg-gray-900',
    textColor: 'text-gray-100',
    cardBg: 'bg-gray-800',
    primaryColor: 'blue',
    accentColor: 'indigo'
  },
  calm: {
    backgroundColor: 'bg-blue-50',
    textColor: 'text-gray-900',
    cardBg: 'bg-white',
    primaryColor: 'teal',
    accentColor: 'cyan'
  },
  energetic: {
    backgroundColor: 'bg-orange-50',
    textColor: 'text-gray-900',
    cardBg: 'bg-white',
    primaryColor: 'orange',
    accentColor: 'amber'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('moodx-theme');
    return savedTheme || 'light';
  });
  
  const theme = themes[currentTheme] || themes.light;
  
  useEffect(() => {
    localStorage.setItem('moodx-theme', currentTheme);
    
    // Apply theme to document root for global styles
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);
  
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};