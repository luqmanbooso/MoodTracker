import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import VoiceMoodAIModal from './VoiceMoodAIModal';

const VoiceMoodInput = ({ onMoodDetected, customMoodCategories = [], moods = [], habits = [], goals = [] }) => {
  const { theme } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [detectedCustomMood, setDetectedCustomMood] = useState(null);
  const [detectedIntensity, setDetectedIntensity] = useState(null);
  const [detectedNote, setDetectedNote] = useState(null);

  // Standard mood keywords mapping
  const standardMoods = {
    'Great': ['amazing', 'fantastic', 'wonderful', 'excellent', 'terrific', 'great', 'awesome', 'ecstatic', 'delighted', 'joyful', 'thrilled'],
    'Good': ['good', 'happy', 'positive', 'pleased', 'glad', 'content', 'satisfied', 'nice', 'well', 'fine'],
    'Okay': ['okay', 'ok', 'alright', 'so-so', 'moderate', 'average', 'fine', 'neutral', 'fair', 'decent'],
    'Bad': ['bad', 'unhappy', 'negative', 'sad', 'upset', 'down', 'disappointed', 'displeased', 'unpleasant', 'low'],
    'Terrible': ['terrible', 'awful', 'horrible', 'miserable', 'depressed', 'devastated', 'dreadful', 'wretched', 'gloomy', 'distressed']
  };

  // Custom mood detection
  const detectCustomMood = (text) => {
    // Early return if no custom moods
    if (!customMoodCategories || customMoodCategories.length === 0) return null;
    
    // Convert input to lowercase for matching
    const lowercaseText = text.toLowerCase();
    
    // Direct matches - check if the custom mood is mentioned directly
    for (const customMood of customMoodCategories) {
      if (lowercaseText.includes(customMood.toLowerCase())) {
        return customMood;
      }
    }
    
    // More advanced matching could check for synonyms or partial matches
    // For example, "I'm feeling motivated today" should match "Motivated"
    const customMoodKeywords = {
      'Motivated': ['motivated', 'driven', 'determined', 'inspired', 'ambitious', 'energetic'],
      'Anxious': ['anxious', 'nervous', 'worried', 'uneasy', 'tense', 'apprehensive', 'concerned'],
      'Energetic': ['energetic', 'lively', 'vibrant', 'active', 'dynamic', 'vigorous', 'peppy'],
      'Creative': ['creative', 'imaginative', 'inspired', 'artistic', 'innovative', 'inventive'],
      'Bored': ['bored', 'tedious', 'monotonous', 'dull', 'uninterested', 'apathetic'],
      'Relaxed': ['relaxed', 'calm', 'peaceful', 'serene', 'tranquil', 'at ease', 'chill'],
      'Stressed': ['stressed', 'pressure', 'overwhelmed', 'tense', 'strained', 'frazzled'],
      'Grateful': ['grateful', 'thankful', 'appreciative', 'blessed', 'fortunate'],
      'Frustrated': ['frustrated', 'annoyed', 'irritated', 'exasperated', 'aggravated'],
      'Excited': ['excited', 'thrilled', 'eager', 'enthusiastic', 'animated', 'pumped']
    };
    
    // Add any custom moods not in our predefined list
    for (const mood of customMoodCategories) {
      if (!customMoodKeywords[mood]) {
        customMoodKeywords[mood] = [mood.toLowerCase()];
      }
    }
    
    // Check for keyword matches
    for (const [mood, keywords] of Object.entries(customMoodKeywords)) {
      // Only consider moods that are in our customMoodCategories
      if (customMoodCategories.includes(mood)) {
        for (const keyword of keywords) {
          if (lowercaseText.includes(keyword)) {
            return mood;
          }
        }
      }
    }
    
    // Check for sentiment patterns that might indicate specific custom moods
    if (lowercaseText.includes('can\'t focus') || lowercaseText.includes('distracted')) {
      return customMoodCategories.includes('Distracted') ? 'Distracted' : null;
    }
    
    if (lowercaseText.includes('proud') || lowercaseText.includes('accomplished')) {
      return customMoodCategories.includes('Proud') ? 'Proud' : null;
    }
    
    if (lowercaseText.includes('lonely') || lowercaseText.includes('alone') || lowercaseText.includes('isolated')) {
      return customMoodCategories.includes('Lonely') ? 'Lonely' : null;
    }
    
    return null;
  };
  
  // Standard mood detection
  const detectMood = (text) => {
    const lowercaseText = text.toLowerCase();
    
    // Check for standard mood keywords
    for (const [mood, keywords] of Object.entries(standardMoods)) {
      for (const keyword of keywords) {
        if (lowercaseText.includes(keyword)) {
          return mood;
        }
      }
    }
    
    // Look for common expressions/patterns
    if (lowercaseText.includes('not feeling') || lowercaseText.includes('feeling bad')) {
      return 'Bad';
    }
    
    if (lowercaseText.includes('just okay') || lowercaseText.includes('not bad')) {
      return 'Okay';
    }
    
    // Detect negativity - if venting or complaining, likely in a bad mood
    const negativeWords = ['hate', 'sucks', 'terrible', 'worst', 'annoyed', 'annoying', 'frustrated', 'fucked', 'shit', 'hell', 'damn'];
    
    for (const word of negativeWords) {
      if (lowercaseText.includes(word)) {
        return 'Bad';
      }
    }
    
    // Detect swearing or strong negative language - might indicate terrible mood
    const strongNegatives = ['fucking', 'fuck', 'bullshit', 'hate', 'kill', 'furious', 'pissed'];
    
    for (const word of strongNegatives) {
      if (lowercaseText.includes(word)) {
        return 'Terrible';
      }
    }
    
    // Default to Okay if no mood detected
    return 'Okay';
  };
  
  // Detect intensity from speech (1-10)
  const detectIntensity = (text) => {
    const lowercaseText = text.toLowerCase();
    
    // Check for explicit intensity mentions
    const intensityMatch = lowercaseText.match(/intensity (?:of|is) (\d+)/i) || 
                          lowercaseText.match(/(\d+) out of 10/i) ||
                          lowercaseText.match(/(\d+) out of ten/i) ||
                          lowercaseText.match(/level (\d+)/i) ||
                          lowercaseText.match(/rating (?:of|is) (\d+)/i);
    
    if (intensityMatch && intensityMatch[1]) {
      const intensity = parseInt(intensityMatch[1], 10);
      if (intensity >= 1 && intensity <= 10) {
        return intensity;
      }
    }
    
    // Check for intensity keywords
    const intensityKeywords = {
      'extremely': 9,
      'very': 8,
      'really': 7,
      'quite': 6,
      'somewhat': 5,
      'moderately': 5,
      'slightly': 3,
      'a little': 2,
      'barely': 1,
      'highly': 8,
      'intensely': 9,
      'immensely': 9,
      'incredibly': 10
    };
    
    for (const [keyword, value] of Object.entries(intensityKeywords)) {
      if (lowercaseText.includes(keyword)) {
        return value;
      }
    }
    
    // Default intensity based on detected mood
    if (lowercaseText.includes('great') || lowercaseText.includes('amazing')) return 9;
    if (lowercaseText.includes('good')) return 7;
    if (lowercaseText.includes('okay') || lowercaseText.includes('ok')) return 5;
    if (lowercaseText.includes('bad')) return 3;
    if (lowercaseText.includes('terrible') || lowercaseText.includes('awful')) return 1;
    
    return 5; // Default intensity
  };
  
  // Extract note content
  const extractNote = (text) => {
    // Remove mood statements
    let noteContent = text.replace(/I(?:'m| am) feeling [a-z]+/gi, '')
                        .replace(/I feel [a-z]+/gi, '')
                        .replace(/feeling [a-z]+/gi, '')
                        .trim();
                        
    // If the note is too short after removing mood statements, use the original text
    if (noteContent.length < 10) {
      noteContent = text;
    }
    
    return noteContent;
  };

  const startListening = () => {
    setError(null);
    setIsListening(true);
    setTranscript('');
    
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Your browser doesn't support speech recognition. Try Chrome.");
      setIsListening(false);
      return;
    }
    
    // Create speech recognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setTranscript(transcript);
    };
    
    recognition.onerror = (event) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      
      // Process the final transcript
      if (transcript) {
        processTranscript(transcript);
      }
    };
    
    recognition.start();
    
    // Stop listening after 10 seconds if no result
    setTimeout(() => {
      if (isListening) {
        recognition.stop();
      }
    }, 10000);
  };
  
  const processTranscript = (text) => {
    // Detect mood and intensity
    const mood = detectMood(text);
    const customMood = detectCustomMood(text);
    const intensity = detectIntensity(text);
    const note = extractNote(text);
    
    // Set detected values to state
    setDetectedMood(mood);
    setDetectedCustomMood(customMood);
    setDetectedIntensity(intensity);
    setDetectedNote(note);
    
    // Prepare result
    const result = {
      mood,
      intensity,
      note
    };
    
    if (customMood) {
      result.customMood = customMood;
    }
    
    // Send to parent component
    onMoodDetected(result);
    
    // Show AI modal
    setShowAIModal(true);
  };
  
  const handleCloseModal = () => {
    setShowAIModal(false);
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={startListening}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={isListening}
          className={`flex items-center justify-center p-2 rounded-full ${
            isListening 
              ? 'bg-red-500 animate-pulse' 
              : 'bg-emerald-500 hover:bg-emerald-600'
          } text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50`}
          aria-label={isListening ? "Listening..." : "Talk about how you feel"}
        >
          {isListening ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          )}
        </button>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg">
            {isListening ? 'Listening...' : 'Talk about how you feel'}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        )}
        
        {/* Status display */}
        {isListening && (
          <div className="absolute left-full ml-2 whitespace-nowrap text-sm">
            Listening... <span className="italic text-gray-400">{transcript}</span>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="absolute top-full left-0 mt-1 text-xs text-red-500">
            {error}
          </div>
        )}
      </div>
      
      {/* AI Modal */}
      {showAIModal && (
        <VoiceMoodAIModal 
          transcript={transcript}
          detectedMood={detectedMood}
          detectedCustomMood={detectedCustomMood}
          onClose={handleCloseModal}
          moods={moods}
          habits={habits}
          goals={goals}
        />
      )}
    </>
  );
};

export default VoiceMoodInput;