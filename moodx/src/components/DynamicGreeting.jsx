import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const DynamicGreeting = ({ user, currentMood, onMoodSelect }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [timeDisplay, setTimeDisplay] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      setTimeDisplay(format(now, 'HH:mm'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    let timeGreeting = '';
    
    if (hour < 6) timeGreeting = 'Good Night';
    else if (hour < 12) timeGreeting = 'Good Morning';
    else if (hour < 17) timeGreeting = 'Good Afternoon';
    else if (hour < 21) timeGreeting = 'Good Evening';
    else timeGreeting = 'Good Night';

    // Personalized greeting based on mood and time
    let personalizedGreeting = '';
    if (currentMood) {
      const moodGreetings = {
        thriving: [
          "You're absolutely thriving today!",
          "Your energy is contagious!",
          "You're on fire today!",
          "Nothing can stop you now!"
        ],
        good: [
          "You're doing great today!",
          "Keep up the positive energy!",
          "You're in a great place!",
          "Your good vibes are showing!"
        ],
        neutral: [
          "You're finding your balance today",
          "Taking it one step at a time",
          "You're steady and grounded",
          "Finding peace in the moment"
        ],
        struggling: [
          "It's okay to have tough days",
          "You're stronger than you know",
          "This too shall pass",
          "You're doing your best"
        ],
        overwhelmed: [
          "Take a deep breath",
          "You're not alone in this",
          "It's okay to take it slow",
          "You'll get through this"
        ]
      };
      
      const greetings = moodGreetings[currentMood] || moodGreetings.neutral;
      personalizedGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    }

    setGreeting({
      time: timeGreeting,
      personalized: personalizedGreeting
    });
  }, [currentTime, currentMood]);

  const getMoodEmoji = (mood) => {
    const emojis = {
      thriving: '🌟',
      good: '😊',
      neutral: '😐',
      struggling: '😔',
      overwhelmed: '😰'
    };
    return emojis[mood] || '😊';
  };

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl p-6 mb-6">
      {/* Header with time */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">👋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {greeting.time}, {user?.name || 'Friend'}!
            </h1>
            {greeting.personalized && (
              <p className="text-emerald-400 font-medium">
                {greeting.personalized}
              </p>
            )}
          </div>
        </div>
        
        {/* Live Clock */}
        <div className="text-right">
          <div className="text-3xl font-bold text-white font-mono">
            {timeDisplay}
          </div>
          <div className="text-sm text-slate-400">
            {format(currentTime, 'EEEE, MMMM d')}
          </div>
        </div>
      </div>

      {/* Quick Mood Check */}
      <div className="bg-slate-700 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">How are you feeling right now?</h3>
        
        <div className="grid grid-cols-5 gap-3">
          {[
            { mood: 'thriving', label: 'Thriving', color: 'bg-emerald-500' },
            { mood: 'good', label: 'Good', color: 'bg-green-500' },
            { mood: 'neutral', label: 'Okay', color: 'bg-yellow-500' },
            { mood: 'struggling', label: 'Struggling', color: 'bg-orange-500' },
            { mood: 'overwhelmed', label: 'Overwhelmed', color: 'bg-red-500' }
          ].map(({ mood, label, color }) => (
            <button
              key={mood}
              onClick={() => onMoodSelect(mood)}
              className={`
                p-3 rounded-xl transition-all duration-200 hover:scale-105
                ${currentMood === mood 
                  ? `${color} text-white shadow-lg` 
                  : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                }
              `}
            >
              <div className="text-2xl mb-1">{getMoodEmoji(mood)}</div>
              <div className="text-xs font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-500/20">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💭</div>
          <div>
            <p className="text-white font-medium italic">
              "Every day is a new beginning. Take a deep breath and start again."
            </p>
            <p className="text-sm text-slate-400 mt-1">- Daily Inspiration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicGreeting; 