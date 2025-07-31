import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Cache for daily quotes to avoid multiple API calls
let dailyQuoteCache = {
  quote: null,
  date: null,
  expiresAt: null
};

export const getDailyQuote = async (req, res) => {
  try {
    const today = new Date().toDateString();
    
    // Check if we have a cached quote for today
    if (dailyQuoteCache.date === today && dailyQuoteCache.quote) {
      return res.json(dailyQuoteCache.quote);
    }

    // Generate a new quote using OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://moodtracker.app",
        "X-Title": "MoodTracker",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "anthropic/claude-3-haiku",
        "messages": [
          {
            "role": "system",
            "content": `You are a motivational quote generator. Generate a short, inspiring quote (1-2 sentences max) that encourages mental wellness, self-improvement, or positive mindset. The quote should be:
- Concise and impactful
- Focused on mental health, personal growth, or resilience
- Suitable for a mood tracking app
- Include the author's name (real person, not fictional)
- Format as JSON: {"content": "quote text", "author": "author name"}

Examples of good themes:
- Overcoming challenges
- Self-compassion
- Growth mindset
- Mental strength
- Daily progress
- Self-awareness`
          },
          {
            "role": "user",
            "content": "Generate a daily inspirational quote for a mood tracking app."
          }
        ],
        "temperature": 0.7,
        "max_tokens": 150
      })
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(`OpenRouter API error: ${result.error.message}`);
    }
    
    if (!result.choices || !result.choices[0]) {
      throw new Error('Unexpected response format from API');
    }
    
    let responseText = result.choices[0].message.content.trim();
    
    // Try to parse JSON from the response
    let quoteData;
    try {
      // Extract JSON from the response if it's wrapped in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quoteData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback to a default quote if parsing fails
      quoteData = {
        content: "Every day is a new opportunity to improve yourself.",
        author: "Unknown"
      };
    }

    // Cache the quote for today
    dailyQuoteCache = {
      quote: quoteData,
      date: today,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    console.log('Generated daily quote:', quoteData);
    
    return res.json(quoteData);
  } catch (error) {
    console.error('Error generating daily quote:', error);
    
    // Return a fallback quote if API fails
    const fallbackQuote = {
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    };
    
    return res.json(fallbackQuote);
  }
};

// Clear cache endpoint (for testing)
export const clearQuoteCache = async (req, res) => {
  dailyQuoteCache = {
    quote: null,
    date: null,
    expiresAt: null
  };
  res.json({ message: 'Quote cache cleared' });
}; 