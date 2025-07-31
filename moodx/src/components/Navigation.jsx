import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const Navigation = ({ activeView, setView, openSettingsModal }) => {
  const { darkMode } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Fixed dark theme styles
  const styles = {
    logo: 'text-emerald-400',
    logoHover: 'hover:text-emerald-300',
    navText: 'text-gray-300',
    navTextHover: 'hover:text-emerald-400',
    navActive: 'text-emerald-400 border-emerald-400',
    navInactive: 'text-gray-400',
    iconActive: 'text-emerald-400',
    iconInactive: 'text-gray-500',
    buttonBg: 'bg-emerald-500',
    buttonHover: 'hover:bg-emerald-600',
  };

  // Streamlined navigation items - focus on core features
  const navItems = [
    { id: 'dashboard', label: 'Wellness Hub', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'log', label: 'Check In', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'todos', label: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'insights', label: 'Insights', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'progress', label: 'Progress', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'chat', label: 'Wellness Coach', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' }
  ];
  
  // Mobile navigation - core features only
  const mobileNavItems = [
    navItems[0], // Wellness Hub
    navItems[1], // Check In
    navItems[2], // Tasks
    navItems[3], // Insights
    navItems[4], // Progress
    navItems[5]  // Wellness Coach
  ];

  return (
    <>
      {/* Mobile nav bar */}
      <nav className="fixed bottom-0 w-full md:hidden z-30 bg-gray-900 border-t border-gray-800 py-2">
        <div className="flex justify-around">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="flex flex-col items-center px-3 py-2"
            >
              <div className={`p-1 rounded-full ${item.id === activeView ? styles.iconActive : styles.iconInactive}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <span className={`text-xs mt-1 ${item.id === activeView ? styles.navActive : styles.navInactive}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
      
      {/* Desktop sidebar navigation */}
      <div className="hidden md:flex md:flex-col md:fixed md:h-screen md:w-64 bg-gray-900 border-r border-gray-800">
        {/* Logo */}
        <div className="p-5 border-b border-gray-800 flex justify-center">
          <Logo size="medium" showTagline={true} />
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 
                    ${item.id === activeView 
                      ? `${styles.buttonBg} text-white` 
                      : `${styles.navText} ${styles.navTextHover}`
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Settings button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={openSettingsModal}
            className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-emerald-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;