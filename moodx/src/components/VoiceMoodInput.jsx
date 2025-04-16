import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const VoiceMoodInput = ({ onMoodDetected }) => {
  const { theme } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [detectedInfo, setDetectedInfo] = useState({});
  const [showRecognizedInfo, setShowRecognizedInfo] = useState(false);

  // Check if SpeechRecognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setErrorMsg('Speech recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg(null);
      setShowRecognizedInfo(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access denied. Please allow microphone access to use voice input.');
      } else if (event.error === 'no-speech') {
        setErrorMsg('No speech detected. Please try again.');
      } else {
        setErrorMsg(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (Object.keys(detectedInfo).length > 0) {
        setShowRecognizedInfo(true);
      }
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const currentTranscript = event.results[current][0].transcript;
      setTranscript(currentTranscript);
      
      // Process transcript to detect mood
      const moodKeywords = {
        'Great': ['amazing', 'excellent', 'fantastic', 'great', 'wonderful', 'incredible', 'superb', 'outstanding', 'awesome', 'terrific', 'exceptional'],
        'Good': ['good', 'well', 'fine', 'nice', 'pleasant', 'positive', 'satisfied', 'content', 'happy', 'cheerful', 'glad'],
        'Okay': ['okay', 'ok', 'alright', 'so so', 'decent', 'fair', 'average', 'moderate', 'neutral', 'neither good nor bad'],
        'Bad': ['bad', 'poor', 'unpleasant', 'negative', 'sad', 'unhappy', 'rough', 'tough', 'difficult', 'troubled', 'not good', 'not great'],
        'Terrible': ['terrible', 'awful', 'horrible', 'dreadful', 'miserable', 'depressed', 'devastated', 'worst', 'very bad', 'extremely bad']
      };
      
      // Detect mood from transcript
      const lowerTranscript = currentTranscript.toLowerCase();
      let detectedMood = null;
      
      Object.entries(moodKeywords).forEach(([mood, keywords]) => {
        if (!detectedMood && keywords.some(keyword => lowerTranscript.includes(keyword))) {
          detectedMood = mood;
        }
      });
      
      // Parse activity mentions
      const activities = [];
      const activityKeywords = {
        'Exercise': ['exercise', 'workout', 'gym', 'run', 'running', 'jog', 'fitness', 'training'],
        'Work': ['work', 'job', 'office', 'meeting', 'project', 'client', 'study', 'studying'],
        'Family': ['family', 'kids', 'children', 'parents', 'mom', 'dad', 'brother', 'sister'],
        'Friends': ['friends', 'friend', 'social', 'hangout', 'party', 'gathering'],
        'Hobby': ['hobby', 'reading', 'painting', 'music', 'gaming', 'cooking', 'gardening'],
        'Rest': ['rest', 'sleep', 'nap', 'relax', 'break', 'chill', 'calm', 'peace'],
        'Other': []
      };
      
      Object.entries(activityKeywords).forEach(([activity, keywords]) => {
        if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
          activities.push(activity);
        }
      });
      
      // Parse custom moods as well - extract any emotions described
      const emotionMatches = lowerTranscript.match(/(?:feeling|feel|am|i'm|im)\s+(\w+)/i);
      let customMood = '';
      
      if (emotionMatches && emotionMatches[1]) {
        customMood = emotionMatches[1].charAt(0).toUpperCase() + emotionMatches[1].slice(1);
      }
      
      // Extract note content - anything after "because" or similar transition words
      const noteRegex = /(?:because|since|as|due to|for|given that)\s+(.*)/i;
      const noteMatches = lowerTranscript.match(noteRegex);
      let note = '';
      
      if (noteMatches && noteMatches[1]) {
        note = noteMatches[1].charAt(0).toUpperCase() + noteMatches[1].slice(1);
      }
      
      // Extract tags - keywords prefixed with "tag" or "hashtag"
      const tagRegex = /(?:tag|hashtag)\s+(\w+)/gi;
      const tags = [];
      let tagMatch;
      while ((tagMatch = tagRegex.exec(lowerTranscript)) !== null) {
        tags.push(tagMatch[1]);
      }
      
      // Intensity detection
      let intensity = 5; // Default mid-value
      const intensityRegex = /(?:intensity|level|rating|score)\s+(?:of|is)\s+(\d+)/i;
      const intensityMatch = lowerTranscript.match(intensityRegex);
      if (intensityMatch && intensityMatch[1]) {
        const parsedIntensity = parseInt(intensityMatch[1], 10);
        if (!isNaN(parsedIntensity) && parsedIntensity >= 1 && parsedIntensity <= 10) {
          intensity = parsedIntensity;
        }
      } else if (lowerTranscript.includes('very') || lowerTranscript.includes('extremely')) {
        intensity = 8;
      } else if (lowerTranscript.includes('somewhat') || lowerTranscript.includes('kind of')) {
        intensity = 4;
      }
      
      // Compile detected info
      const detectedData = {
        mood: detectedMood,
        customMood: customMood,
        note: note,
        activities: activities,
        tags: tags,
        intensity: intensity
      };
      
      // Filter out undefined/empty values
      const filteredData = Object.fromEntries(
        Object.entries(detectedData).filter(([_, v]) => {
          if (Array.isArray(v)) return v.length > 0;
          return v !== null && v !== undefined && v !== '';
        })
      );
      
      setDetectedInfo(filteredData);
      
      if (Object.keys(filteredData).length > 0) {
        onMoodDetected(filteredData);
      }
    };

    setRecognitionInstance(recognition);
    
    return () => {
      if (isListening && recognition) {
        recognition.stop();
      }
    };
  }, [onMoodDetected]);

  const toggleListening = () => {
    if (!speechSupported) return;
    
    if (isListening) {
      recognitionInstance.stop();
    } else {
      setTranscript('');
      setDetectedInfo({});
      recognitionInstance.start();
    }
  };

  if (!speechSupported) {
    return (
      <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-3">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            Speech recognition is not supported in your browser. Please use a different browser or input your mood manually.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`flex items-center ${isListening ? `bg-${theme.primaryColor}-50 dark:bg-${theme.primaryColor}-900/10` : ''} rounded-lg p-2 transition-colors`}>
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-full transition-colors ${
            isListening
              ? `bg-${theme.primaryColor}-500 text-white animate-pulse`
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        
        <div className="ml-3 flex-grow">
          {isListening ? (
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Listening...</div>
              <div className="flex space-x-1 mt-1">
                <div className="w-1 h-3 bg-blue-500 rounded-full animate-wave" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-3 bg-blue-500 rounded-full animate-wave" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-3 bg-blue-500 rounded-full animate-wave" style={{ animationDelay: '300ms' }}></div>
                <div className="w-1 h-3 bg-blue-500 rounded-full animate-wave" style={{ animationDelay: '450ms' }}></div>
                <div className="w-1 h-3 bg-blue-500 rounded-full animate-wave" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {transcript ? 
                <div className="py-1">
                  <div className="font-medium text-gray-800 dark:text-gray-200">Last recording:</div>
                  <div className="italic">"{transcript}"</div>
                </div> : 
                "Click the microphone and tell us how you're feeling"
              }
            </div>
          )}
        </div>
      </div>
      
      {errorMsg && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}
      
      {showRecognizedInfo && Object.keys(detectedInfo).length > 0 && (
        <div className={`mt-3 p-3 bg-${theme.primaryColor}-50 dark:bg-${theme.primaryColor}-900/10 rounded-lg border border-${theme.primaryColor}-100 dark:border-${theme.primaryColor}-800/30`}>
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">I heard:</h4>
          <ul className="space-y-1 text-sm">
            {detectedInfo.mood && (
              <li className="flex items-center">
                <span className="font-medium mr-2">Mood:</span> 
                <span className={`px-2 py-0.5 rounded-full text-white bg-${
                  detectedInfo.mood === 'Great' ? 'green' : 
                  detectedInfo.mood === 'Good' ? 'blue' : 
                  detectedInfo.mood === 'Okay' ? 'yellow' : 
                  detectedInfo.mood === 'Bad' ? 'orange' : 'red'
                }-500`}>
                  {detectedInfo.mood}
                </span>
              </li>
            )}
            {detectedInfo.customMood && (
              <li><span className="font-medium">Specific feeling:</span> {detectedInfo.customMood}</li>
            )}
            {detectedInfo.note && (
              <li><span className="font-medium">Note:</span> {detectedInfo.note}</li>
            )}
            {detectedInfo.activities && detectedInfo.activities.length > 0 && (
              <li>
                <span className="font-medium">Activities:</span> 
                <div className="flex flex-wrap gap-1 mt-1">
                  {detectedInfo.activities.map(activity => (
                    <span key={activity} className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                      {activity}
                    </span>
                  ))}
                </div>
              </li>
            )}
            {detectedInfo.tags && detectedInfo.tags.length > 0 && (
              <li>
                <span className="font-medium">Tags:</span> 
                <div className="flex flex-wrap gap-1 mt-1">
                  {detectedInfo.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </li>
            )}
            {detectedInfo.intensity && (
              <li><span className="font-medium">Intensity:</span> {detectedInfo.intensity}/10</li>
            )}
          </ul>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            These details have been filled in the form. You can edit them if needed.
          </div>
        </div>
      )}
      
      {!isListening && !errorMsg && !showRecognizedInfo && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <p>Try phrases like:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>"I'm feeling good because I accomplished my goals today"</li>
            <li>"I feel anxious with an intensity of 7 because of my upcoming presentation"</li>
            <li>"I'm great after exercising and reading, tag productive"</li>
          </ul>
        </div>  
      )}
    </div>
  );
};

export default VoiceMoodInput;