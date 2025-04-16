import { useState } from 'react';

const PointsHistory = ({ history = [] }) => {
  const [filter, setFilter] = useState('all');
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatAction = (action) => {
    return action
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.action === filter);
  
  const uniqueActions = [...new Set(history.map(item => item.action))];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3">Points History</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter by action
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="all">All actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>
              {formatAction(action)}
            </option>
          ))}
        </select>
      </div>
      
      {filteredHistory.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No points history available.</p>
      ) : (
        <div className="divide-y max-h-60 overflow-y-auto">
          {filteredHistory.map((item, index) => (
            <div key={index} className="py-2">
              <div className="flex justify-between">
                <span className="font-medium">{formatAction(item.action)}</span>
                <span className="text-green-600 font-medium">+{item.points}</span>
              </div>
              <div className="text-xs text-gray-500">{formatDate(item.timestamp)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PointsHistory;