import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const UserGreeting = ({ moods = [], onLogMood }) => {
  const { theme } = useTheme();
  const [timeOfDay, setTimeOfDay] = useState('');
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('user-name') || '';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const saveName = () => {
    const trimmedName = nameInput.trim();
    setUserName(trimmedName);
    localStorage.setItem('user-name', trimmedName);
    setIsEditingName(false);
  };

  return (
    <div className={`mb-8 rounded-2xl bg-gradient-to-r from-${theme.primaryColor}-600 to-${theme.primaryColor}-800 text-white p-6 lg:p-8 shadow-xl relative overflow-hidden`}>
      <div className="absolute top-0 right-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      </div>
      
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold mb-2">
          Good {timeOfDay}
          {userName && !isEditingName && (
            <span>, {userName}</span>
          )}
          {!userName && !isEditingName && (
            <button 
              onClick={() => setIsEditingName(true)}
              className="ml-2 text-base opacity-80 hover:opacity-100 underline"
            >
              Add your name
            </button>
          )}
        </h1>
        
        {isEditingName && (
          <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              className="bg-transparent border-b border-white/40 text-white placeholder-white/60 px-2 py-1 focus:outline-none focus:border-white"
              autoFocus
            />
            <div className="flex gap-2 ml-2">
              <button
                onClick={saveName}
                className="p-1 hover:bg-white/20 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setNameInput(userName);
                }}
                className="p-1 hover:bg-white/20 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {!isEditingName && userName && (
          <button
            onClick={() => setIsEditingName(true)}
            className="text-sm bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 transition-colors"
          >
            Edit name
          </button>
        )}
      </div>
      
      {moods.length > 0 ? (
        <div className="mt-4">
          <p className="text-xl font-medium">How are you feeling right now?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => onLogMood('Great')}
              className="px-4 py-2 bg-green-500/80 hover:bg-green-500 rounded-full font-medium transition-colors flex items-center"
            >
              <span className="text-xl mr-2">😁</span> Great
            </button>
            <button
              onClick={() => onLogMood('Good')}
              className="px-4 py-2 bg-blue-500/80 hover:bg-blue-500 rounded-full font-medium transition-colors flex items-center"
            >
              <span className="text-xl mr-2">🙂</span> Good
            </button>
            <button
              onClick={() => onLogMood('Okay')}
              className="px-4 py-2 bg-yellow-500/80 hover:bg-yellow-500 rounded-full font-medium transition-colors flex items-center"
            >
              <span className="text-xl mr-2">😐</span> Okay
            </button>
            <button
              onClick={() => onLogMood('Bad')}
              className="px-4 py-2 bg-orange-500/80 hover:bg-orange-500 rounded-full font-medium transition-colors flex items-center"
            >
              <span className="text-xl mr-2">😕</span> Bad
            </button>
            <button
              onClick={() => onLogMood('Terrible')}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-full font-medium transition-colors flex items-center"
            >
              <span className="text-xl mr-2">😞</span> Terrible
            </button>
          </div>
          <button
            onClick={() => onLogMood()}
            className="mt-4 px-5 py-2 bg-white text-indigo-700 rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            Log Detailed Mood
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-xl font-medium">Welcome to MoodX</p>
          <p className="mt-2 text-white/90">Start tracking your mood to get personalized insights</p>
          <button
            onClick={() => onLogMood()}
            className="mt-4 px-5 py-2 bg-white text-indigo-700 rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            Log Your First Mood
          </button>
        </div>
      )}
    </div>
  );
};

export default UserGreeting;