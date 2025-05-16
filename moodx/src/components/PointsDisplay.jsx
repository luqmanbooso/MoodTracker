import React from 'react';

const PointsDisplay = ({ points, level, recentActivity = [] }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-emerald-400">
            {points || 0} Points
          </h3>
          <p className="text-gray-400">Level {level || 1}</p>
        </div>
        <div className="bg-emerald-900/40 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      {/* Progress to next level */}
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-xs text-gray-300">
          <span>Level {level || 1}</span>
          <span>Level {(level || 1) + 1}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-2 rounded-full" 
            style={{ width: `${Math.min(((points || 0) % 100), 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Activity</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            {recentActivity.slice(0, 3).map((activity, index) => (
              <li key={index} className="flex justify-between">
                <span>{activity.description}</span>
                <span className="text-emerald-400">+{activity.points}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PointsDisplay;
