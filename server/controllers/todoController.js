import Todo from '../models/Todo.js';
import Progress from '../models/Progress.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Get all todos for user
export const getTodos = async (req, res) => {
  try {
    // Get user ID from auth (required)
    const userId = req.userId;
    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error getting todos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new todo
export const addTodo = async (req, res) => {
  try {
    console.log('addTodo called with body:', req.body);
    // Get user ID from auth (required)
    const userId = req.userId;
    const todoData = {
      ...req.body,
      user: userId
    };
    
    console.log('Creating todo with data:', todoData);
    const todo = new Todo(todoData);
    await todo.save();
    
    console.log('Todo saved successfully:', todo);
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate personalized todo recommendations based on user data
export const generateTodoRecommendations = async (req, res) => {
  try {
    const { moods, habits, goals, wellnessScore, currentTodos } = req.body;

    // Analyze user patterns for personalized recommendations
    let userProfile = '';
    let wellnessAssessment = '';

    if (moods && moods.length > 0) {
      const recentMoods = moods.slice(0, 7);
      const moodCounts = recentMoods.reduce((acc, mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
      }, {});
      
      const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
        moodCounts[a[0]] > moodCounts[b[0]] ? a : b
      )[0];

      userProfile += `Recent mood pattern: ${dominantMood}. `;
      
      if (wellnessScore < 5) {
        wellnessAssessment += '⚠️ User needs intervention support. ';
      } else if (wellnessScore < 7) {
        wellnessAssessment += '📊 User has mixed wellness patterns. ';
      } else {
        wellnessAssessment += '✅ User maintains good wellness levels. ';
      }
    }

    if (habits && habits.length > 0) {
      const activeHabits = habits.filter(h => !h.completed).length;
      const completedHabits = habits.filter(h => h.completed).length;
      userProfile += `Active habits: ${activeHabits}, completed: ${completedHabits}. `;
    }

    if (goals && goals.length > 0) {
      const activeGoals = goals.filter(g => !g.completed).length;
      const completedGoals = goals.filter(g => g.completed).length;
      userProfile += `Active goals: ${activeGoals}, completed: ${completedGoals}. `;
    }

    // Check if API key is configured
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here' || OPENROUTER_API_KEY === '') {
      // Fallback todos based on wellness score
      const fallbackTodos = [];
      
      if (wellnessScore < 5) {
        fallbackTodos.push(
          {
            title: 'Take 10 deep breaths',
            description: 'Immediate stress relief technique to calm your nervous system',
            category: 'mindfulness',
            priority: 'high',
            estimatedTime: '2 minutes',
            dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            wellnessImpact: 'positive'
          },
          {
            title: 'Go for a 15-minute walk',
            description: 'Physical activity releases endorphins and improves mood',
            category: 'exercise',
            priority: 'high',
            estimatedTime: '15 minutes',
            dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
            wellnessImpact: 'positive'
          },
          {
            title: 'Call a friend or family member',
            description: 'Social connection is crucial for mental health',
            category: 'social',
            priority: 'medium',
            estimatedTime: '10 minutes',
            dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
            wellnessImpact: 'positive'
          }
        );
      } else {
        fallbackTodos.push(
          {
            title: 'Practice gratitude',
            description: 'Write down 3 things you\'re grateful for today',
            category: 'mindfulness',
            priority: 'medium',
            estimatedTime: '5 minutes',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            wellnessImpact: 'positive'
          },
          {
            title: 'Try a new hobby',
            description: 'Engage in a creative or learning activity',
            category: 'self-care',
            priority: 'low',
            estimatedTime: '30 minutes',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            wellnessImpact: 'positive'
          }
        );
      }

      return res.json({
        todos: fallbackTodos,
        message: 'Generated personalized todos based on your wellness patterns'
      });
    }

    // AI-powered todo generation
    const prompt = `Generate personalized wellness tasks based on this user data:

User Profile: ${userProfile}
Wellness Assessment: ${wellnessAssessment}
Current Wellness Score: ${wellnessScore}/10
Current Todos: ${currentTodos ? currentTodos.length : 0} active

Generate 3-5 personalized wellness tasks that:
1. Address the user's specific wellness needs
2. Are actionable and time-bound
3. Include variety (mindfulness, exercise, social, self-care)
4. Match their current wellness level
5. Have realistic time estimates

Format as JSON array with objects containing:
- title (string)
- description (string) 
- category (string: mindfulness, exercise, social, self-care)
- priority (string: high, medium, low)
- estimatedTime (string)
- dueDate (ISO string)
- wellnessImpact (string: positive, neutral)

Focus on immediate, actionable tasks that will improve their wellness.`;

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'MoodTracker Todo Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are an AI wellness coach that generates personalized, actionable wellness tasks. Always respond with valid JSON arrays.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    try {
      const todos = JSON.parse(aiResponse);
      res.json({
        todos: todos,
        message: 'AI-generated personalized wellness tasks'
      });
    } catch (parseError) {
      console.error('Failed to parse AI todo response:', parseError);
      res.status(500).json({ 
        error: 'Failed to generate AI todos',
        todos: [],
        message: 'Using fallback recommendations'
      });
    }
  } catch (error) {
    console.error('Todo recommendations error:', error);
    res.status(500).json({ 
      error: 'Failed to generate todo recommendations',
      todos: [],
      message: 'Unable to generate recommendations at this time'
    });
  }
};

// Track todo completion and analyze impact
export const trackTodoCompletion = async (req, res) => {
  try {
    const { todoId, completedAt, userContext } = req.body;
    const defaultUserId = '000000000000000000000000';

    // Find and update the todo
    const todo = await Todo.findOne({ _id: todoId, user: defaultUserId });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Toggle completion status
    todo.completed = !todo.completed;
    if (todo.completed) {
      todo.completedAt = new Date();
    } else {
      todo.completedAt = null;
    }
    await todo.save();

    // Award points if completing (not uncompleting)
    let pointsEarned = 0;
    let leveledUp = false;
    let newLevel = 0;

    if (todo.completed) {
      // Get user progress
      let progress = await Progress.findOne({ user: defaultUserId });
      if (!progress) {
        progress = new Progress({ user: defaultUserId });
      }

      // Award points
      pointsEarned = todo.pointsReward || 10;
      const oldLevel = progress.level;
      progress.points += pointsEarned;
      newLevel = Math.floor(progress.points / 100) + 1;
      progress.level = newLevel;
      leveledUp = newLevel > oldLevel;

      // Add to point history
      progress.pointsHistory.push({
        points: pointsEarned,
        reason: 'todo_completion',
        description: `Completed: ${todo.title}`,
        date: new Date()
      });

      await progress.save();
    }

    // Analyze completion impact
    const completionAnalysis = {
      message: todo.completed ? 'Great job completing your wellness task!' : 'Task marked as incomplete',
      pointsEarned: pointsEarned,
      leveledUp: leveledUp,
      newLevel: newLevel,
      nextSteps: [
        'Consider adding another wellness activity today',
        'Reflect on how this task made you feel',
        'Share your achievement with someone supportive'
      ],
      wellnessImpact: 'positive'
    };

    // If user has low wellness score, provide additional support
    if (userContext && userContext.wellnessScore < 5) {
      completionAnalysis.message = 'Excellent! Every small step counts toward your wellness.';
      completionAnalysis.nextSteps.push('Consider talking with your wellness coach for additional support');
    }

    res.json(completionAnalysis);
  } catch (error) {
    console.error('Todo completion tracking error:', error);
    res.status(500).json({ 
      error: 'Failed to track todo completion',
      message: 'Completion recorded successfully'
    });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    // Get user ID from auth (required)
    const userId = req.userId;

    const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 