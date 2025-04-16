import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getAIResponse } from '../services/aiService';

const MoodAssistant = ({ 
  moods = [], 
  habits = [], 
  goals = [], 
  pointsSystem, 
  setView,
  expanded = false,
  fullPage = false
}) => {
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
  const [aiStatus, setAiStatus] = useState('active'); // Always set to 'active'
  const [aiSource, setAiSource] = useState('openrouter'); // Always use 'openrouter'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Get current mood status
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

  // Get habit status
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

  // Get goal status
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

  // Process user message and generate response
  const processMessage = async (userMessage) => {
    try {
      setIsTyping(true);
      setError(null);
      
      // Add user message to chat
      const userMsg = {
        id: messages.length + 1,
        type: 'user',
        text: userMessage,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMsg]);
      
      // Prepare context data for the AI
      const contextData = {
        moods: moods.slice(0, 5).map(mood => ({
          mood: mood.mood,
          date: mood.date,
          activities: mood.activities?.join(', ') || '',
          tags: mood.tags?.join(', ') || '',
          intensity: mood.intensity
        })),
        habits: habits.map(habit => ({
          name: habit.name,
          category: habit.category,
          completed: habit.completed,
          streak: habit.streak
        })),
        goals: goals.map(goal => ({
          title: goal.title,
          progress: goal.progress,
          completed: goal.completed
        }))
      };
      
      // Use the AI service to get a response
      const aiResponse = await getAIResponse(userMessage, contextData);
      
      // Update AI source for the status indicator
      if (aiResponse.source) {
        setAiSource(aiResponse.source);
      }
      
      if (aiResponse.error) {
        setError(aiResponse.details || 'Error connecting to OpenAI');
        
        // Add error message to chat showing the actual error
        const errorMsg = {
          id: messages.length + 2,
          type: 'assistant',
          text: aiResponse.response + (aiResponse.details ? `\n\nError details: ${aiResponse.details}` : ''),
          timestamp: new Date(),
          isError: true,
          source: 'error'
        };
        
        setMessages(prev => [...prev, errorMsg]);
        setAiStatus('offline');
      } else {
        // Add AI response to chat
        const assistantMsg = {
          id: messages.length + 2,
          type: 'assistant',
          text: aiResponse.response,
          timestamp: new Date(),
          action: aiResponse.action,
          source: aiResponse.source
        };
        
        setMessages(prev => [...prev, assistantMsg]);
        setAiStatus('active');
      }
      
    } catch (err) {
      console.error('Error processing message:', err);
      setError('Failed to get response: ' + err.message);
      
      // Add error message to chat
      const errorMsg = {
        id: messages.length + 2,
        type: 'assistant',
        text: "Error: " + err.message,
        timestamp: new Date(),
        isError: true,
        source: 'error'
      };
      
      setMessages(prev => [...prev, errorMsg]);
      setAiStatus('offline');
      
    } finally {
      setIsTyping(false);
    }
  };

  // Modify handleSubmit around line 225
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
      
      // Add AI message to chat - use exactly what comes from backend
      const aiMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        text: aiResponse.message, // This should be the raw Claude response
        action: aiResponse.action,
        timestamp: new Date(),
        isError: false
      };
      
      console.log('Constructed message object:', JSON.stringify(aiMsg));
      
      setMessages(prevMessages => [...prevMessages, aiMsg]);
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
    <div className={`
      ${fullPage ? 'h-full' : expanded ? 'fixed bottom-0 right-0 w-full md:w-96 h-[70vh] z-50' : 'h-[480px]'} 
      ${theme.cardBg} rounded-lg shadow-xl overflow-hidden transition-all duration-300 flex flex-col
    `}>
      {/* Header */}
      <div className={`bg-${theme.primaryColor}-700 text-white p-4 flex justify-between items-center`}>
        <div className="flex items-center">
          <div className="bg-white rounded-full p-1 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-${theme.primaryColor}-700`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Mindset Coach</h3>
            <p className="text-xs opacity-80">Straight talk, no excuses</p>
          </div>
        </div>
        
        {!fullPage && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-white p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            {expanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414-1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}
      </div>
      {aiSource === 'openrouter' && (
        <div className="px-3 py-1 bg-purple-50 text-purple-800 text-xs rounded flex items-center gap-1 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
          </svg>
          <span>Powered by OpenRouter AI</span>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? `bg-${theme.primaryColor}-100 text-gray-800` 
                  : message.isError 
                    ? 'bg-red-100 text-red-800'
                    : `bg-${theme.primaryColor}-600 text-white`
              }`}
            >
              <div className="text-sm">{message.text}</div>
              {message.action && (
                <button
                  onClick={() => handleActionClick(message.action)}
                  className={`mt-2 px-3 py-1 bg-${theme.primaryColor}-700 bg-opacity-30 hover:bg-opacity-50 text-white text-xs rounded-full transition`}
                >
                  Go to {message.action === 'stats' ? 'insights' : message.action}
                </button>
              )}
              <div className="text-xs mt-1 opacity-60">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`max-w-[85%] p-3 rounded-lg bg-${theme.primaryColor}-600 text-white`}>
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to your coach..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref={inputRef}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`p-2 bg-${theme.primaryColor}-600 text-white rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
      {error && (
        <div className="mx-4 my-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default MoodAssistant;