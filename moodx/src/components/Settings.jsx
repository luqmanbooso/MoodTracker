import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

// Enhanced Settings component that works both as modal and page
const Settings = ({ 
  isOpen, 
  onClose, 
  customMoodCategories = [], 
  onAddCustomMood, 
  onRemoveCustomMood 
}) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [newMoodCategory, setNewMoodCategory] = useState('');
  const [activeTab, setActiveTab] = useState('appearance');
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });

  // For debugging
  useEffect(() => {
    console.log("Settings component rendered with isOpen:", isOpen);
  }, [isOpen]);

  const handleAddMoodCategory = () => {
    if (newMoodCategory && !customMoodCategories.includes(newMoodCategory)) {
      onAddCustomMood(newMoodCategory);
      setNewMoodCategory('');
      toast.success('Custom mood added!');
    }
  };

  const handleSaveName = () => {
    localStorage.setItem('userName', userName);
    toast.success('Name saved successfully!');
    if (onClose) onClose(); // Only call onClose if it exists (i.e., in modal mode)
  };

  // Determine if this is being used as a modal
  const isModal = isOpen !== undefined;

  // If it's a modal and not open, don't render anything
  if (isModal && !isOpen) return null;

  // Common content for both modal and page views
  const SettingsContent = () => (
    <>
      {/* Tab Navigation */}
      <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setActiveTab('appearance')}
          className={`pb-2 px-4 ${activeTab === 'appearance' 
            ? `border-b-2 ${darkMode ? 'border-emerald-500 text-emerald-400' : 'border-orange-500 text-orange-500'}`
            : 'text-gray-500 dark:text-gray-400'}`}
        >
          Theme
        </button>
        <button 
          onClick={() => setActiveTab('moods')}
          className={`pb-2 px-4 ${activeTab === 'moods' 
            ? `border-b-2 ${darkMode ? 'border-emerald-500 text-emerald-400' : 'border-orange-500 text-orange-500'}`
            : 'text-gray-500 dark:text-gray-400'}`}
        >
          Custom Moods
        </button>
      </div>
      
      {/* Theme settings */}
      {activeTab === 'appearance' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme Mode
          </label>
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-between w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              {darkMode ? (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark Mode
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Light Mode
                </span>
              )}
            </div>
            <div className={`w-10 h-5 ${darkMode ? 'bg-emerald-600' : 'bg-orange-500'} rounded-full relative transition-colors`}>
              <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${darkMode ? 'translate-x-5' : ''}`}></span>
            </div>
          </button>
          
          <div className="mt-4">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      )}
      
      {/* Custom moods settings */}
      {activeTab === 'moods' && (
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Custom Mood
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMoodCategory}
                onChange={(e) => setNewMoodCategory(e.target.value)}
                placeholder="E.g., Excited, Nostalgic..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
              <button
                onClick={handleAddMoodCategory}
                className={`px-3 py-2 rounded text-white ${darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                Add
              </button>
            </div>
          </div>
          
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Custom Moods
          </label>
          <div className="max-h-32 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
            {customMoodCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {customMoodCategories.map((category) => (
                  <div key={category} className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    <span className="text-sm text-gray-800 dark:text-gray-200">{category}</span>
                    <button
                      onClick={() => onRemoveCustomMood(category)}
                      className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                No custom moods added yet.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );

  // For modal view
  if (isModal) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose} // Close when clicking outside
      >
        <div 
          className={`w-full max-w-md rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
        >
          <div className="p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Settings
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-5">
            <SettingsContent />
          </div>
          
          <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveName}
              className={`px-4 py-2 text-white rounded hover:bg-opacity-90 ${darkMode ? 'bg-emerald-600' : 'bg-orange-500'}`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For page view
  return (
    <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Settings
      </h2>
      
      <SettingsContent />

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveName}
          className={`px-4 py-2 text-white rounded hover:bg-opacity-90 ${darkMode ? 'bg-emerald-600' : 'bg-orange-500'}`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Settings;