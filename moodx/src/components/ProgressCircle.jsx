import React from 'react';

const ProgressCircle = ({ percentage = 0, size = 100, strokeWidth = 8, color = '#4C1D95' }) => {
  // Calculate circle parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Center position
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-200 dark:text-gray-700"
      />
      
      {/* Progress arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
      
      {/* Percentage text - rotate back to normal */}
      <text
        x={center}
        y={center}
        fill="currentColor"
        className="font-medium text-gray-700 dark:text-gray-300"
        fontSize={`${size / 5}px`}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(90 ${center} ${center})`}
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
};

export default ProgressCircle;