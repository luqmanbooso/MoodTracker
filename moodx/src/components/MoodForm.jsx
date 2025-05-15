import React, { useState, useEffect } from 'react';
import CustomMoodInput from './CustomMoodInput';
import VoiceMoodInput from './VoiceMoodInput';
import { useTheme } from '../context/ThemeContext'; // Assuming you have a theme context
import { createMood } from '../services/api';
import { useProgress } from '../contexts/ProgressContext';
import '../styles/MoodForm.css';

const MoodForm = ({ addMood, isLoading, customMoodCategories = [], simplified = false, onSubmit, initialMood = '', initialIntensity = 3, initialNotes = '', moods = [], habits = [], goals = [] }) => {
  // Fix the hook usage - don't conditionally call hooks
  const progress = useProgress();
  // Safely access the awardPoints function
  const awardPoints = progress ? progress.awardPoints : null;

  // Create fixed dark theme styles
  const styles = {
    primaryColor: 'emerald',
    primaryText: 'text-emerald-500',
    primaryBg: 'bg-emerald-500',
    primaryHover: 'hover:bg-emerald-600',
    secondaryText: 'text-gray-300',
    headingText: 'text-white',
    labelText: 'text-gray-300',
    borderColor: 'border-gray-700',
  };

  const [moodData, setMoodData] = useState({
    mood: initialMood || 'Good',
    customMood: '',
    intensity: initialIntensity || 5,
    note: initialNotes || '',
    activities: [],
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [selectedMoodIcon, setSelectedMoodIcon] = useState('🙂');
  const [selectedMoodColor, setSelectedMoodColor] = useState('bg-blue-500');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [loading, setLoading] = useState(false);

  const moodOptions = ['Great', 'Good', 'Okay', 'Bad', 'Terrible'];
  const activityOptions = ['Exercise', 'Work', 'Family', 'Friends', 'Hobby', 'Rest', 'Other'];
  
  // Map mood to emoji and color
  const moodIcons = {
    'Great': '😁',
    'Good': '🙂',
    'Okay': '😐',
    'Bad': '😕',
    'Terrible': '😞'
  };
  
  const moodColors = {
    'Great': 'bg-green-500',
    'Good': 'bg-blue-500',
    'Okay': 'bg-yellow-500',
    'Bad': 'bg-orange-500',
    'Terrible': 'bg-red-500'
  };
  
  // Update emoji when mood changes
  useEffect(() => {
    setSelectedMoodIcon(moodIcons[moodData.mood] || '😐');
    setSelectedMoodColor(moodColors[moodData.mood] || 'bg-blue-500');
  }, [moodData.mood]);
  
  // Reset success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMoodData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setLastAction(name);
  };

  const handleActivityToggle = (activity) => {
    setMoodData(prev => {
      const activities = prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity];
      
      return { ...prev, activities };
    });
    
    setLastAction('activities');
  };
  
  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim() || moodData.tags.includes(tagInput.trim())) {
      return;
    }
    
    setMoodData(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));
    setTagInput('');
    setLastAction('tags');
  };
  
  const handleRemoveTag = (tag) => {
    setMoodData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      // Call the API function to create mood
      const response = await createMood(moodData);
      
      // If addMood function is provided, call it with the new mood data
      if (addMood) {
        addMood({
          ...moodData,
          date: new Date(),
          id: response?.id || Date.now().toString()
        });
      }
      
      // If onSubmit callback is provided, call it
      if (onSubmit) {
        onSubmit(moodData);
      }
      
      // Award points if the function is available
      if (awardPoints) {
        try {
          await awardPoints(10, 'mood_entry', 'Logged your daily mood');
        } catch (pointsError) {
          console.error('Error awarding points:', pointsError);
        }
      }
      
      // Reset form
      setMoodData({
        mood: 'Good',
        customMood: '',
        intensity: 5,
        note: '',
        activities: [],
        tags: []
      });
      
      return true;
    } catch (error) {
      console.error('Error submitting mood:', error);
      return false;
    }
  };

  const handleQuickMood = (mood) => {
    setMoodData(prev => ({ ...prev, mood }));
    
    if (simplified) {
      // Auto-submit after short delay when in simplified mode
      setTimeout(() => {
        addMood({ ...moodData, mood });
        setShowSuccess(true);
        setMoodData({
          mood: 'Good',
          customMood: '',
          intensity: 5,
          note: '',
          activities: [],
          tags: []
        });
      }, 200);
    }
  };

  // Activity icons mapping
  const activityIcons = {
    'Exercise': '🏃‍♂️',
    'Work': '💼',
    'Family': '👪',
    'Friends': '👯',
    'Hobby': '🎨',
    'Rest': '😴',
    'Other': '📌'
  };

  return (
    <div className="bg-gray-800 rounded-lg relative text-white">
      {/* Success animation - shows briefly after submitting */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center z-10 animate-fade-out">
          <div className="bg-gray-700 rounded-full p-6 shadow-lg animate-scale-in">
            <div className="text-5xl animate-bounce">✅</div>
          </div>
        </div>
      )}
      
      {simplified ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            {moodOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleQuickMood(option)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                  moodData.mood === option
                    ? `${moodColors[option]} text-white shadow-md transform scale-105`
                    : `bg-gray-700 hover:bg-gray-600 text-gray-200 hover:shadow`
                }`}
              >
                <span className="text-2xl mb-1">{moodIcons[option]}</span>
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-center">
            <VoiceMoodInput onMoodDetected={(mood) => {
              setMoodData({...moodData, ...mood});
              // Auto-submit after a brief delay
              setTimeout(() => {
                addMood({...moodData, ...mood});
                setShowSuccess(true);
                setMoodData({
                  mood: 'Good',
                  customMood: '',
                  intensity: 5,
                  note: '',
                  activities: [],
                  tags: []
                });
              }, 1000);
            }} 
            customMoodCategories={customMoodCategories}
            moods={moods}
            habits={habits}
            goals={goals}
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 transition-all duration-300">
          {/* Header section with visual mood indicator */}
          <div className="mb-6 flex items-center">
            <div className={`${selectedMoodColor} text-white text-4xl p-4 rounded-full mr-4 transform transition-all duration-500 ${lastAction === 'mood' ? 'scale-110' : ''}`}>
              {selectedMoodIcon}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${styles.headingText}`}>How are you feeling?</h2>
              <p className={styles.secondaryText}>Let's check in on your mood today</p>
            </div>
          </div>
          
          {/* Mood selection with improved visual feedback */}
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">Your mood</label>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleQuickMood(option)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                    moodData.mood === option
                      ? `${moodColors[option]} text-white shadow-md transform scale-105`
                      : `bg-gray-700 hover:bg-gray-600 text-gray-200 hover:shadow`
                  }`}
                >
                  <span className="text-2xl mb-1">{moodIcons[option]}</span>
                  <span className="text-sm">{option}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-3">
              <VoiceMoodInput 
                onMoodDetected={(mood) => setMoodData({...moodData, ...mood})} 
                customMoodCategories={customMoodCategories}
                moods={moods}
                habits={habits}
                goals={goals}
              />
            </div>
          </div>
          
          {/* Custom mood with instant-update dropdown */}
          {customMoodCategories && customMoodCategories.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">
                Any specific mood? <span className="text-gray-500 text-sm">(optional)</span>
              </label>
              <select
                name="customMood"
                value={moodData.customMood}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg bg-gray-700 border-gray-600 text-white focus:ring focus:ring-emerald-300 focus:border-emerald-500 transition-all ${
                  lastAction === 'customMood' ? `border-emerald-500 ring ring-emerald-200` : ''
                }`}
              >
                <option value="">Select a specific mood</option>
                {customMoodCategories.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Intensity slider with visual feedback */}
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">
              How intense is this feeling?
            </label>
            <div className="flex items-center mb-2">
              <span className="text-3xl mr-3">{moodData.intensity <= 3 ? '🌱' : moodData.intensity <= 6 ? '🌿' : '🌳'}</span>
              <div className="flex-grow">
                <input
                  type="range"
                  name="intensity"
                  min="1"
                  max="10"
                  value={moodData.intensity}
                  onChange={handleChange}
                  className={`w-full h-3 rounded-lg appearance-none cursor-pointer ${
                    moodData.intensity <= 3 ? 'accent-green-300' : 
                    moodData.intensity <= 6 ? 'accent-green-500' : 'accent-green-700'
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Barely noticeable (1)</span>
                  <span className="font-bold">{moodData.intensity}</span>
                  <span>Very intense (10)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Activities with icons and interactive buttons */}
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">What were you doing today?</label>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map(activity => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => handleActivityToggle(activity)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 flex items-center ${
                    moodData.activities.includes(activity)
                      ? `bg-emerald-500 text-white transform scale-105 shadow-md`
                      : `bg-gray-700 text-gray-200 hover:bg-gray-600`
                  }`}
                >
                  <span className="mr-1">{activityIcons[activity]}</span>
                  {activity}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tags with interactive input */}
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">Tags</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                placeholder="Add a tag and press Enter..."
                className="flex-1 p-3 border rounded-lg bg-gray-700 border-gray-600 text-white focus:ring focus:ring-emerald-300 focus:border-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Add
              </button>
            </div>
            
            {moodData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {moodData.tags.map(tag => (
                  <div key={tag} className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full group transition-colors">
                    <span className="text-sm">#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-400 group-hover:text-red-500 focus:outline-none transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Notes with friendly prompt */}
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">
              What's on your mind? <span className="text-gray-500 text-sm">(optional)</span>
            </label>
            <textarea
              name="note"
              value={moodData.note}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg bg-gray-700 border-gray-600 text-white focus:ring focus:ring-emerald-300 focus:border-emerald-500 transition-all ${
                lastAction === 'note' ? `border-emerald-500 ring ring-emerald-200` : ''
              }`}
              rows="4"
              placeholder="Feel free to jot down anything about your day..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Your notes help identify patterns in your moods over time.
            </p>
          </div>
          
          {/* Animated submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving your mood...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Save My Mood</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default MoodForm;