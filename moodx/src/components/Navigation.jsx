import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Navigation = ({ activeView, setView, openSettingsModal }) => {
  const { darkMode } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Primary color based on theme
  const primaryColor = darkMode ? 'emerald' : 'orange';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'insights', label: 'Insights', icon: 'chart-pie' },
    { id: 'log', label: 'Log Mood', icon: 'plus-circle' },
    { id: 'progress', label: 'Progress', icon: 'check-circle' },
    { id: 'chat', label: 'Mindset Coach', icon: 'chat-alt-2' },
    { id: 'resources', label: 'Resources', icon: 'book-open' }
  ];

  // Map of Heroicon paths
  const iconPaths = {
    'home': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    'chart-pie': 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z',
    'plus-circle': 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
    'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'chat-alt-2': 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
    'book-open': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    'cog': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  };

  return (
    <>
      {/* Desktop Navigation - Side Bar */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-30">
        {/* App Logo */}
        <div className={`p-6 border-b border-gray-200 dark:border-gray-800`}>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${primaryColor}-500 to-${primaryColor}-700 flex items-center justify-center text-white font-bold text-xl`}>
              M<span className="text-yellow-300">X</span>
            </div>
            <h1 className={`ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-400`}>
              MoodX
            </h1>
          </div>
        </div>
        
        {/* Nav Items */}
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                activeView === item.id 
                  ? `text-${primaryColor}-600 dark:text-${primaryColor}-400 bg-${primaryColor}-50 dark:bg-gray-800 border-r-4 border-${primaryColor}-500` 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[item.icon]} />
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
          
          {/* Settings button - now opens modal instead */}
          <button
            onClick={openSettingsModal}
            className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths['cog']} />
            </svg>
            <span>Settings</span>
          </button>
        </nav>
      </div>
      
      {/* Mobile Navigation - Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${primaryColor}-500 to-${primaryColor}-700 flex items-center justify-center text-white font-bold text-sm`}>
              M<span className="text-yellow-300">X</span>
            </div>
            <h1 className={`ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-400`}>
              MoodX
            </h1>
          </div>
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Nav Dropdown */}
        {isMobileNavOpen && (
          <nav className="bg-white dark:bg-gray-900 shadow-lg pb-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 ${
                  activeView === item.id 
                    ? `text-${primaryColor}-600 dark:text-${primaryColor}-400 bg-${primaryColor}-50 dark:bg-gray-800 border-l-4 border-${primaryColor}-500` 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[item.icon]} />
                </svg>
                <span>{item.label}</span>
              </button>
            ))}
            
            {/* Settings button for mobile */}
            <button
              onClick={() => {
                openSettingsModal();
                setIsMobileNavOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths['cog']} />
              </svg>
              <span>Settings</span>
            </button>
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;