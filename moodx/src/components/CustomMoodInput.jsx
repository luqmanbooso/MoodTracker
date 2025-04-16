import { useState, useEffect } from 'react';

const CustomMoodInput = ({ value, onChange, savedTags = [] }) => {
  const [customMood, setCustomMood] = useState(value || '');
  const [tags, setTags] = useState(savedTags || []);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Common mood suggestions
  const commonMoods = [
    'Motivated', 'Anxious', 'Content', 'Inspired', 'Focused', 'Distracted',
    'Excited', 'Calm', 'Energetic', 'Frustrated', 'Grateful', 'Overwhelmed',
    'Bored', 'Relaxed', 'Confident', 'Uncertain', 'Creative', 'Stressed'
  ];
  
  useEffect(() => {
    if (customMood.length > 0) {
      const filtered = commonMoods.filter(mood => 
        mood.toLowerCase().includes(customMood.toLowerCase()) && 
        mood.toLowerCase() !== customMood.toLowerCase()
      );
      setSuggestions(filtered.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  }, [customMood]);
  
  const handleMoodChange = (e) => {
    setCustomMood(e.target.value);
    onChange({ customMood: e.target.value, tags });
  };
  
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput('');
      onChange({ customMood, tags: newTags });
    }
  };
  
  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    onChange({ customMood, tags: newTags });
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const selectSuggestion = (suggestion) => {
    setCustomMood(suggestion);
    setSuggestions([]);
    onChange({ customMood: suggestion, tags });
  };
  
  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Specific Mood (Optional)
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={customMood}
          onChange={handleMoodChange}
          placeholder="How would you describe your mood? (e.g., Motivated, Anxious)"
          className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500"
          maxLength={30}
        />
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded shadow-lg">
            {suggestions.map(suggestion => (
              <div 
                key={suggestion}
                onClick={() => selectSuggestion(suggestion)}
                className="p-2 hover:bg-blue-50 cursor-pointer"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Mood Tags (up to 5)
        </label>
        
        <div className="flex items-center">
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag (e.g., work, family)"
            className="flex-grow p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500"
            maxLength={20}
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!tagInput.trim() || tags.length >= 5}
            className="ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <div 
                key={tag} 
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <span className="sr-only">Remove</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomMoodInput;