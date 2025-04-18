import React from 'react';

const PointsHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="empty-points">
        <p>No points earned yet. Complete actions to earn points!</p>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="points-history">
      {history.slice(0, 10).map((item, index) => (
        <div key={index} className="points-item">
          <div className="points-value">+{item.points}</div>
          <div className="points-details">
            <div className="points-description">{item.description}</div>
            <div className="points-date">{formatDate(item.date)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PointsHistory;