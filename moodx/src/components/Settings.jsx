import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Enhanced Settings component that works both as modal and page
const Settings = ({ 
  isOpen, 
  onClose, 
  customMoodCategories = [], 
  onAddCustomMood, 
  onRemoveCustomMood 
}) => {
  const [newMoodCategory, setNewMoodCategory] = useState('');
  const [activeTab, setActiveTab] = useState('appearance');
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });

  // For debugging
  useEffect(() => {
    console.log("Settings component rendered with isOpen:", isOpen);
  }, [isOpen]);

  const handleAddMoodCategory = (e) => {
    e.preventDefault(); // Prevent form submission
    if (newMoodCategory && !customMoodCategories.includes(newMoodCategory)) {
      onAddCustomMood(newMoodCategory);
      setNewMoodCategory('');
      toast.success('Custom mood added!');
    }
  };

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault(); // Prevent default form submission
    localStorage.setItem('userName', userName);
    toast.success('Settings saved successfully!');
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
      <div className="flex mb-4 border-b border-gray-700">
        <button 
          onClick={() => setActiveTab('appearance')}
          className={`pb-2 px-4 ${activeTab === 'appearance' 
            ? 'border-b-2 border-emerald-500 text-emerald-400'
            : 'text-gray-400'}`}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab('moods')}
          className={`pb-2 px-4 ${activeTab === 'moods' 
            ? 'border-b-2 border-emerald-500 text-emerald-400'
            : 'text-gray-400'}`}
        >
          Custom Moods
        </button>
      </div>
      
      {/* Profile settings (previously theme settings) */}
      {activeTab === 'appearance' && (
        <form onSubmit={handleSaveSettings} className="mb-4">
          {userName ? (
            <div className="px-3 py-4 rounded-md border border-gray-700 mb-4">
              <h3 className="text-xl font-medium text-emerald-400 mb-2">
                Hello, {userName}
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                You can change your name below if you'd like:
              </p>
              <div className="mt-3">
                <label htmlFor="userName" className="sr-only">Your Name</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Update Name
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Save Name
                </button>
              </div>
            </div>
          )}
        </form>
      )}
      
      {/* Custom moods settings */}
      {activeTab === 'moods' && (
        <div className="mb-4">
          <form onSubmit={handleAddMoodCategory} className="mb-4">
            <label htmlFor="newMoodCategory" className="block text-sm font-medium text-gray-300 mb-2">
              Add Custom Mood
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="newMoodCategory"
                value={newMoodCategory}
                onChange={(e) => setNewMoodCategory(e.target.value)}
                placeholder="E.g., Excited, Nostalgic..."
                className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Add
              </button>
            </div>
          </form>
          
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Custom Moods
          </label>
          <div className="max-h-60 overflow-y-auto p-3 border border-gray-700 rounded-lg bg-gray-800">
            {customMoodCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {customMoodCategories.map((category) => (
                  <div key={category} className="flex items-center bg-gray-700 px-3 py-2 rounded-full">
                    <span className="text-sm text-gray-200">{category}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveCustomMood(category)}
                      className="ml-2 text-gray-400 hover:text-red-400 focus:outline-none focus:text-red-400"
                      aria-label={`Remove ${category}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
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
          className="w-full max-w-md rounded-xl shadow-xl overflow-hidden bg-gray-800"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
        >
          <div className="p-5 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              Settings
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-200"
              aria-label="Close settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-5">
            <SettingsContent />
          </div>
          
          <div className="p-5 border-t border-gray-700 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For page view
  return (
    <div className="rounded-xl shadow-md p-6 bg-gray-800 border border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-white">
        Settings
      </h2>
      
      <SettingsContent />
    </div>
  );
};

export default Settings;