import { useState, useEffect } from 'react';

const challenges = [
  { id: '1', text: "Go for a 10-minute walk outside", category: "physical" },
  { id: '2', text: "Write down 3 things you're grateful for today", category: "mindfulness" },
  { id: '3', text: "Drink 8 glasses of water today", category: "health" },
  { id: '4', text: "Meditate for 5 minutes", category: "mindfulness" },
  { id: '5', text: "Call or message a friend you haven't spoken to in a while", category: "social" },
  { id: '6', text: "Try a new healthy recipe", category: "health" },
  { id: '7', text: "Do 15 minutes of exercise", category: "physical" },
  { id: '8', text: "Practice deep breathing for 5 minutes", category: "mindfulness" },
  { id: '9', text: "Declutter one area of your home", category: "environment" },
  { id: '10', text: "Go to bed 30 minutes earlier than usual", category: "health" }
];

const DailyChallenge = ({ onComplete, completedChallenges = [], showHistory = false }) => {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get today's date as string to use as seed for daily challenge
    const today = new Date().toISOString().split('T')[0];
    
    // Use the date string to get a consistent challenge for the day
    const seed = hashString(today) % challenges.length;
    setCurrentChallenge(challenges[seed]);
    setLoading(false);
    
    // In a real app, you would fetch this from the API:
    // const fetchChallenge = async () => {
    //   try {
    //     const response = await fetch('/api/challenges/random');
    //     const data = await response.json();
    //     setCurrentChallenge(data);
    //   } catch (err) {
    //     console.error('Error fetching challenge:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchChallenge();
  }, []);
  
  // Simple hash function for string
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  const isCompleted = currentChallenge && completedChallenges.includes(currentChallenge.id);
  
  const handleComplete = () => {
    if (currentChallenge && !isCompleted) {
      onComplete(currentChallenge.id);
    }
  };
  
  const getCategoryEmoji = (category) => {
    switch(category) {
      case 'physical': return '🏃‍♂️';
      case 'mindfulness': return '🧘';
      case 'health': return '💚';
      case 'social': return '👋';
      case 'environment': return '🏠';
      default: return '✨';
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }
  
  if (!currentChallenge) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Daily Challenge</h3>
        <p className="text-gray-600">No challenge available right now. Check back later!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Daily Challenge</h3>
        <span className="text-2xl" role="img" aria-label={currentChallenge.category}>
          {getCategoryEmoji(currentChallenge.category)}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-800 font-medium">{currentChallenge.text}</p>
        <p className="text-sm text-gray-500 mt-1 capitalize">
          Category: {currentChallenge.category}
        </p>
      </div>
      
      {isCompleted ? (
        <div className="flex items-center mt-4 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Completed!</span>
        </div>
      ) : (
        <button
          onClick={handleComplete}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Mark as Complete
        </button>
      )}
      
      {showHistory && completedChallenges.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-2">Completed Challenges</h4>
          <ul className="space-y-2">
            {completedChallenges.map(id => {
              const challenge = challenges.find(c => c.id === id);
              if (!challenge) return null;
              
              return (
                <li key={id} className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{challenge.text}</span>
                </li>
              );
            }).slice(0, 5)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DailyChallenge;