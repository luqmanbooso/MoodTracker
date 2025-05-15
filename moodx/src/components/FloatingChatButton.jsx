import React, { useState } from 'react';
import { getAIResponse } from '../services/aiService';

const FloatingChatButton = ({ moods, habits, goals }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const handleOpenChat = () => {
    setIsOpen(true);
    // Add an initial greeting if chat history is empty
    if (chatHistory.length === 0) {
      setChatHistory([{
        role: 'assistant',
        content: "Hi there! I'm your Mindset Coach. How can I help you today?"
      }]);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setMinimized(false);
  };

  const handleMinimize = () => {
    setMinimized(!minimized);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory([...chatHistory, { role: 'user', content: message }]);
    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    try {
      // Prepare context with latest data
      const context = {
        moods: moods || [],
        habits: habits || [],
        goals: goals || []
      };

      // Send message to AI service
      const response = await getAIResponse(userMessage, context);

      // Add AI response to chat
      setChatHistory(prev => [...prev, { role: 'assistant', content: response.message, action: response.action }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble responding right now. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className={`fixed ${minimized ? 'bottom-6 right-6 w-72' : 'bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96'} bg-white rounded-lg shadow-xl z-50 transition-all duration-300 overflow-hidden max-h-[600px]`}>
          {/* Chat header */}
          <div className="bg-orange-500 text-white px-4 py-3 flex justify-between items-center">
            {!minimized && (
              <>
                <h3 className="font-medium">Mindset Coach</h3>
                <div className="flex space-x-2">
                  <button onClick={handleMinimize} className="hover:bg-orange-600 rounded p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button onClick={handleCloseChat} className="hover:bg-orange-600 rounded p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </>
            )}
            {minimized && (
              <>
                <h3 className="font-medium">Mindset Coach</h3>
                <div className="flex space-x-2">
                  <button onClick={handleMinimize} className="hover:bg-orange-600 rounded p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button onClick={handleCloseChat} className="hover:bg-orange-600 rounded p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {!minimized && (
            <>
              {/* Chat messages */}
              <div className="p-4 h-96 overflow-y-auto space-y-4 bg-gray-50">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                        chat.role === 'user' 
                          ? 'bg-orange-100 text-gray-800' 
                          : 'bg-white border border-gray-200 text-gray-700'
                      }`}
                    >
                      {chat.content}
                      
                      {/* If there's a suggested action */}
                      {chat.role === 'assistant' && chat.action && (
                        <div className="mt-2">
                          <button
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                            onClick={() => alert(`Would navigate to ${chat.action} section`)}
                          >
                            Go to {chat.action.charAt(0).toUpperCase() + chat.action.slice(1)} →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-500">
                      <div className="flex space-x-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat input */}
              <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 disabled:opacity-50"
                    disabled={!message.trim() || isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;
