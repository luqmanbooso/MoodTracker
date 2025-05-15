import React from 'react';
import logoImage from '../assets/logo.png'; // Make sure this image exists in your assets folder

const Logo = ({ size = 'medium', showTagline = true }) => {
  // Size classes for different logo sizes
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-20'
  };
  
  return (
    <div className="flex flex-col items-center">
      <img 
        src={logoImage} 
        alt="MoodX - Your Personal Mood Tracker" 
        className={`${sizeClasses[size]} w-auto`} 
      />
      {showTagline && (
        <span className="text-xs text-blue-600 mt-1">YOUR PERSONAL MOOD TRACKER</span>
      )}
    </div>
  );
};

export default Logo;
