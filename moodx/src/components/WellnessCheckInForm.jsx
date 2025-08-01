import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const WellnessCheckInForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  editingEntry = null,
  user 
}) => {
  const [mood, setMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([]);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [socialConnections, setSocialConnections] = useState(5);
  const [selfCareActivities, setSelfCareActivities] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [gratitude, setGratitude] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState('');
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');

  // Wellness mood options
  const wellnessMoods = [
    { value: 'Great', label: 'Great', emoji: '🌟', description: 'Feeling energized, confident, and at peace' },
    { value: 'Good', label: 'Good', emoji: '😊', description: 'Generally positive and content' },
    { value: 'Okay', label: 'Okay', emoji: '😐', description: 'Neither particularly good nor bad' },
    { value: 'Bad', label: 'Bad', emoji: '😔', description: 'Having some difficulties but managing' },
    { value: 'Terrible', label: 'Terrible', emoji: '😰', description: 'Feeling stressed, anxious, or overwhelmed' }
  ];

  // Activity options
  const activityOptions = [
    { value: 'Work', label: 'Work', emoji: '💼' },
    { value: 'Exercise', label: 'Exercise', emoji: '🏃‍♂️' },
    { value: 'Meditation', label: 'Meditation', emoji: '🧘‍♀️' },
    { value: 'Reading', label: 'Reading', emoji: '📚' },
    { value: 'Social', label: 'Social', emoji: '👥' },
    { value: 'Creative', label: 'Creative', emoji: '🎨' },
    { value: 'Rest', label: 'Rest', emoji: '😴' },
    { value: 'Cooking', label: 'Cooking', emoji: '👨‍🍳' },
    { value: 'Music', label: 'Music', emoji: '🎵' },
    { value: 'Nature', label: 'Nature', emoji: '🌳' },
    { value: 'Learning', label: 'Learning', emoji: '🎓' },
    { value: 'Self-Care', label: 'Self-Care', emoji: '💆‍♀️' }
  ];

  // Self-care activity options
  const selfCareOptions = [
    { value: 'Bath/Shower', label: 'Bath/Shower', emoji: '🛁' },
    { value: 'Skincare', label: 'Skincare', emoji: '🧴' },
    { value: 'Massage', label: 'Massage', emoji: '💆‍♀️' },
    { value: 'Journaling', label: 'Journaling', emoji: '📝' },
    { value: 'Deep Breathing', label: 'Deep Breathing', emoji: '🫁' },
    { value: 'Stretching', label: 'Stretching', emoji: '🧘‍♂️' },
    { value: 'Tea/Coffee', label: 'Tea/Coffee', emoji: '☕' },
    { value: 'Comfort Food', label: 'Comfort Food', emoji: '🍜' },
    { value: 'Comfortable Clothes', label: 'Comfortable Clothes', emoji: '👕' },
    { value: 'Comfortable Space', label: 'Comfortable Space', emoji: '🏠' }
  ];

  // Challenge options
  const challengeOptions = [
    { value: 'Work Stress', label: 'Work Stress', emoji: '💼' },
    { value: 'Social Anxiety', label: 'Social Anxiety', emoji: '😰' },
    { value: 'Lack of Sleep', label: 'Lack of Sleep', emoji: '😴' },
    { value: 'Financial Worry', label: 'Financial Worry', emoji: '💰' },
    { value: 'Health Concern', label: 'Health Concern', emoji: '🏥' },
    { value: 'Relationship Issue', label: 'Relationship Issue', emoji: '💔' },
    { value: 'Uncertainty', label: 'Uncertainty', emoji: '❓' },
    { value: 'Overwhelm', label: 'Overwhelm', emoji: '😵' },
    { value: 'Loneliness', label: 'Loneliness', emoji: '😔' },
    { value: 'Perfectionism', label: 'Perfectionism', emoji: '🎯' }
  ];

  // Weather options
  const weatherOptions = [
    { value: 'Sunny', label: 'Sunny', emoji: '☀️' },
    { value: 'Cloudy', label: 'Cloudy', emoji: '☁️' },
    { value: 'Rainy', label: 'Rainy', emoji: '🌧️' },
    { value: 'Snowy', label: 'Snowy', emoji: '❄️' },
    { value: 'Windy', label: 'Windy', emoji: '💨' },
    { value: 'Stormy', label: 'Stormy', emoji: '⛈️' },
    { value: 'Foggy', label: 'Foggy', emoji: '🌫️' },
    { value: 'Clear', label: 'Clear', emoji: '🌙' }
  ];

  // Initialize form with editing entry data
  useEffect(() => {
    if (editingEntry) {
      setMood(editingEntry.mood || '');
      setIntensity(editingEntry.intensity || 5);
      setActivities(editingEntry.activities || []);
      setNotes(editingEntry.notes || '');
      setTags(editingEntry.tags || []);
      setEnergyLevel(editingEntry.energyLevel || 5);
      setStressLevel(editingEntry.stressLevel || 5);
      setSleepQuality(editingEntry.sleepQuality || 5);
      setSocialConnections(editingEntry.socialConnections || 5);
      setSelfCareActivities(editingEntry.selfCareActivities || []);
      setChallenges(editingEntry.challenges || []);
      setGratitude(editingEntry.gratitude || []);
      setGoals(editingEntry.goals || []);
      setInsights(editingEntry.insights || '');
      setLocation(editingEntry.location || '');
      setWeather(editingEntry.weather || '');
    }
  }, [editingEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!mood) {
      toast.error('Please select your mood');
      return;
    }

    const wellnessData = {
      mood,
      intensity,
      activities,
      notes,
      tags,
      energyLevel,
      stressLevel,
      sleepQuality,
      socialConnections,
      selfCareActivities,
      challenges,
      gratitude,
      goals,
      insights,
      location,
      weather,
      date: new Date().toISOString()
    };

    onSubmit(wellnessData);
  };

  const toggleArrayItem = (array, setArray, item) => {
    setArray(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const addGratitudeItem = () => {
    const item = prompt('What are you grateful for today?');
    if (item && item.trim()) {
      setGratitude(prev => [...prev, item.trim()]);
    }
  };

  const removeGratitudeItem = (index) => {
    setGratitude(prev => prev.filter((_, i) => i !== index));
  };

  const addGoalItem = () => {
    const item = prompt('What goal would you like to add?');
    if (item && item.trim()) {
      setGoals(prev => [...prev, item.trim()]);
    }
  };

  const removeGoalItem = (index) => {
    setGoals(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const tag = prompt('Add a tag (e.g., #productive, #anxious, #grateful):');
    if (tag && tag.trim()) {
      setTags(prev => [...prev, tag.trim()]);
    }
  };

  const removeTag = (index) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editingEntry ? 'Edit Wellness Entry' : 'Wellness Check-In'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Selection */}
            <div>
              <label className="block text-white font-medium mb-3">How are you feeling today?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {wellnessMoods.map((moodOption) => (
                  <button
                    key={moodOption.value}
                    type="button"
                    onClick={() => setMood(moodOption.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      mood === moodOption.value
                        ? 'border-emerald-500 bg-emerald-500/20'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{moodOption.emoji}</span>
                      <div className="text-left">
                        <div className="text-white font-medium">{moodOption.label}</div>
                        <div className="text-gray-400 text-sm">{moodOption.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-white font-medium mb-3">
                Intensity: {intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Activities */}
            <div>
              <label className="block text-white font-medium mb-3">What activities did you do today?</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {activityOptions.map((activity) => (
                  <button
                    key={activity.value}
                    type="button"
                    onClick={() => toggleArrayItem(activities, setActivities, activity.value)}
                    className={`p-3 rounded-lg border transition-all ${
                      activities.includes(activity.value)
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{activity.emoji}</span>
                      <span className="text-sm">{activity.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-white font-medium mb-3">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How was your day? Any specific thoughts or feelings?"
                rows={3}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white font-medium mb-3">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-900/30 text-emerald-300 rounded-full text-sm border border-emerald-500/30 flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-emerald-400 hover:text-emerald-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                + Add Tag
              </button>
            </div>

            {/* Wellness Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Energy Level: {energyLevel}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Stress Level: {stressLevel}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Sleep Quality: {sleepQuality}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Social Connections: {socialConnections}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={socialConnections}
                  onChange={(e) => setSocialConnections(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Self-Care Activities */}
            <div>
              <label className="block text-white font-medium mb-3">Self-Care Activities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {selfCareOptions.map((activity) => (
                  <button
                    key={activity.value}
                    type="button"
                    onClick={() => toggleArrayItem(selfCareActivities, setSelfCareActivities, activity.value)}
                    className={`p-3 rounded-lg border transition-all ${
                      selfCareActivities.includes(activity.value)
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{activity.emoji}</span>
                      <span className="text-sm">{activity.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <label className="block text-white font-medium mb-3">Challenges Today</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {challengeOptions.map((challenge) => (
                  <button
                    key={challenge.value}
                    type="button"
                    onClick={() => toggleArrayItem(challenges, setChallenges, challenge.value)}
                    className={`p-3 rounded-lg border transition-all ${
                      challenges.includes(challenge.value)
                        ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{challenge.emoji}</span>
                      <span className="text-sm">{challenge.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gratitude */}
            <div>
              <label className="block text-white font-medium mb-3">Gratitude</label>
              <div className="space-y-2 mb-2">
                {gratitude.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-emerald-900/20 border border-emerald-500/30 rounded">
                    <span className="text-emerald-300">🙏 {item}</span>
                    <button
                      type="button"
                      onClick={() => removeGratitudeItem(index)}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addGratitudeItem}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                + Add Gratitude
              </button>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-white font-medium mb-3">Goals</label>
              <div className="space-y-2 mb-2">
                {goals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-900/20 border border-blue-500/30 rounded">
                    <span className="text-blue-300">🎯 {goal}</span>
                    <button
                      type="button"
                      onClick={() => removeGoalItem(index)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addGoalItem}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                + Add Goal
              </button>
            </div>

            {/* Insights */}
            <div>
              <label className="block text-white font-medium mb-3">Insights</label>
              <textarea
                value={insights}
                onChange={(e) => setInsights(e.target.value)}
                placeholder="Any insights or reflections about your day?"
                rows={2}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Location and Weather */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-3">Location (optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where are you?"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-3">Weather</label>
                <div className="grid grid-cols-4 gap-2">
                  {weatherOptions.map((weatherOption) => (
                    <button
                      key={weatherOption.value}
                      type="button"
                      onClick={() => setWeather(weatherOption.value)}
                      className={`p-3 rounded-lg border transition-all ${
                        weather === weatherOption.value
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg">{weatherOption.emoji}</div>
                        <div className="text-xs">{weatherOption.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !mood}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (editingEntry ? 'Update Entry' : 'Save Check-In')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WellnessCheckInForm; 