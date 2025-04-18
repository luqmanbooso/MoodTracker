import React from 'react';

const StatsGrid = ({ moodCount, challengeCount, currentStreak, longestStreak }) => {
  const stats = [
    {
      label: 'Mood Entries',
      value: moodCount,
      icon: '📝'
    },
    {
      label: 'Challenges Completed',
      value: challengeCount,
      icon: '🎯'
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} days`,
      icon: '🔥'
    },
    {
      label: 'Longest Streak',
      value: `${longestStreak} days`,
      icon: '🏆'
    }
  ];
  
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;