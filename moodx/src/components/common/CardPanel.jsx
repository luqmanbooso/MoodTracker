import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const CardPanel = ({ 
  title, 
  children, 
  action,
  icon,
  iconBgClass = 'from-indigo-500 to-purple-500',
  className = '' 
}) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`rounded-xl shadow-lg overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${className}`}>
      {title && (
        <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
            {icon && (
              <span className={`bg-gradient-to-r ${iconBgClass} text-white p-2 rounded-lg mr-2`}>
                {icon}
              </span>
            )}
            {title}
          </h2>
          
          {action && (
            <div>
              {action}
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default CardPanel;