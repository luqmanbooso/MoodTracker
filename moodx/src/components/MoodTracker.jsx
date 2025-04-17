import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePoints } from '../context/PointsContext';
import MoodForm from './MoodForm';
import MoodList from './MoodList';
import MoodChart from './MoodChart';
import MoodStats from './MoodStats';
import PersonalizedTips from './PersonalizedTips';
import { getMoods, createMood, deleteMood } from '../services/api';
import { toast } from 'react-toastify';

const MoodTracker = ({ onShowMoodForm }) => {
  const { darkMode } = useTheme();
  const { addPoints } = usePoints();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch moods on component mount
  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      setLoading(true);
      const data = await getMoods();
      setMoods(data);
      setError(null);
    } catch (err) {
      setError('Failed to load moods. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMood = async (moodData) => {
    try {
      setLoading(true);
      const newMood = await createMood(moodData);
      setMoods(prevMoods => [newMood, ...prevMoods]);
      
      // Award points for logging mood
      addPoints(10);
      toast.success('Mood logged successfully!');
      
      // Award points for additional actions
      if (moodData.note && moodData.note.trim().length > 0) {
        addPoints(5);
      }
      
      if (moodData.activities && moodData.activities.length > 0) {
        addPoints(5);
      }
      
      if (moodData.tags && moodData.tags.length > 0) {
        addPoints(5);
      }
    } catch (err) {
      setError('Failed to add mood. Please try again.');
      console.error(err);
      toast.error('Failed to log mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMood = async (id) => {
    try {
      await deleteMood(id);
      setMoods(prevMoods => prevMoods.filter(mood => mood._id !== id));
      toast.success('Mood deleted successfully');
    } catch (err) {
      setError('Failed to delete mood. Please try again.');
      console.error(err);
      toast.error('Failed to delete mood');
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className={`mb-6 p-6 rounded-xl ${darkMode 
        ? 'bg-gradient-to-r from-emerald-800 to-emerald-900 text-white' 
        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'} shadow-xl`}
      >
        <h1 className="text-3xl font-bold mb-2">How Are You Feeling Today?</h1>
        <p className="opacity-90">Track your emotions to build self-awareness and identify patterns.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`rounded-xl shadow-lg overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2 rounded-lg mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Log Your Mood
            </h2>
          </div>
          <div className="p-6">
            <MoodForm addMood={handleAddMood} isLoading={loading} />
          </div>
        </div>
        
        <div className="space-y-6">
          {moods.length > 0 && (
            <div className={`rounded-xl shadow-lg overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                  <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-2 rounded-lg mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  Personalized Tips
                </h2>
              </div>
              <div className="p-6">
                <PersonalizedTips moods={moods} />
              </div>
            </div>
          )}
          
          <div className={`rounded-xl shadow-lg overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-lg mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Your Mood History
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${darkMode ? 'border-emerald-400' : 'border-emerald-500'}`}></div>
                </div>
              ) : moods.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg text-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No mood entries yet. Add your first mood!</p>
                  <button 
                    onClick={onShowMoodForm}
                    className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                  >
                    Log First Mood
                  </button>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  <MoodList moods={moods} deleteMood={handleDeleteMood} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {moods.length > 0 && (
        <div className="mt-6">
          <div className={`rounded-xl shadow-lg overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-2 rounded-lg mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                Quick Mood Insights
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <MoodChart moods={moods} simplified={true} />
                </div>
                <div>
                  <MoodStats moods={moods} simplified={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mt-6 shadow-md">
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button 
            onClick={fetchMoods} 
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;