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

    // Enhanced mood analysis with trend detection
    let moodTrend = '';
    let moodSummary = '';
    
    if (context?.moods?.length > 0) {
      // Get recent moods (last 7 entries or less)
      const recentMoods = context.moods.slice(0, 7);
      
      // Calculate mood score based on intensity
      const moodScores = recentMoods.map(m => m.intensity || 5);
      const averageMood = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
      
      // Check if we have enough moods to determine a trend
      if (recentMoods.length > 2) {
        const firstHalf = moodScores.slice(0, Math.ceil(moodScores.length/2));
        const secondHalf = moodScores.slice(Math.ceil(moodScores.length/2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        // Determine trend
        if (secondAvg > firstAvg + 0.5) {
          moodTrend = "Your mood has been improving recently. ";
        } else if (secondAvg < firstAvg - 0.5) {
          moodTrend = "Your mood has been declining recently. ";
        } else {
          moodTrend = "Your mood has been relatively stable recently. ";
        }
      }
      
      // Create mood summary
      const moodFrequency = {};
      recentMoods.forEach(m => {
        moodFrequency[m.mood] = (moodFrequency[m.mood] || 0) + 1;
      });
      
      // Find most common mood
      let mostCommonMood = '';
      let highestCount = 0;
      for (const [mood, count] of Object.entries(moodFrequency)) {
        if (count > highestCount) {
          mostCommonMood = mood;
          highestCount = count;
        }
      }
      
      moodSummary = `Your most frequent mood lately has been "${mostCommonMood}" (${highestCount} times). `;
      
      const moodContext = `Recent moods: ${recentMoods.map(m => 
        `${m.mood} (intensity: ${m.intensity || 5}) on ${new Date(m.date).toLocaleDateString()}`
      ).join(', ')}. ${moodTrend}${moodSummary}`;
    } else {
      moodSummary = 'I don\'t have any mood records yet.';
    }
    
    // Enhanced habit context with completion stats
    let habitSummary = '';
    if (context?.habits?.length > 0) {
      const completedCount = context.habits.filter(h => h.completed).length;
      const completionRate = Math.round((completedCount / context.habits.length) * 100);
      
      habitSummary = `You've completed ${completedCount} out of ${context.habits.length} habits (${completionRate}% completion rate). `;
      
      const habitContext = `Your current habits: ${context.habits.map(h => 
        `${h.name} (${h.completed ? 'completed today' : 'not completed today'})`
      ).join(', ')}. ${habitSummary}`;
    } else {
      habitSummary = 'You haven\'t set up any habits yet.';
    }
    
    // Enhanced goal context with progress
    let goalSummary = '';
    if (context?.goals?.length > 0) {
      const averageProgress = Math.round(
        context.goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / context.goals.length
      );
      
      goalSummary = `You're making ${
        averageProgress < 30 ? 'initial' : 
        averageProgress < 70 ? 'steady' : 'excellent'
      } progress on your goals (${averageProgress}% average completion). `;
      
      const goalContext = `Your goals: ${context.goals.map(g => 
        `${g.title} (${g.progress || 0}% complete)`
      ).join(', ')}. ${goalSummary}`;
    } else {
      goalSummary = 'You haven\'t set any goals yet.';
    }

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
        "model": "anthropic/claude-3-haiku",
        "messages": [
          {
            "role": "system",
            "content": `You are 'Mindset Coach', an accountability coach in a mood tracking app. Your responses should be concise (1-3 sentences), direct but compassionate. Focus on practical steps users can take.

When responding, specifically reference their mood trends and patterns. If their mood is declining, offer targeted support and practical actions. If improving, offer reinforcement and ways to maintain progress.

Here's a summary of the user's current state:
- Mood trends: ${moodTrend}${moodSummary}
- Habits: ${habitSummary}
- Goals: ${goalSummary}

Use a firm but supportive tone. Refer to their tracked data specifically. Never give medical advice.`
          },
          {
            "role": "user",
            "content": `My message to you: ${message}`
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
    
    return res.json({ 
      response: responseText, 
      action,
      source: 'openrouter'
    });
  } catch (error) {
    console.error('AI Response Error:', error);
    
    // Better error handling instead of using fallback responses
    return res.status(500).json({
      response: "I'm having trouble connecting right now. Please try again shortly.",
      error: error.message,
      source: 'error'
    });
  }
};