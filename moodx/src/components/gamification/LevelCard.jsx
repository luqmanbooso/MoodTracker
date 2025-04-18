import React from 'react';

const LevelCard = ({ level, progress, points, nextLevel, pointsForNextLevel }) => {
  return (
    <div className="level-card">
      <div className="level-badge">
        <span className="level-number">{level}</span>
        <span className="level-label">LEVEL</span>
      </div>
      
      <div className="level-info">
        <div className="level-header">
          <h2>Level {level}</h2>
          <span className="total-points">{points} POINTS</span>
        </div>
        
        <div className="level-progress-info">
          <span>{pointsForNextLevel} points to Level {nextLevel}</span>
          <span className="progress-percent">{progress}%</span>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LevelCard;