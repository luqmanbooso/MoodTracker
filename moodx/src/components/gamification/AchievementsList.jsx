import React from 'react';

const AchievementsList = ({ achievements, loading }) => {
  if (loading) return <div className="loading">Loading achievements...</div>;
  
  if (!achievements || achievements.length === 0) {
    return (
      <div className="empty-achievements">
        <p>No achievements yet. Keep using the app to earn rewards!</p>
      </div>
    );
  }
  
  // Get icon for achievement type
  const getIcon = (type) => {
    switch (type) {
      case 'mood_entries': return '📝';
      case 'streaks': return '🔥';
      case 'challenge_completion': return '🎯';
      case 'resource_usage': return '📚';
      default: return '🏆';
    }
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <div className="achievements-list">
      {achievements.map(achievement => (
        <div key={achievement._id} className="achievement-item">
          <div className="achievement-icon">{getIcon(achievement.type)}</div>
          <div className="achievement-content">
            <h3 className="achievement-title">{achievement.title}</h3>
            <p className="achievement-description">{achievement.description}</p>
            <div className="achievement-meta">
              <span className="achievement-date">
                Earned on {formatDate(achievement.earnedDate)}
              </span>
              {achievement.points > 0 && (
                <span className="achievement-points">+{achievement.points} pts</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementsList;