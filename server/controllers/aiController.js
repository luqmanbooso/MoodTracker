import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Check if API key is configured
if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here' || OPENROUTER_API_KEY === '') {
  console.warn('⚠️ OpenRouter API key not configured. AI features will be limited.');
}

// Enhanced AI controller for truly personalized wellness coaching
export const getAIResponse = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `You are a compassionate AI wellness coach. The user says: "${message}"

Context: ${context ? JSON.stringify(context) : 'No additional context provided'}

Provide a helpful, supportive response that focuses on mental health and wellness. Be encouraging, practical, and evidence-based. Keep your response conversational and under 200 words.`;

    // Check if API key is configured
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here' || OPENROUTER_API_KEY === '') {
      return res.json({
        response: "I'm your AI wellness coach! I'm here to support your mental health journey. How can I help you today? You can ask me about stress management, sleep, mood, habits, or just share how you're feeling.",
        source: 'fallback',
        suggestions: ['Help me with stress', 'I need sleep tips', 'How can I improve my mood?', 'Help me build better habits']
      });
    }

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'MoodTracker Wellness Coach'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate AI wellness coach focused on mental health support. Provide helpful, practical advice while being encouraging and supportive.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    res.json({
      response: aiResponse,
      source: 'openrouter'
    });
  } catch (error) {
    console.error('AI response error:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI response'
    });
  }
};

// Generate truly personalized wellness response with examination and plan creation
export const generateWellnessResponse = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Analyze user context for deep personalization
    const userContext = context || {};
    const moodHistory = userContext.moods || [];
    const habits = userContext.habits || [];
    const goals = userContext.goals || [];
    const recentActivity = userContext.recentActivity || [];
    const wellnessScore = userContext.wellnessScore || 0;
    const interactionCount = userContext.interactionCount || 0;
    let needsIntervention = userContext.needsIntervention || false;

    // Create comprehensive user profile and wellness assessment
    let userProfile = '';
    let wellnessAssessment = '';
    let interventionType = '';

    if (moodHistory.length > 0) {
      const recentMoods = moodHistory.slice(0, 7);
      const moodCounts = recentMoods.reduce((acc, mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
      }, {});
      
      const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
        moodCounts[a[0]] > moodCounts[b[0]] ? a : b
      )[0];

      const moodScores = { thriving: 5, good: 4, neutral: 3, struggling: 2, overwhelmed: 1 };
      const avgScore = recentMoods.reduce((sum, mood) => 
        sum + (moodScores[mood.mood] || 3), 0
      ) / recentMoods.length;

      userProfile += `Recent mood pattern: ${dominantMood} (avg score: ${avgScore.toFixed(1)}/5). `;
      
      // Wellness assessment and intervention detection
      if (avgScore < 5) {
        needsIntervention = true;
        interventionType = 'mood_support';
        wellnessAssessment += '⚠️ I notice you\'ve been experiencing some challenges lately. ';
      } else if (avgScore < 7) {
        wellnessAssessment += '📊 Your wellness has been mixed lately. ';
      } else {
        wellnessAssessment += '✅ You\'ve been maintaining good wellness levels. ';
      }
    }

    if (habits.length > 0) {
      const activeHabits = habits.filter(h => !h.completed).length;
      const completedHabits = habits.filter(h => h.completed).length;
      userProfile += `Active habits: ${activeHabits}, completed: ${completedHabits}. `;
      
      if (completedHabits < activeHabits && needsIntervention) {
        interventionType = 'habit_support';
        wellnessAssessment += '🎯 I see you\'re struggling with habit completion. ';
      } else if (completedHabits > activeHabits) {
        wellnessAssessment += '🎯 You\'re doing great with habit completion! ';
      }
    }

    if (goals.length > 0) {
      const activeGoals = goals.filter(g => !g.completed).length;
      const completedGoals = goals.filter(g => g.completed).length;
      userProfile += `Active goals: ${activeGoals}, completed: ${completedGoals}. `;
      
      if (completedGoals === 0 && activeGoals > 0 && needsIntervention) {
        interventionType = 'goal_support';
        wellnessAssessment += '🎯 I notice you haven\'t completed any goals yet. ';
      } else if (completedGoals > 0) {
        wellnessAssessment += '🎯 You\'ve achieved some goals - great work! ';
      }
    }

    // Check if API key is configured
    console.log('API Key check:', { 
      hasKey: !!OPENROUTER_API_KEY, 
      keyValue: OPENROUTER_API_KEY, 
      keyLength: OPENROUTER_API_KEY?.length 
    });
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here' || OPENROUTER_API_KEY === '' || OPENROUTER_API_KEY.includes('8242eba1a0e41486932a41a7019c2d930ec480e85262f5bb3d04d2660d453632')) {
      const fallbackResponse = needsIntervention 
        ? `I can see you're going through a challenging time. Your wellness score is ${wellnessScore.toFixed(1)}/5, and this is interaction ${interactionCount}. 

Based on your patterns, I want to help you create a personalized support plan. Let's work together to understand what's happening and develop strategies that work for you.

What would you like to talk about first?`
        : `I'm your AI wellness coach! I'm here to support your mental health journey. How can I help you today? You can ask me about stress management, sleep, mood, habits, or just share how you're feeling.`;

      console.log('Using fallback response');
      return res.json({
        response: fallbackResponse,
        suggestions: needsIntervention 
          ? ['Tell me about my patterns', 'Help me with coping strategies', 'Create a wellness plan', 'I need immediate support']
          : ['Help me with stress', 'I need sleep tips', 'How can I improve my mood?', 'Help me build better habits'],
        needsIntervention: needsIntervention,
        interventionType: interventionType,
        wellnessAssessment: wellnessAssessment,
        source: 'fallback'
      });
    }

    // Create highly personalized prompt with intervention logic
    const prompt = `You are an AI wellness coach with deep expertise in mental health, psychology, and wellness practices. You are a STRONG ALLY who examines users and creates personalized plans.

USER CONTEXT:
- Message: "${message}"
- User Profile: ${userProfile}
- Wellness Assessment: ${wellnessAssessment}
- Recent Activity: ${recentActivity.length > 0 ? recentActivity.map(a => a.mood).join(', ') : 'None'}
- Wellness Score: ${wellnessScore.toFixed(1)}/5
- Interaction Count: ${interactionCount}
- Needs Intervention: ${needsIntervention}
- Intervention Type: ${interventionType}

TASK: Provide a highly personalized, compassionate response that:
1. Acknowledges their specific situation and context
2. Offers evidence-based, practical advice tailored to their profile
3. Considers their mood patterns, habits, and goals
4. Provides 2-3 specific, actionable suggestions
5. Maintains a warm, encouraging tone
6. Offers 2-3 relevant follow-up questions they might want to ask

${needsIntervention ? `IMPORTANT: This user needs intervention (wellness score: ${wellnessScore.toFixed(1)}/5). This is interaction ${interactionCount}. Create a personalized wellness plan with:
- Immediate actions they can take right now
- Short-term strategies (next 3-7 days)
- Long-term wellness goals
- Specific habit recommendations
- Progress tracking suggestions
- Focus on building trust and rapport` : ''}

RESPONSE FORMAT:
- Start with empathy and understanding
- Provide personalized insights based on their data
- Give specific, actionable advice
- ${needsIntervention ? 'Include a structured wellness plan' : ''}
- End with relevant follow-up questions

Keep response under 400 words and make it feel like a real conversation with someone who knows them well.`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'MoodTracker Wellness Coach'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate AI wellness coach with deep expertise in mental health, psychology, and wellness practices. You are a STRONG ALLY who examines users and creates personalized plans. Provide highly personalized, evidence-based advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Extract suggestions from the response
    const suggestions = extractPersonalizedSuggestions(aiResponse, message);

    res.json({
      response: aiResponse,
      suggestions: suggestions,
      needsIntervention: needsIntervention,
      interventionType: interventionType,
      wellnessAssessment: wellnessAssessment,
      source: 'openrouter'
    });
  } catch (error) {
    console.error('Wellness response error:', error);
    res.status(500).json({ 
      error: 'Failed to generate wellness response'
    });
  }
};

// Generate intelligent mood insights with intervention recommendations
export const generateMoodInsights = async (req, res) => {
  try {
    const { moods, habits, goals } = req.body;

    if (!moods || moods.length === 0) {
      return res.json({
        summary: "Start tracking your moods to get personalized insights!",
        patterns: [],
        recommendations: [],
        needsIntervention: false
      });
    }

    const recentMoods = moods.slice(0, 14);
    const moodData = recentMoods.map(m => ({
      mood: m.mood,
      intensity: m.intensity,
      timestamp: m.timestamp,
      activities: m.activities || [],
      triggers: m.triggers || []
    }));

    // Calculate wellness score and determine intervention needs
    const moodScores = { thriving: 5, good: 4, neutral: 3, struggling: 2, overwhelmed: 1 };
    const avgScore = recentMoods.reduce((sum, mood) => 
      sum + (moodScores[mood.mood] || 3), 0
    ) / recentMoods.length;

    const needsIntervention = avgScore < 5;
    const interventionLevel = avgScore < 3 ? 'high' : avgScore < 5 ? 'medium' : 'low';

    // Check if API key is configured
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here' || OPENROUTER_API_KEY === '') {
      // Generate fallback insights based on mood data
      const fallbackInsights = {
        summary: `Based on your mood data, you have an average wellness score of ${avgScore.toFixed(1)}/5. ${needsIntervention ? 'I notice you could benefit from some additional support.' : 'You\'re maintaining good wellness levels.'}`,
        patterns: [
          `Your recent mood pattern shows ${avgScore < 3 ? 'some challenges' : avgScore < 4 ? 'mixed patterns' : 'positive trends'}`,
          `You have ${recentMoods.length} mood entries tracked so far`,
          needsIntervention ? 'Consider focusing on self-care activities' : 'Keep up your positive wellness practices'
        ],
        recommendations: [
          {
            title: 'Practice deep breathing',
            description: 'Take 5 minutes to focus on your breath',
            category: 'mindfulness',
            priority: 'medium',
            estimatedTime: '5 minutes',
            pointsReward: 10
          },
          {
            title: 'Go for a walk',
            description: 'Physical activity can improve your mood',
            category: 'exercise',
            priority: 'medium',
            estimatedTime: '15 minutes',
            pointsReward: 15
          },
          {
            title: 'Connect with someone',
            description: 'Social connection is important for mental health',
            category: 'social',
            priority: 'low',
            estimatedTime: '10 minutes',
            pointsReward: 10
          }
        ],
        needsIntervention: needsIntervention,
        interventionLevel: interventionLevel
      };
      return res.json(fallbackInsights);
    }

    const prompt = `Analyze this mood data and provide deep, personalized insights with intervention recommendations:

Mood Data: ${JSON.stringify(moodData)}
Habits: ${JSON.stringify(habits || [])}
Goals: ${JSON.stringify(goals || [])}
Average Wellness Score: ${avgScore.toFixed(1)}/5
Needs Intervention: ${needsIntervention}
Intervention Level: ${interventionLevel}

Provide:
1. A personalized summary of their emotional patterns
2. 3-4 specific insights about their mental health journey
3. 3-4 actionable recommendations based on their data
4. Identify any concerning patterns or positive trends
5. ${needsIntervention ? 'Create a structured intervention plan with immediate, short-term, and long-term actions' : 'Suggest wellness maintenance strategies'}

Format as JSON with keys: summary, patterns (array), recommendations (array), interventionPlan (object with immediate, shortTerm, longTerm arrays), needsIntervention (boolean)`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'MoodTracker Insights'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are an AI wellness analyst. Analyze mood data and provide insights with intervention plans in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    try {
      const insights = JSON.parse(aiResponse);
      insights.needsIntervention = needsIntervention;
      insights.interventionLevel = interventionLevel;
      res.json(insights);
    } catch (parseError) {
      res.status(500).json({ 
        error: 'Failed to parse AI insights response'
      });
    }
  } catch (error) {
    console.error('Mood insights error:', error);
    res.status(500).json({ 
      error: 'Failed to generate mood insights',
      summary: "Start tracking your moods to get personalized insights!",
      patterns: [],
      recommendations: [],
      needsIntervention: false
    });
  }
};

// Generate personalized recommendations with intervention focus
export const generateRecommendations = async (req, res) => {
  try {
    const { currentMood, moodHistory, habits, goals, triggers, activities } = req.body;

    // Calculate wellness score
    const moodScores = { thriving: 5, good: 4, neutral: 3, struggling: 2, overwhelmed: 1 };
    const avgScore = moodHistory.length > 0 ? 
      moodHistory.reduce((sum, mood) => sum + (moodScores[mood.mood] || 3), 0) / moodHistory.length : 3;

    const needsIntervention = avgScore < 5;

    const prompt = `Generate highly personalized wellness recommendations with intervention focus based on:

Current Mood: ${currentMood}
Mood History: ${JSON.stringify(moodHistory || [])}
Habits: ${JSON.stringify(habits || [])}
Goals: ${JSON.stringify(goals || [])}
Triggers: ${JSON.stringify(triggers || [])}
Activities: ${JSON.stringify(activities || [])}
Average Wellness Score: ${avgScore.toFixed(1)}/5
Needs Intervention: ${needsIntervention}

Provide:
1. 3-4 immediate actions they can take right now
2. 3-4 long-term strategies for improvement
3. 2-3 habit suggestions based on their patterns
4. Consider their current state and what would be most helpful
5. ${needsIntervention ? 'Create a crisis intervention plan with immediate support strategies' : 'Focus on wellness maintenance and growth'}

Format as JSON with keys: immediate (array), longTerm (array), habits (array), interventionPlan (object if needed)`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'MoodTracker Recommendations'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are an AI wellness coach. Generate personalized recommendations with intervention focus in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    try {
      const recommendations = JSON.parse(aiResponse);
      recommendations.needsIntervention = needsIntervention;
      recommendations.avgScore = avgScore;
      res.json(recommendations);
    } catch (parseError) {
      res.status(500).json({ 
        error: 'Failed to parse AI recommendations response'
      });
    }
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      immediate: [],
      longTerm: [],
      habits: []
    });
  }
};

// Generate weekly wellness summary with intervention tracking
export const generateWeeklySummary = async (req, res) => {
  try {
    const { moods, habits, goals } = req.body;

    const weeklyMoods = moods ? moods.slice(0, 7) : [];
    const moodData = weeklyMoods.map(m => ({
      mood: m.mood,
      intensity: m.intensity,
      timestamp: m.timestamp
    }));

    // Calculate weekly wellness score
    const moodScores = { thriving: 5, good: 4, neutral: 3, struggling: 2, overwhelmed: 1 };
    const avgScore = weeklyMoods.length > 0 ? 
      weeklyMoods.reduce((sum, mood) => sum + (moodScores[mood.mood] || 3), 0) / weeklyMoods.length : 3;

    const needsIntervention = avgScore < 5;
    const improvementNeeded = avgScore < 7;

    const prompt = `Generate a comprehensive weekly wellness summary with intervention tracking based on:

Weekly Moods: ${JSON.stringify(moodData)}
Habits: ${JSON.stringify(habits || [])}
Goals: ${JSON.stringify(goals || [])}
Average Weekly Score: ${avgScore.toFixed(1)}/5
Needs Intervention: ${needsIntervention}
Improvement Needed: ${improvementNeeded}

Provide:
1. A personalized summary of their week
2. 3-4 highlights or positive moments
3. 3-4 challenges or areas for improvement
4. 3-4 specific recommendations for next week
5. Consider their progress and what would help them most
6. ${needsIntervention ? 'Create a structured intervention plan for the coming week' : improvementNeeded ? 'Suggest wellness improvement strategies' : 'Focus on maintaining positive momentum'}

Format as JSON with keys: summary, highlights (array), challenges (array), recommendations (array), interventionPlan (object if needed)`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'MoodTracker Weekly Summary'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are an AI wellness coach. Generate weekly summaries with intervention tracking in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    try {
      const summary = JSON.parse(aiResponse);
      summary.needsIntervention = needsIntervention;
      summary.avgScore = avgScore;
      res.json(summary);
    } catch (parseError) {
      res.status(500).json({ 
        error: 'Failed to parse AI weekly summary response'
      });
    }
  } catch (error) {
    console.error('Weekly summary error:', error);
    res.status(500).json({ 
      error: 'Failed to generate weekly summary',
      summary: "Start your wellness journey this week!",
      highlights: [],
      challenges: [],
      recommendations: [],
      needsIntervention: false
    });
  }
};

