import React, { useState, useEffect, useRef } from 'react';

const FocusSession = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [sessionType, setSessionType] = useState('focus');
  const [ambientSound, setAmbientSound] = useState('none');
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const sessionTypes = {
    focus: { name: 'Focus Session', duration: 25 * 60, color: 'emerald' },
    shortBreak: { name: 'Short Break', duration: 5 * 60, color: 'blue' },
    longBreak: { name: 'Long Break', duration: 15 * 60, color: 'purple' }
  };

  const ambientSounds = [
    { id: 'none', name: 'None', icon: '🔇' },
    { id: 'rain', name: 'Rain', icon: '🌧️' },
    { id: 'forest', name: 'Forest', icon: '🌲' },
    { id: 'waves', name: 'Ocean Waves', icon: '🌊' },
    { id: 'white-noise', name: 'White Noise', icon: '🔊' },
    { id: 'cafe', name: 'Cafe Ambience', icon: '☕' }
  ];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    // Play notification sound or show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Session Complete!', {
        body: 'Great job! Take a moment to reflect on your progress.',
        icon: '/favicon.ico'
      });
    }
  };

  const startSession = () => {
    setIsActive(true);
    setTimeLeft(sessionTypes[sessionType].duration);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(sessionTypes[sessionType].duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const total = sessionTypes[sessionType].duration;
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">⏱️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Focus Session</h2>
            <p className="text-sm text-slate-400">Boost your productivity</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-white font-mono mb-2">
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-600"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - getProgressPercentage() / 100)}`}
              className={`text-${sessionTypes[sessionType].color}-500 transition-all duration-1000`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-slate-400">{sessionTypes[sessionType].name}</div>
              <div className="text-xs text-slate-500">{getProgressPercentage().toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        {!isActive ? (
          <button
            onClick={startSession}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Start Session
          </button>
        ) : (
          <>
            <button
              onClick={pauseSession}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Pause
            </button>
            <button
              onClick={resetSession}
              className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Reset
            </button>
          </>
        )}
      </div>

      {/* Session Type Selector */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Object.entries(sessionTypes).map(([key, session]) => (
          <button
            key={key}
            onClick={() => {
              setSessionType(key);
              setTimeLeft(session.duration);
            }}
            className={`
              p-3 rounded-xl transition-all duration-200 hover:scale-105
              ${sessionType === key 
                ? `bg-${session.color}-500 text-white shadow-lg` 
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }
            `}
          >
            <div className="text-sm font-medium">{session.name}</div>
            <div className="text-xs opacity-75">{Math.floor(session.duration / 60)}min</div>
          </button>
        ))}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-6 p-4 bg-slate-700 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-3">Session Settings</h3>
          
          {/* Ambient Sound Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ambient Sound
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ambientSounds.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => setAmbientSound(sound.id)}
                  className={`
                    p-2 rounded-lg transition-all duration-200 hover:scale-105
                    ${ambientSound === sound.id 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                    }
                  `}
                >
                  <div className="text-lg mb-1">{sound.icon}</div>
                  <div className="text-xs">{sound.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Session Notifications</span>
            <button
              onClick={() => {
                if ('Notification' in window) {
                  Notification.requestPermission();
                }
              }}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      )}

      {/* Focus Tips */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <p className="text-white font-medium">
              Focus Tip: Take deep breaths and eliminate distractions
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Use this time to work on your most important task
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusSession; 