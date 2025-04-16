import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ activeView, setView }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'insights', label: 'Insights', icon: 'chart' },
    { id: 'log', label: 'Log Mood', icon: 'plus' },
    { id: 'chat', label: 'AI Coach', icon: 'chat' },
    { id: 'progress', label: 'Progress', icon: 'target' },
    { id: 'resources', label: 'Resources', icon: 'book' },
    { id: 'settings', label: 'Settings', icon: 'cog' }
  ];

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'home':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'chart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'chat':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'plus':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'target':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'book':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'cog':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${expanded ? 'w-64' : 'w-20'} h-screen bg-${theme.primaryColor}-800 text-white fixed left-0 top-0 transition-all duration-300 z-40`}>
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-${theme.primaryColor}-700">
        {expanded && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3">
              <span className={`text-${theme.primaryColor}-700 text-xl font-bold`}>X</span>
            </div>
            <h1 className="text-2xl font-bold">MoodX</h1>
          </div>
        )}
        
        {!expanded && (
          <div className="w-12 h-12 mx-auto rounded-lg bg-white flex items-center justify-center">
            <span className={`text-${theme.primaryColor}-700 text-xl font-bold`}>X</span>
          </div>
        )}
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className={`p-1 rounded-full hover:bg-${theme.primaryColor}-700`}
        >
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Nav Items */}
      <nav className="mt-8">
        <ul className="space-y-2 px-2">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id)}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  activeView === item.id 
                    ? `bg-white text-${theme.primaryColor}-700 shadow-lg`
                    : `text-white hover:bg-${theme.primaryColor}-700`
                }`}
              >
                <span className="inline-block">{getIcon(item.icon)}</span>
                {expanded && <span className="ml-3 font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Profile */}
      <div className="absolute bottom-0 w-full p-4 border-t border-${theme.primaryColor}-700">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full bg-${theme.primaryColor}-200 flex items-center justify-center text-${theme.primaryColor}-800 font-bold`}>
            U
          </div>
          {expanded && (
            <div className="ml-3">
              <div className="font-medium">User</div>
              <div className="text-xs opacity-70">Level 5</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;