// Generate habit suggestions with intervention focus
export const generateHabitSuggestions = async (req, res) => {
  try {
    const { currentHabits, goals, moodPatterns, lifestyle } = req.body;

    // Determine if user needs intervention based on mood patterns
    const needsIntervention = moodPatterns && moodPatterns.some(pattern => 
      pattern.mood === 'struggling' || pattern.mood === 'overwhelmed'
    );

    const prompt = `Suggest personalized wellness habits with intervention focus based on:

Current Habits: ${JSON.stringify(currentHabits || [])}
Goals: ${JSON.stringify(goals || [])}
Mood Patterns: ${JSON.stringify(moodPatterns || [])}
Lifestyle: ${JSON.stringify(lifestyle || {})}
Needs Intervention: ${needsIntervention}

Provide 3-4 habit suggestions organized by category (e.g., Crisis Support, Mindfulness, Physical Wellness, Social, etc.).
Each habit should include name, description, difficulty level, and intervention priority.

Format as JSON array with objects containing: category, habits (array with name, description, difficulty, priority)`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'MoodTracker Habit Suggestions'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are an AI wellness coach. Suggest personalized habits with intervention focus in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    try {
      const suggestions = JSON.parse(aiResponse);
      suggestions.needsIntervention = needsIntervention;
      res.json(suggestions);
    } catch (parseError) {
      res.status(500).json({ 
        error: 'Failed to parse AI habit suggestions response'
      });
    }
  } catch (error) {
    console.error('Habit suggestions error:', error);
    res.status(500).json({ 
      error: 'Failed to generate habit suggestions',
      suggestions: []
    });
  }
};

// Generate goal recommendations with intervention support
export const generateGoalRecommendations = async (req, res) => {
  try {
    const { currentGoals, moodHistory, habits, interests } = req.body;

    // Determine if user needs intervention based on mood history
    const moodScores = { thriving: 5, good: 4, neutral: 3, struggling: 2, overwhelmed: 1 };
    const avgScore = moodHistory.length > 0 ? 
      moodHistory.reduce((sum, mood) => sum + (moodScores[mood.mood] || 3), 0) / moodHistory.length : 3;

    const needsIntervention = avgScore < 5;

    const prompt = `Suggest personalized wellness goals with intervention support based on:

Current Goals: ${JSON.stringify(currentGoals || [])}
Mood History: ${JSON.stringify(moodHistory || [])}
Habits: ${JSON.stringify(habits || [])}
Interests: ${JSON.stringify(interests || [])}
Average Wellness Score: ${avgScore.toFixed(1)}/5
Needs Intervention: ${needsIntervention}

Provide 3-4 goal suggestions organized by category (e.g., Crisis Management, Mental Health, Lifestyle, Social, etc.).
Each goal should include title, description, and intervention priority.

Format as JSON array with objects containing: category, goals (array with title, description, priority)`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'MoodTracker Goal Recommendations'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are an AI wellness coach. Suggest personalized goals with intervention support in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    try {
      const recommendations = JSON.parse(aiResponse);
      recommendations.needsIntervention = needsIntervention;
      recommendations.avgScore = avgScore;
      res.json(recommendations);
    } catch (parseError) {
      res.status(500).json({ 
        error: 'Failed to parse AI goal recommendations response'
      });
    }
  } catch (error) {
    console.error('Goal recommendations error:', error);
    res.status(500).json({ 
      error: 'Failed to generate goal recommendations',
      recommendations: []
    });
  }
};

// Helper function to extract personalized suggestions from AI response
function extractPersonalizedSuggestions(response, originalMessage) {
  const suggestions = [];
  
  // Look for common suggestion patterns
  const patterns = [
    /(?:Would you like to|Can I help you|Try asking me about|You might want to|Consider asking):\s*([^.!?]+)/gi,
    /(?:Suggestions?|Questions?|You can ask):\s*([^.!?]+)/gi,
    /(?:What about|How about|Maybe try):\s*([^.!?]+)/gi
  ];

  patterns.forEach(pattern => {
    const matches = response.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const suggestion = match.replace(pattern, '$1').trim();
        if (suggestion && suggestion.length > 10) {
          suggestions.push(suggestion);
        }
      });
    }
  });

  // If no suggestions found, provide context-aware defaults
  if (suggestions.length === 0) {
    const lowerMessage = originalMessage.toLowerCase();
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
      suggestions.push('Guide me through deep breathing', 'Help me with grounding', 'What causes stress?');
    } else if (lowerMessage.includes('sleep')) {
      suggestions.push('Create a bedtime routine', 'Sleep meditation', 'Sleep tracking tips');
    } else if (lowerMessage.includes('mood') || lowerMessage.includes('feeling')) {
      suggestions.push('I need immediate help', 'How can I improve my mood?', 'What should I do right now?');
    } else if (lowerMessage.includes('habit') || lowerMessage.includes('goal')) {
      suggestions.push('Help me start a new habit', 'I need motivation', 'How do I stick to goals?');
    } else {
      suggestions.push('Stress management', 'Sleep tips', 'Mood boosters', 'Habit building');
    }
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
}