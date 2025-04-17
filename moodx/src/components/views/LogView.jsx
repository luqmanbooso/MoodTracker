import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import CardPanel from '../common/CardPanel';

const LogView = ({ moods = [], onLogMood, onEditMood, onDeleteMood }) => {
  const { darkMode } = useTheme();
  const [filteredMoods, setFilteredMoods] = useState(moods);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let filtered = [...moods];
    
    // Apply period filter
    if (filterPeriod !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filterPeriod) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(mood => new Date(mood.date) >= cutoffDate);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'intensity') {
        return sortOrder === 'asc' ? a.intensity - b.intensity : b.intensity - a.intensity;
      }
      return 0;
    });
    
    setFilteredMoods(filtered);
  }, [moods, filterPeriod, sortBy, sortOrder]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Mood Log
        </h1>
        <button 
          onClick={onLogMood}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
        >
          + Log New Mood
        </button>
      </div>

      {/* Filters and Sorting */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Time Period
            </label>
            <select 
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className={`rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} px-3 py-1.5`}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Sort By
            </label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} px-3 py-1.5`}
            >
              <option value="date">Date</option>
              <option value="intensity">Intensity</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Order
            </label>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={`rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} px-3 py-1.5`}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mood entries */}
      <div className="space-y-4">
        {filteredMoods.length === 0 ? (
          <CardPanel>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                No mood entries yet
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Start tracking your mood to build your emotional awareness
              </p>
              <button
                onClick={onLogMood}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                Log Your First Mood
              </button>
            </div>
          </CardPanel>
        ) : (
          filteredMoods.map(mood => (
            <div 
              key={mood.id} 
              className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} flex gap-4 items-start`}
            >
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: mood.color || '#f3f4f6' }}
              >
                {mood.emoji || '😐'}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {mood.name || 'Mood Entry'}
                    <span className={`ml-2 text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      (Intensity: {mood.intensity}/10)
                    </span>
                  </h3>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(mood.date)}
                  </span>
                </div>
                
                {mood.notes && (
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {mood.notes}
                  </p>
                )}
                
                {mood.factors && mood.factors.length > 0 && (
                  <div className="mt-2">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Factors:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {mood.factors.map((factor, idx) => (
                        <span 
                          key={idx}
                          className={`px-2 py-1 text-xs rounded-full ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => onEditMood(mood.id)}
                    className={`text-sm px-3 py-1 rounded ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-emerald-400' 
                        : 'hover:bg-gray-100 text-emerald-600'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteMood(mood.id)}
                    className={`text-sm px-3 py-1 rounded ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-red-400' 
                        : 'hover:bg-gray-100 text-red-600'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogView;