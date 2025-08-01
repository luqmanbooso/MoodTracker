import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const MoodForm = ({ addMood, isLoading, customMoodCategories, moods, habits, userGoals }) => {
  const { darkMode } = useTheme();
  const [mood, setMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [activities, setActivities] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [wellnessFactors, setWellnessFactors] = useState([]);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [gratitude, setGratitude] = useState('');
  const [challenges, setChallenges] = useState('');
  const [goals, setGoals] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const wellnessMoods = [
    { value: 'Great', label: 'Great', emoji: '🌟', description: 'Feeling energized, confident, and at peace' },
    { value: 'Good', label: 'Good', emoji: '😊', description: 'Generally positive and content' },
    { value: 'Okay', label: 'Okay', emoji: '😐', description: 'Neither particularly good nor bad' },
    { value: 'Bad', label: 'Bad', emoji: '😔', description: 'Having some difficulties but managing' },
    { value: 'Terrible', label: 'Terrible', emoji: '😰', description: 'Feeling stressed, anxious, or overwhelmed' }
  ];

  const wellnessActivities = [
    { value: 'exercise', label: 'Exercise', emoji: '🏃‍♂️' },
    { value: 'meditation', label: 'Meditation', emoji: '🧘‍♀️' },
    { value: 'social_connection', label: 'Social Connection', emoji: '👥' },
    { value: 'creative_activity', label: 'Creative Activity', emoji: '🎨' },
    { value: 'nature_time', label: 'Time in Nature', emoji: '🌳' },
    { value: 'reading', label: 'Reading', emoji: '📚' },
    { value: 'music', label: 'Music', emoji: '🎵' },
    { value: 'cooking', label: 'Cooking', emoji: '👨‍🍳' },
    { value: 'self_care', label: 'Self-Care', emoji: '💆‍♀️' },
    { value: 'learning', label: 'Learning', emoji: '🎓' }
  ];

  const commonTriggers = [
    { value: 'work_stress', label: 'Work Stress', emoji: '💼' },
    { value: 'social_anxiety', label: 'Social Anxiety', emoji: '😰' },
    { value: 'lack_of_sleep', label: 'Lack of Sleep', emoji: '😴' },
    { value: 'financial_worry', label: 'Financial Worry', emoji: '💰' },
    { value: 'health_concern', label: 'Health Concern', emoji: '🏥' },
    { value: 'relationship_issue', label: 'Relationship Issue', emoji: '💔' },
    { value: 'uncertainty', label: 'Uncertainty', emoji: '❓' },
    { value: 'overwhelm', label: 'Overwhelm', emoji: '😵' }
  ];

  const wellnessFactorOptions = [
    { value: 'sleep_quality', label: 'Sleep Quality', emoji: '😴' },
    { value: 'nutrition', label: 'Nutrition', emoji: '🥗' },
    { value: 'physical_activity', label: 'Physical Activity', emoji: '💪' },
    { value: 'social_connection', label: 'Social Connection', emoji: '👥' },
    { value: 'stress_management', label: 'Stress Management', emoji: '🧘‍♀️' },
    { value: 'purpose_meaning', label: 'Purpose & Meaning', emoji: '🎯' },
    { value: 'emotional_awareness', label: 'Emotional Awareness', emoji: '🧠' },
    { value: 'gratitude_practice', label: 'Gratitude Practice', emoji: '🙏' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mood) return;

    const wellnessData = {
      mood,
      intensity,
      note,
      activities,
      triggers,
      wellnessFactors,
      energyLevel,
      sleepQuality,
      stressLevel,
      gratitude,
      challenges,
      goals,
      timestamp: new Date().toISOString(),
      wellnessScore: calculateWellnessScore()
    };

    addMood(wellnessData);
    resetForm();
  };

  const calculateWellnessScore = () => {
    let score = 0;
    
    // Base score from mood
    const moodScores = { Great: 10, Good: 8, Okay: 6, Bad: 4, Terrible: 2 };
    score += moodScores[mood] || 5;
    
    // Adjust for intensity
    score += (intensity - 5) * 0.5;
    
    // Adjust for energy level
    score += (energyLevel - 5) * 0.3;
    
    // Adjust for sleep quality
    score += (sleepQuality - 5) * 0.2;
    
    // Adjust for stress level (inverse)
    score -= (stressLevel - 5) * 0.3;
    
    // Bonus for positive activities
    if (activities.length > 0) score += 1;
    
    // Bonus for gratitude
    if (gratitude.trim()) score += 1;
    
    return Math.max(1, Math.min(10, Math.round(score)));
  };

  const resetForm = () => {
    setMood('');
    setIntensity(5);
    setNote('');
    setActivities([]);
    setTriggers([]);
    setWellnessFactors([]);
    setEnergyLevel(5);
    setSleepQuality(5);
    setStressLevel(5);
    setGratitude('');
    setChallenges('');
    setGoals([]);
  };

  const toggleActivity = (activity) => {
    setActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const toggleTrigger = (trigger) => {
    setTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const toggleWellnessFactor = (factor) => {
    setWellnessFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Wellness State Selection */}
      <div>
        <label className="block text-white font-medium mb-3">How's your mental health today?</label>
        <div className="grid grid-cols-1 gap-3">
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

      {/* Intensity Slider */}
      <div>
        <label className="block text-white font-medium mb-2">
          Intensity: {intensity}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Mild</span>
          <span>Moderate</span>
          <span>Intense</span>
        </div>
      </div>

      {/* Wellness Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-white font-medium mb-2">
            Energy Level: {energyLevel}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        <div>
          <label className="block text-white font-medium mb-2">
            Sleep Quality: {sleepQuality}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={sleepQuality}
            onChange={(e) => setSleepQuality(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        <div>
          <label className="block text-white font-medium mb-2">
            Stress Level: {stressLevel}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Wellness Activities */}
      <div>
        <label className="block text-white font-medium mb-3">What wellness activities did you engage in today?</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {wellnessActivities.map((activity) => (
            <button
              key={activity.value}
              type="button"
              onClick={() => toggleActivity(activity.value)}
              className={`p-3 rounded-lg border transition-all ${
                activities.includes(activity.value)
                  ? 'border-emerald-500 bg-emerald-500/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-xl mb-1">{activity.emoji}</div>
                <div className="text-white text-xs">{activity.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Triggers */}
      <div>
        <label className="block text-white font-medium mb-3">What might have influenced your wellness today?</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {commonTriggers.map((trigger) => (
            <button
              key={trigger.value}
              type="button"
              onClick={() => toggleTrigger(trigger.value)}
              className={`p-2 rounded-lg border transition-all ${
                triggers.includes(trigger.value)
                  ? 'border-yellow-500 bg-yellow-500/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{trigger.emoji}</div>
                <div className="text-white text-xs">{trigger.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Wellness Tracking
        </button>
      </div>

      {/* Advanced Wellness Tracking */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
          {/* Wellness Factors */}
          <div>
            <label className="block text-white font-medium mb-3">Which wellness factors are most important to you today?</label>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
               {wellnessFactorOptions.map((factor) => (
                <button
                  key={factor.value}
                  type="button"
                  onClick={() => toggleWellnessFactor(factor.value)}
                  className={`p-2 rounded-lg border transition-all ${
                    wellnessFactors.includes(factor.value)
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-600 bg-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{factor.emoji}</div>
                    <div className="text-white text-xs">{factor.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Gratitude */}
          <div>
            <label className="block text-white font-medium mb-2">What are you grateful for today?</label>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="I'm grateful for..."
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              rows="2"
            />
          </div>

          {/* Challenges */}
          <div>
            <label className="block text-white font-medium mb-2">What challenges are you facing?</label>
            <textarea
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="I'm struggling with..."
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              rows="2"
            />
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-white font-medium mb-2">Additional thoughts or reflections</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How are you feeling? What's on your mind?"
          className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
          rows="3"
        />
      </div>

      {/* Wellness Score Preview */}
      {mood && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Your Wellness Score</span>
            <span className="text-2xl font-bold text-white">{calculateWellnessScore()}/10</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(calculateWellnessScore() / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!mood || isLoading}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          !mood || isLoading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            Recording Wellness Check...
          </div>
        ) : (
          'Complete Wellness Check'
        )}
      </button>
    </form>
  );
};

export default MoodForm;