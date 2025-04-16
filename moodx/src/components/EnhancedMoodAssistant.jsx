import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getAIResponse } from '../services/aiService';

const EnhancedMoodAssistant = ({ moods = [], habits = [], goals = [], pointsSystem, setView }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'assistant', 
      text: "I'm your Mindset Coach. No bullshit, just straight talk to help you improve. How are you really doing today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [aiStatus, setAiStatus] = useState('active');
  const [aiSource, setAiSource] = useState('openrouter');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Get current mood status - preserved from original component
  const getCurrentMoodState = () => {
    if (moods.length === 0) return null;
    
    const recentMoods = moods.slice(0, 5);
    const moodCounts = {
      'Great': 0,
      'Good': 0,
      'Okay': 0,
      'Bad': 0,
      'Terrible': 0
    };
    
    recentMoods.forEach(mood => {
      if (moodCounts[mood.mood] !== undefined) {
        moodCounts[mood.mood]++;
      }
    });
    
    // Get most frequent mood
    let mostFrequentMood = 'Okay';
    let highestCount = 0;
    
    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > highestCount) {
        highestCount = count;
        mostFrequentMood = mood;
      }
    }
    
    // Get trending direction
    const isImproving = 
      (moods[0]?.mood === 'Great' || moods[0]?.mood === 'Good') && 
      (moods[1]?.mood === 'Okay' || moods[1]?.mood === 'Bad' || moods[1]?.mood === 'Terrible');
    
    const isWorsening = 
      (moods[0]?.mood === 'Bad' || moods[0]?.mood === 'Terrible') && 
      (moods[1]?.mood === 'Okay' || moods[1]?.mood === 'Good' || moods[1]?.mood === 'Great');
      
    return {
      currentMood: moods[0]?.mood || 'Unknown',
      dominantMood: mostFrequentMood,
      isImproving,
      isWorsening,
      hasMoods: true
    };
  };

  // Get habit status - preserved from original component
  const getHabitStatus = () => {
    if (!habits || habits.length === 0) {
      return { hasHabits: false };
    }
    
    const completedToday = habits.filter(h => h.completed).length;
    const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;
    const incompleteHabits = habits.filter(h => !h.completed).map(h => h.name);
    
    return {
      hasHabits: true,
      totalHabits: habits.length,
      completedToday,
      completionRate,
      incompleteHabits
    };
  };

  // Get goal status - preserved from original component
  const getGoalStatus = () => {
    if (!goals || goals.length === 0) {
      return { hasGoals: false };
    }
    
    const nearestGoal = goals.find(g => !g.completed);
    const goalProgress = goals.length > 0 ? 
      goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / goals.length : 0;
    
    return {
      hasGoals: true,
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.completed).length,
      goalProgress,
      nearestGoal
    };
  };

  // handleSubmit function - maintained from your original component with improved UI integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isTyping) return;
    
    const userMessage = input;
    setInput('');
    setIsTyping(true);
    setError(null);
    
    // Add user message to chat
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMsg]);
    
    try {
      // Get AI response with context
      const aiResponse = await getAIResponse(userMessage, {
        moods: moods.slice(0, 5), // Send recent moods
        habits: habits, 
        goals: goals
      });
      
      console.log('Raw AI Response received:', JSON.stringify(aiResponse));
      
      // Add AI message to chat
      const aiMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        text: aiResponse.message, // Use exactly what comes from backend
        action: aiResponse.action,
        timestamp: new Date(),
        isError: false
      };
      
      setMessages(prevMessages => [...prevMessages, aiMsg]);
      
      // Update AI status based on response
      setAiSource('openrouter');
      setAiStatus('active');
      
      // Award points for engaging with the AI coach
      if (pointsSystem) {
        pointsSystem.awardPoints('CHAT_WITH_COACH');
      }
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError('Connection error. Please try again in a moment.');
      
      // Add error message
      const errorMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMsg]);
    } finally {
      setIsTyping(false);
      // Focus input field again
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Action handling from original component
  const handleActionClick = (action) => {
    if (action && setView) {
      if (action === 'habits' || action === 'goals') {
        setView('progress');
      } else {
        setView(action);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className={`bg-gradient-to-r from-${theme.primaryColor}-600 to-${theme.primaryColor}-800 text-white p-6 flex justify-between items-center`}>
        <div className="flex items-center">
          <div className="bg-white rounded-full p-2 mr-3 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-${theme.primaryColor}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-2xl">Mindset Coach</h2>
            <p className="text-sm opacity-90">Straight talk, no excuses</p>
          </div>
        </div>
        
        {/* Mood data summary */}
        <div className="bg-white bg-opacity-20 px-3 py-1 rounded-lg text-xs">
          {moods.length > 0 ? (
            <span>Recent mood: {moods[0].mood}</span>
          ) : (
            <span>No mood data yet</span>
          )}
        </div>
      </div>
      
      {aiSource === 'openrouter' && (
        <div className="px-4 py-2 bg-purple-50 text-purple-800 text-sm rounded flex items-center gap-2 m-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
          </svg>
          <span>Powered by OpenRouter AI</span>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className={`w-10 h-10 rounded-full bg-${theme.primaryColor}-600 flex items-center justify-center mr-3 shadow-md`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            )}
            
            <div 
              className={`max-w-[70%] p-4 rounded-2xl shadow-md ${
                message.type === 'user' 
                  ? `bg-${theme.primaryColor}-100 text-gray-800 rounded-tr-none` 
                  : message.isError 
                    ? 'bg-red-100 text-red-800 rounded-tl-none'
                    : `bg-white text-gray-800 border border-gray-200 rounded-tl-none`
              }`}
            >
              <div className="text-md leading-relaxed whitespace-pre-line">{message.text}</div>
              {message.action && (
                <button
                  onClick={() => handleActionClick(message.action)}
                  className={`mt-3 px-4 py-2 bg-${theme.primaryColor}-600 text-white text-sm rounded-full shadow-md hover:bg-${theme.primaryColor}-700 transition`}
                >
                  Go to {message.action === 'stats' ? 'insights' : message.action}
                </button>
              )}
              <div className="text-xs mt-2 opacity-60">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            {message.type === 'user' && (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-3 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className={`w-10 h-10 rounded-full bg-${theme.primaryColor}-600 flex items-center justify-center mr-3 shadow-md`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="max-w-[70%] p-4 rounded-2xl rounded-tl-none bg-white text-gray-800 shadow-md border border-gray-200">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-${theme.primaryColor}-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-3 w-3 rounded-full bg-${theme.primaryColor}-600 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="h-3 w-3 rounded-full bg-${theme.primaryColor}-600 animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="px-6 pb-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message your coach..."
            className="w-full p-4 pr-16 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-md"
            ref={inputRef}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`absolute right-2 top-2 p-2 bg-${theme.primaryColor}-600 text-white rounded-full disabled:opacity-50 disabled:bg-gray-400 hover:bg-${theme.primaryColor}-700 transition`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        
        {/* Context indicators */}
        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${habits.length > 0 ? 'bg-green-500' : 'bg-gray-300'} mr-1`}></div>
            <span>{habits.length} habits</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${goals.length > 0 ? 'bg-blue-500' : 'bg-gray-300'} mr-1`}></div>
            <span>{goals.length} goals</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${moods.length > 0 ? 'bg-purple-500' : 'bg-gray-300'} mr-1`}></div>
            <span>{moods.length} mood entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMoodAssistant;