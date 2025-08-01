import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';

const MoodCalendar = ({ moods, onDateClick, points, streaks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get all days in current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get mood data for the month
  const getMoodForDate = (date) => {
    return moods.find(mood => isSameDay(new Date(mood.timestamp), date));
  };

  // Get points for a specific date
  const getPointsForDate = (date) => {
    const mood = getMoodForDate(date);
    if (!mood) return 0;
    
    // Base points for logging
    let points = 10;
    
    // Bonus points for detailed notes
    if (mood.notes && mood.notes.length > 20) points += 5;
    
    // Bonus points for activities
    if (mood.activities && mood.activities.length > 0) points += 3;
    
    // Bonus points for positive mood
    if (['thriving', 'good'].includes(mood.mood)) points += 2;
    
    // Streak bonus
    const dayOfYear = format(date, 'D');
    if (streaks?.moodStreak && dayOfYear <= streaks.moodStreak) points += 1;
    
    return points;
  };

  // Get mood color
  const getMoodColor = (mood) => {
    const colors = {
      thriving: 'bg-emerald-500',
      good: 'bg-green-500',
      neutral: 'bg-yellow-500',
      struggling: 'bg-orange-500',
      overwhelmed: 'bg-red-500'
    };
    return colors[mood] || 'bg-gray-400';
  };

  // Get mood intensity
  const getMoodIntensity = (mood) => {
    const intensities = {
      thriving: 5,
      good: 4,
      neutral: 3,
      struggling: 2,
      overwhelmed: 1
    };
    return intensities[mood] || 0;
  };

  // Calculate monthly stats
  const monthlyStats = () => {
    const monthMoods = moods.filter(mood => 
      isSameMonth(new Date(mood.timestamp), currentDate)
    );
    
    const totalPoints = monthMoods.reduce((sum, mood) => {
      return sum + getPointsForDate(new Date(mood.timestamp));
    }, 0);
    
    const avgMood = monthMoods.length > 0 
      ? monthMoods.reduce((sum, mood) => sum + getMoodIntensity(mood.mood), 0) / monthMoods.length
      : 0;
    
    const loggedDays = monthMoods.length;
    const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const completionRate = (loggedDays / totalDays) * 100;
    
    return { totalPoints, avgMood, loggedDays, totalDays, completionRate };
  };

  const stats = monthlyStats();

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateClick(date);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Monthly Stats */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{stats.totalPoints}</div>
            <div className="text-xs text-slate-400">Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.avgMood.toFixed(1)}</div>
            <div className="text-xs text-slate-400">Avg Mood</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.loggedDays}/{stats.totalDays}</div>
            <div className="text-xs text-slate-400">Days Logged</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-slate-400">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {daysInMonth.map((day, index) => {
          const mood = getMoodForDate(day);
          const dayPoints = getPointsForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                relative p-2 h-16 border border-slate-700 rounded-lg cursor-pointer transition-all duration-200
                ${isCurrentMonth ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 text-slate-500'}
                ${isToday(day) ? 'ring-2 ring-emerald-500' : ''}
                ${selectedDate && isSameDay(day, selectedDate) ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className="text-sm font-medium text-white mb-1">
                {format(day, 'd')}
              </div>
              
              {/* Mood indicator */}
              {mood && (
                <div className="flex items-center space-x-1">
                  <div className={`w-3 h-3 rounded-full ${getMoodColor(mood.mood)}`}></div>
                  {dayPoints > 0 && (
                    <div className="text-xs text-emerald-400 font-medium">
                      +{dayPoints}
                    </div>
                  )}
                </div>
              )}
              
              {/* Streak indicator */}
              {streaks?.moodStreak && index < streaks.moodStreak && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Monthly Progress */}
      <div className="bg-slate-700 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Monthly Progress</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Completion Rate */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">Completion Rate</span>
              <span className="text-emerald-400 font-medium">{stats.completionRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>
          
          {/* Average Mood */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">Average Mood</span>
              <span className="text-blue-400 font-medium">{stats.avgMood.toFixed(1)}/5</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.avgMood / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Points Breakdown */}
        <div className="mt-4 pt-4 border-t border-slate-600">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Points Breakdown</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-emerald-400 font-medium">+10</div>
              <div className="text-slate-400">Base Log</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-medium">+5</div>
              <div className="text-slate-400">Notes</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-medium">+3</div>
              <div className="text-slate-400">Activities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-4 p-4 bg-slate-700 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-2">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {getMoodForDate(selectedDate) ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${getMoodColor(getMoodForDate(selectedDate).mood)}`}></div>
                <span className="text-white font-medium capitalize">
                  {getMoodForDate(selectedDate).mood}
                </span>
              </div>
              
              {getMoodForDate(selectedDate).notes && (
                <div className="text-sm text-slate-300">
                  "{getMoodForDate(selectedDate).notes}"
                </div>
              )}
              
              <div className="text-sm text-emerald-400 font-medium">
                +{getPointsForDate(selectedDate)} points earned
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">
              No mood logged for this date
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodCalendar; 