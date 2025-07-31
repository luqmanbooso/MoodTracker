import { useState, useEffect } from 'react';
import { getDailyQuote } from '../services/api';

const DailyQuote = ({ compact = false }) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we have a cached quote for today
        const today = new Date().toDateString();
        const cachedQuote = localStorage.getItem('dailyQuote');
        const cachedData = cachedQuote ? JSON.parse(cachedQuote) : null;
        
        if (cachedData && cachedData.date === today) {
          setQuote(cachedData.quote);
          setLoading(false);
          return;
        }

        // Fetch new quote from API
        const quoteData = await getDailyQuote();
        
        // Cache the quote for today
        localStorage.setItem('dailyQuote', JSON.stringify({
          quote: quoteData,
          date: today
        }));
        
        setQuote(quoteData);
      } catch (err) {
        console.error('Error fetching quote:', err);
        setError('Failed to load daily inspiration');
        
        // Fallback to a default quote
        setQuote({
          content: "Every day is a new opportunity to improve yourself.",
          author: "Unknown"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-gray-400 text-sm">
        {error}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <blockquote className="text-sm font-medium text-gray-200 leading-relaxed">
          "{quote?.content}"
        </blockquote>
        <cite className="block text-xs text-gray-400">— {quote?.author}</cite>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <div className="flex items-start">
        <div className="text-3xl mr-4">💭</div>
        <div className="flex-1">
          <blockquote className="text-lg font-medium italic text-gray-200 leading-relaxed">
            "{quote?.content}"
          </blockquote>
          <cite className="block text-gray-400 mt-3 font-medium">— {quote?.author}</cite>
        </div>
      </div>
    </div>
  );
};

export default DailyQuote;