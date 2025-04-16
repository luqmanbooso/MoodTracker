import { useState } from 'react';

const MoodWheel = ({ onMoodSelect }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  
  const moodGroups = [
    { 
      name: "Joy", 
      color: "#FFD700", 
      textColor: "#000",
      moods: ["Excited", "Happy", "Content", "Proud", "Optimistic"] 
    },
    { 
      name: "Love", 
      color: "#FF69B4", 
      textColor: "#fff",
      moods: ["Affectionate", "Caring", "Compassionate", "Grateful"] 
    },
    { 
      name: "Fear", 
      color: "#800080", 
      textColor: "#fff",
      moods: ["Anxious", "Worried", "Overwhelmed", "Insecure"] 
    },
    { 
      name: "Anger", 
      color: "#FF4500", 
      textColor: "#fff",
      moods: ["Frustrated", "Irritated", "Annoyed", "Resentful"] 
    },
    { 
      name: "Sadness", 
      color: "#4682B4", 
      textColor: "#fff",
      moods: ["Disappointed", "Lonely", "Hopeless", "Regretful"] 
    },
    { 
      name: "Surprise", 
      color: "#00CED1", 
      textColor: "#000",
      moods: ["Amazed", "Confused", "Stunned", "Shocked"] 
    }
  ];
  
  const handleSegmentClick = (group) => {
    setSelectedSegment(group.name);
  };
  
  const handleMoodSelect = (mood) => {
    onMoodSelect(mood);
    setSelectedSegment(null);
  };
  
  return (
    <div className="relative p-4">
      {/* Mood Wheel */}
      <div className="w-full aspect-square max-w-md mx-auto relative">
        {moodGroups.map((group, index) => {
          const angle = (index * 60) - 90; // Starting at top (-90 degrees)
          const radian = angle * Math.PI / 180;
          const x = 50 + 35 * Math.cos(radian);
          const y = 50 + 35 * Math.sin(radian);
          
          return (
            <div key={group.name}>
              <button
                onClick={() => handleSegmentClick(group)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{
                  backgroundColor: group.color,
                  color: group.textColor,
                  left: `${x}%`,
                  top: `${y}%`,
                  zIndex: selectedSegment === group.name ? 10 : 1,
                  transform: selectedSegment === group.name 
                    ? 'translate(-50%, -50%) scale(1.2)' 
                    : 'translate(-50%, -50%)'
                }}
              >
                {group.name}
              </button>
            </div>
          );
        })}
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
          <span className="text-3xl">😊</span>
        </div>
      </div>
      
      {/* Selected mood group options */}
      {selectedSegment && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4 animate-fade-in">
          <h3 className="text-lg font-semibold mb-3">Select specific mood:</h3>
          <div className="grid grid-cols-2 gap-2">
            {moodGroups.find(g => g.name === selectedSegment).moods.map(mood => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
              >
                {mood}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setSelectedSegment(null)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodWheel;