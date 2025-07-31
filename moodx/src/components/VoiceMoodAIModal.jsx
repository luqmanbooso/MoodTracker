import React, { useState, useEffect } from 'react';
import { getAIResponse } from '../services/aiService';
import { useTheme } from '../context/ThemeContext';

const VoiceMoodAIModal = ({ transcript, detectedMood, detectedCustomMood, onClose, moods = [], habits = [], goals = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getResponse = async () => {
      try {
        setIsLoading(true);
        
        // Create message for AI based on the transcript
        const message = `I just said: "${transcript}". I'm feeling ${detectedMood || 'a certain way'}${detectedCustomMood ? ` - specifically ${detectedCustomMood}` : ''}. Can you give me some advice or perspective?`;
        
        // Get AI response
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
        
        const response = await getAIResponse(message, contextData);
        setAiResponse(response);
      } catch (err) {
        console.error('Error getting AI response:', err);
        setError('Failed to get a response. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    getResponse();
  }, [transcript, detectedMood, detectedCustomMood, moods, habits, goals]);
  
  // Get emoji for the detected mood
  const getMoodEmoji = () => {
    const moodEmojis = {
      'Great': '😁',
      'Good': '🙂',
      'Okay': '😐',
      'Bad': '😕',
      'Terrible': '😞',
      'Motivated': '💪',
      'Anxious': '😰',
      'Energetic': '⚡',
      'Creative': '🎨',
      'Bored': '😑',
      'Relaxed': '😌',
      'Stressed': '😫',
      'Grateful': '🙏',
      'Frustrated': '😤',
      'Excited': '🤩'
    };
    
    if (detectedCustomMood && moodEmojis[detectedCustomMood]) {
      return moodEmojis[detectedCustomMood];
    }
    
    return moodEmojis[detectedMood] || '🤔';
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="text-2xl mr-2">{getMoodEmoji()}</span>
            AI Wellness Coach
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="mb-4">
            <div className="text-gray-400 text-sm mb-1">I detected your mood as:</div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{getMoodEmoji()}</span>
              <span className="text-lg font-medium text-white">
                {detectedMood} {detectedCustomMood && `- ${detectedCustomMood}`}
              </span>
            </div>
          </div>
          
          <div className="h-px bg-gray-700 my-4"></div>
          
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="animate-pulse flex space-x-2">
                <div className="h-3 w-3 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="h-3 w-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-3 w-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-gray-400 mt-3">Getting your personalized response...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 text-red-300 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="prose prose-invert prose-emerald max-w-none">
              <p className="text-white text-lg leading-relaxed">{aiResponse?.message}</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-800 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceMoodAIModal;
