import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const DailyQuote = () => {
  const { theme } = useTheme();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Local quotes as fallback
  const getLocalQuote = () => {
    const quotes = [
      {
        content: "Discipline equals freedom.",
        author: "Jocko Willink"
      },
      {
        content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        author: "Aristotle"
      },
      {
        content: "Hard choices, easy life. Easy choices, hard life.",
        author: "Jerzy Gregory"
      },
      {
        content: "You don't rise to the level of your goals, you fall to the level of your systems.",
        author: "James Clear"
      },
      {
        content: "The pain of discipline is far less than the pain of regret.",
        author: "Jim Rohn"
      },
      {
        content: "Do what you have to do until you can do what you want to do.",
        author: "Denzel Washington"
      }
    ];
    
    // Get quote based on the day of the month
    const dayOfMonth = new Date().getDate();
    return quotes[dayOfMonth % quotes.length];
  };

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Always use local quotes instead of trying the remote API that has CORS issues
        setQuote(getLocalQuote());
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quote:', err);
        setQuote(getLocalQuote());
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div className={`${theme.cardBg} rounded-lg shadow-md p-6 animate-pulse`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className={`${theme.cardBg} rounded-lg shadow-md p-6`}>
      <div className="flex items-start">
        <div className="text-3xl mr-4">💭</div>
        <div>
          <blockquote className="text-lg font-medium italic text-gray-700">
            "{quote?.content}"
          </blockquote>
          <cite className="block text-gray-500 mt-2">— {quote?.author}</cite>
        </div>
      </div>
    </div>
  );
};

export default DailyQuote;