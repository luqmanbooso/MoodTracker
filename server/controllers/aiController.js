import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export const getAIResponse = async (req, res) => {
  try {
    console.log('AI request received:', req.body);
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create a richer context about the user
    const moodContext = context?.moods?.length > 0 
      ? `Your recent moods: ${context.moods.map(m => `${m.mood} on ${new Date(m.date).toLocaleDateString()}`).join(', ')}.` 
      : 'I don\'t have any mood records yet.';
    
    const habitContext = context?.habits?.length > 0
      ? `Your current habits: ${context.habits.map(h => `${h.name} (${h.completed ? 'completed today' : 'not completed today'})`).join(', ')}.`
      : 'You haven\'t set up any habits yet.';
    
    const goalContext = context?.goals?.length > 0
      ? `Your goals: ${context.goals.map(g => `${g.title} (${g.progress || 0}% complete)`).join(', ')}.`
      : 'You haven\'t set any goals yet.';

    // Call OpenRouter API with a valid model ID
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://moodtracker.app",
        "X-Title": "MoodTracker",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "anthropic/claude-3-haiku", // UPDATED: Removed date suffix
        "messages": [
          {
            "role": "system",
            "content": "You are 'Mindset Coach', an accountability coach in a mood tracking app. Your responses should be concise (1-3 sentences), direct but compassionate. Focus on practical steps users can take. Use a firm but supportive tone. When users express negative emotions, acknowledge them briefly then suggest concrete actions. Refer to their tracked data when relevant. Never give medical advice."
          },
          {
            "role": "user",
            "content": `${moodContext}\n${habitContext}\n${goalContext}\n\nMy message to you: ${message}`
          }
        ],
        "temperature": 0.5,
        "max_tokens": 150
      })
    });

    const result = await openRouterResponse.json();
    console.log('OpenRouter response:', result);
    
    if (result.error) {
      throw new Error(`OpenRouter API error: ${result.error.message}`);
    }
    
    if (!result.choices || !result.choices[0]) {
      throw new Error('Unexpected response format from API');
    }
    
    let responseText = result.choices[0].message.content.trim();
    
    // Determine if any action is recommended
    let action = null;
    const lowerResponse = responseText.toLowerCase();
    if (lowerResponse.includes('habit') || lowerResponse.includes('routine')) {
      action = 'habits';
    } else if (lowerResponse.includes('goal') || lowerResponse.includes('objective')) {
      action = 'goals';
    } else if (lowerResponse.includes('mood') || lowerResponse.includes('emotion')) {
      action = 'log';
    } else if (lowerResponse.includes('data') || lowerResponse.includes('pattern')) {
      action = 'stats';
    }

    console.log('Sending AI response:', { response: responseText, action, source: 'openrouter' });
    
    // Add this before returning the response to client
    console.log('Final response being sent to client:', { 
      response: responseText, 
      action,
      source: 'openrouter'
    });

    return res.json({ 
      response: responseText, 
      action,
      source: 'openrouter'
    });
  } catch (error) {
    console.error('AI Response Error:', error);
    
    // Create a more personalized fallback response based on the message content
    const fallbackResponses = createPersonalizedFallback(req.body.message, req.body.context);
    
    return res.json({
      response: fallbackResponses.message,
      action: fallbackResponses.action,
      source: 'fallback'
    });
  }
};

// Create a personalized fallback function
function createPersonalizedFallback(message, context) {
  const lowercaseMessage = message.toLowerCase();
  
  // Default fallback
  let response = {
    message: "Focus on what you can control today. What's one small step you can take right now?",
    action: 'habits'
  };
  
  // Tailor response based on message content
  if (lowercaseMessage.includes('sad') || lowercaseMessage.includes('depress') || 
      lowercaseMessage.includes('down')) {
    response.message = "Acknowledge those feelings without judgment. What's one tiny step that might improve your day, even slightly?";
  }
  else if (lowercaseMessage.includes('anxious') || lowercaseMessage.includes('worry') || 
           lowercaseMessage.includes('stress')) {
    response.message = "Anxiety often comes from focusing too far ahead. What's one small action within your control right now?";
  }
  else if (lowercaseMessage.includes('motivat') || lowercaseMessage.includes('stuck')) {
    response.message = "Motivation is unreliable. Build systems you can follow even on your worst days. What's one habit you can strengthen today?";
  }
  
  return response;
}