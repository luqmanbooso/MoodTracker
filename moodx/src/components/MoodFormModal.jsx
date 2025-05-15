import React from 'react';
import { useTheme } from '../context/ThemeContext';
import MoodForm from './MoodForm';

const MoodFormModal = ({ onClose, onSave, isLoading, customMoodCategories = [], moods = [], habits = [], goals = [] }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              How are you feeling?
            </h2>
            <button 
              onClick={onClose}
              className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <MoodForm 
            addMood={onSave}
            isLoading={isLoading}
            customMoodCategories={customMoodCategories}
            moods={moods}
            habits={habits}
            goals={goals}
          />
        </div>
      </div>
    </div>
  );
};

export default MoodFormModal;