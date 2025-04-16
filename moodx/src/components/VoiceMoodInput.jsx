import { useState, useEffect } from 'react';

const VoiceMoodInput = ({ onMoodDetected }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript.toLowerCase();
      setTranscript(text);
      
      // Process the transcript to detect mood
      processMoodFromText(text);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    // Clean up
    return () => {
      recognition.abort();
    };
  }, [onMoodDetected]);

  const processMoodFromText = (text) => {
    // Define mood keywords to detect
    const moodKeywords = {
      'Great': ['great', 'amazing', 'excellent', 'fantastic', 'wonderful', 'awesome'],
      'Good': ['good', 'fine', 'well', 'happy', 'positive', 'glad'],
      'Okay': ['okay', 'ok', 'alright', 'neutral', 'so-so', 'decent'],
      'Bad': ['bad', 'sad', 'unhappy', 'not good', 'negative', 'down'],
      'Terrible': ['terrible', 'awful', 'horrible', 'worst', 'miserable', 'depressed']
    };

    // Detect mood from text
    let detectedMood = null;
    let highestMatch = 0;

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
      if (matchCount > highestMatch) {
        highestMatch = matchCount;
        detectedMood = mood;
      }
    }

    // If mood detected, estimate intensity
    if (detectedMood && highestMatch > 0) {
      // Simple intensity estimation: check for intensity modifiers
      const intensityModifiers = {
        high: ['very', 'really', 'extremely', 'super', 'incredibly'],
        low: ['slightly', 'somewhat', 'a bit', 'a little', 'kind of']
      };

      let intensity = 5; // Default middle intensity

      // Adjust based on modifiers
      const hasHighModifier = intensityModifiers.high.some(mod => text.includes(mod));
      const hasLowModifier = intensityModifiers.low.some(mod => text.includes(mod));

      if (hasHighModifier) {
        intensity = detectedMood === 'Great' || detectedMood === 'Good' ? 9 : 8;
      } else if (hasLowModifier) {
        intensity = detectedMood === 'Bad' || detectedMood === 'Terrible' ? 3 : 2;
      } else {
        // Default intensities by mood
        switch (detectedMood) {
          case 'Great': intensity = 8; break;
          case 'Good': intensity = 6; break;
          case 'Okay': intensity = 5; break;
          case 'Bad': intensity = 4; break;
          case 'Terrible': intensity = 2; break;
        }
      }

      // Extract possible note
      const note = text;

      // Detect activities
      const activityKeywords = [
        'work', 'working', 'studying', 'exercising', 'exercise', 'running',
        'reading', 'family', 'friends', 'resting', 'relaxing', 'sleeping',
        'eating', 'cooking', 'shopping', 'traveling', 'playing'
      ];

      const activities = activityKeywords
        .filter(activity => text.includes(activity))
        .map(activity => activity.charAt(0).toUpperCase() + activity.slice(1));

      // Pass the detected mood data to parent component
      onMoodDetected({
        mood: detectedMood,
        intensity,
        note,
        activities: [...new Set(activities)] // Remove duplicates
      });
    }
  };

  const startListening = () => {
    if (!error) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.start();

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.toLowerCase();
        setTranscript(text);
        
        // Process the transcript to detect mood
        processMoodFromText(text);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <button
          type="button"
          onClick={startListening}
          disabled={isListening || !!error}
          className={`flex items-center px-4 py-2 rounded-lg ${
            isListening
              ? 'bg-red-500 text-white'
              : error
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isListening ? (
            <>
              <span className="mr-2">Listening...</span>
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Voice Input
            </>
          )}
        </button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      {transcript && !isListening && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">I heard: "{transcript}"</p>
        </div>
      )}
    </div>
  );
};

export default VoiceMoodInput;