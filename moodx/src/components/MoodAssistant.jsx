import React, { useState, useRef, useEffect } from 'react';
import aiService from '../services/aiService.js';

const MoodAssistant = ({ moods, habits, goals, setView, expanded = false, fullPage = false }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsIntervention, setNeedsIntervention] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [canExit, setCanExit] = useState(false);
  const [userWellnessScore, setUserWellnessScore] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Calculate wellness score and check for intervention
  useEffect(() => {
    if (moods && moods.length > 0) {
      const recentMoods = moods.slice(0, 7);
      const moodScores = { thriving: 5, good: 4, neutral: 3, struggling: 2, overwhelmed: 1 };
      const avgScore = recentMoods.reduce((sum, mood) => 
        sum + (moodScores[mood.mood] || 3), 0
      ) / recentMoods.length;

      setUserWellnessScore(avgScore);

      if (avgScore < 5 && messages.length === 0) {
        setNeedsIntervention(true);
        setCanExit(false);
        setInteractionCount(0);
        
        // Generate personalized intervention message based on actual data
        const generateInterventionMessage = async () => {
          try {
            const userContext = {
              moods: moods || [],
              habits: habits || [],
              goals: goals || [],
              wellnessScore: avgScore,
              recentActivity: moods ? moods.slice(0, 5) : []
            };

            const response = await aiService.generateWellnessResponse(
              "I'm having a difficult time and need support. Can you help me understand what's happening and create a plan?", 
              userContext
            );

            const interventionMsg = {
              id: Date.now(),
              type: 'assistant',
              content: response.response || `I can see you're going through a challenging time. Your wellness score is ${avgScore.toFixed(1)}/5, and I want to help you create a personalized support plan. 

Let's work together to understand what's happening and develop strategies that work for you. I'm here to listen and support you through this.

What would you like to talk about first?`,
              suggestions: response.suggestions || ['Tell me about my patterns', 'Help me with coping strategies', 'Create a wellness plan', 'I need immediate support']
            };
            setMessages([interventionMsg]);
          } catch (error) {
            console.error('Error generating intervention message:', error);
            const fallbackMsg = {
              id: Date.now(),
              type: 'assistant',
              content: `I can see you're going through a challenging time. Your wellness score is ${avgScore.toFixed(1)}/5, and I want to help you create a personalized support plan. 

Let's work together to understand what's happening and develop strategies that work for you. I'm here to listen and support you through this.

What would you like to talk about first?`,
              suggestions: ['Tell me about my patterns', 'Help me with coping strategies', 'Create a wellness plan', 'I need immediate support']
            };
            setMessages([fallbackMsg]);
          }
        };

        generateInterventionMessage();
      }
    }
  }, [moods]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: userMessage
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInteractionCount(prev => prev + 1);

    try {
      const userContext = {
        moods: moods || [],
        habits: habits || [],
        goals: goals || [],
        wellnessScore: userWellnessScore,
        interactionCount: interactionCount + 1,
        needsIntervention: needsIntervention,
        recentActivity: moods ? moods.slice(0, 5) : []
      };

      const response = await aiService.generateWellnessResponse(userMessage, userContext);
      
      if (response.needsIntervention) {
        setNeedsIntervention(true);
      }
      
      const assistantMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.response,
        suggestions: response.suggestions || []
      };
      
      setMessages(prev => [...prev, assistantMsg]);

      // Check if user can exit after 5 interactions
      if (interactionCount + 1 >= 5 && needsIntervention) {
        setCanExit(true);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        suggestions: ['Try again', 'Ask about stress management', 'Get mood insights']
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'stress':
        setInputMessage("I'm feeling stressed and overwhelmed. Can you help me with some immediate coping strategies?");
        break;
      case 'sleep':
        setInputMessage("I'm having trouble sleeping. What can I do to improve my sleep quality?");
        break;
      case 'motivation':
        setInputMessage("I'm struggling with motivation and feeling stuck. How can I get back on track?");
        break;
      case 'anxiety':
        setInputMessage("I'm experiencing anxiety and worry. Can you help me manage these feelings?");
        break;
      case 'depression':
        setInputMessage("I'm feeling down and hopeless. What can I do to improve my mood?");
        break;
      case 'insights':
        setView('insights');
        break;
      default:
        setInputMessage(action);
    }
  };

  const handleTopicClick = (topic) => {
    const topicMessages = {
      'stress': "I'm feeling stressed and overwhelmed. Can you help me with some immediate coping strategies?",
      'sleep': "I'm having trouble sleeping. What can I do to improve my sleep quality?",
      'motivation': "I'm struggling with motivation and feeling stuck. How can I get back on track?",
      'anxiety': "I'm experiencing anxiety and worry. Can you help me manage these feelings?",
      'depression': "I'm feeling down and hopeless. What can I do to improve my mood?",
      'relationships': "I'm having relationship issues. Can you help me navigate this?",
      'work': "I'm struggling with work-related stress. How can I manage this better?",
      'self-care': "I need help with self-care. What activities would be good for me right now?"
    };
    
    setInputMessage(topicMessages[topic] || topic);
  };

  const handleExit = () => {
    if (needsIntervention && !canExit) {
      const exitMsg = {
        id: Date.now(),
        type: 'assistant',
        content: `I understand you might want to step away, but I'm concerned about your wellness right now. We've only had ${interactionCount} interactions, and I'd really like to help you create a support plan. 

Could we continue for just a few more minutes? Your mental health is important, and I want to make sure you have the tools you need.`,
        suggestions: ['Continue talking', 'Tell me about my patterns', 'Help me with coping strategies']
      };
      setMessages(prev => [...prev, exitMsg]);
      return;
    }
    
    setView('dashboard');
  };

  // Full page layout
  if (fullPage) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Wellness Coach</h2>
                <p className="text-sm text-slate-400">
                  {needsIntervention ? 'Your wellness ally - here to help' : 'Your personal mental health companion'}
                </p>
              </div>
              {needsIntervention && (
                <div className="flex items-center space-x-2 bg-amber-500/20 border border-amber-500/30 rounded-lg px-3 py-1">
                  <span className="text-amber-400 text-sm">
                    ⚠️ Intervention Active ({interactionCount}/5)
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleExit}
              className={`p-2 rounded-xl transition-all duration-200 ${
                needsIntervention && !canExit 
                  ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              title={needsIntervention && !canExit ? `Complete ${5 - interactionCount} more interactions to exit` : 'Exit chat'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-400">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium text-white mb-2">Start a conversation</h3>
                    <p className="text-sm">Ask me anything about your wellness journey</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-2xl px-6 py-4 rounded-2xl shadow-lg ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                            : 'bg-slate-700/50 backdrop-blur-sm text-slate-100 border border-slate-600/50'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed text-base">{message.content}</p>
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-sm bg-slate-600/50 hover:bg-slate-500/50 rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700/50 backdrop-blur-sm text-slate-100 px-6 py-4 rounded-2xl border border-slate-600/50">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} className="pb-4" />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-6 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={needsIntervention ? "I'm here to help - what do you need?" : "Ask me anything about your wellness..."}
                    className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Only show when no messages */}
          {messages.length === 0 && (
            <div className="w-80 border-l border-slate-700/50 bg-slate-800/20 backdrop-blur-sm overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {/* Quick Actions */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { action: 'stress', label: 'Stress Relief', icon: '🧘‍♀️' },
                    { action: 'sleep', label: 'Sleep Quality', icon: '😴' },
                    { action: 'motivation', label: 'Motivation', icon: '🌟' },
                    { action: 'anxiety', label: 'Anxiety', icon: '🧠' },
                    { action: 'depression', label: 'Depression', icon: '💆‍♀️' },
                    { action: 'insights', label: 'Get Insights', icon: '📊' }
                  ].map((item) => (
                    <button
                      key={item.action}
                      onClick={() => handleQuickAction(item.action)}
                      className="w-full flex items-center p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-sm transition-all duration-200 hover:scale-105 border border-slate-600/30"
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wellness Topics */}
              <div className="p-6 border-t border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Wellness Topics</h3>
                <div className="space-y-3">
                  {['stress', 'sleep', 'motivation', 'anxiety', 'depression', 'relationships', 'work', 'self-care'].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicClick(topic)}
                      className="w-full p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-left transition-all duration-200 hover:scale-105 border border-slate-600/30"
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{topic === 'stress' ? '🧘‍♀️' : topic === 'sleep' ? '😴' : topic === 'motivation' ? '🌟' : topic === 'anxiety' ? '🧠' : topic === 'depression' ? '💆‍♀️' : topic === 'relationships' ? '👥' : topic === 'work' ? '💼' : '💆‍♀️'}</span>
                        <span className="text-sm font-medium text-white">{topic.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {topic === 'stress' ? 'Learn effective stress relief techniques' : topic === 'sleep' ? 'Improve your sleep and rest' : topic === 'motivation' ? 'Natural ways to lift your spirits' : topic === 'anxiety' ? 'Practice present-moment awareness' : topic === 'depression' ? 'Prioritize your wellbeing' : topic === 'relationships' ? 'Learn to navigate relationship challenges' : topic === 'work' ? 'Manage work-related stress' : 'Prioritize your wellbeing'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Compact layout
  const containerClass = expanded 
    ? "h-96 flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl" 
    : "h-64 flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Wellness Coach</h2>
              <p className="text-xs text-slate-400">
                {needsIntervention ? 'Wellness ally' : 'Mental health companion'}
              </p>
            </div>
            {needsIntervention && (
              <div className="bg-amber-500/20 border border-amber-500/30 rounded px-2 py-1">
                <span className="text-amber-400 text-xs">⚠️</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm">Start a conversation</p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-xl shadow-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                  : 'bg-slate-700/50 backdrop-blur-sm text-slate-100 border border-slate-600/50'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-1">
                  {message.suggestions.slice(0, 2).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left text-xs bg-slate-600/50 hover:bg-slate-500/50 rounded-lg px-3 py-1 transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/50 backdrop-blur-sm text-slate-100 px-4 py-3 rounded-xl border border-slate-600/50">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="pb-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={needsIntervention ? "I'm here to help..." : "Ask me anything..."}
            className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 backdrop-blur-sm text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MoodAssistant;