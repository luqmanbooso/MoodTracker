import React, { useState, useEffect } from 'react';

const TodoList = ({ todos, moods, habits, goals, wellnessScore, setView, onTodoComplete }) => {
  const [showCoachPrompt, setShowCoachPrompt] = useState(false);
  const [needsIntervention, setNeedsIntervention] = useState(false);

  // Check if user needs intervention
  useEffect(() => {
    if (wellnessScore < 5) {
      setNeedsIntervention(true);
      setShowCoachPrompt(true);
    }
  }, [wellnessScore]);

  // Generate personalized todos - this should be handled by parent
  const generatePersonalizedTodos = async () => {
    // This functionality should be moved to parent component
    console.log('Generate todos - should be handled by parent');
  };

  // Complete a todo and track progress
  const handleTodoComplete = async (todoId) => {
    // Use parent's onTodoComplete function
    onTodoComplete(todoId);
  };

  // Delete a todo - use parent's function
  const handleDeleteTodo = (todoId) => {
    // This would need to be passed as a prop from parent
    console.log('Delete todo:', todoId);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'wellness': return '💪';
      case 'mindfulness': return '🧘‍♀️';
      case 'social': return '👥';
      case 'work': return '💼';
      case 'self-care': return '💆‍♀️';
      case 'exercise': return '🏃‍♀️';
      case 'nutrition': return '🥗';
      default: return '📝';
    }
  };

  // Calculate completion rate
  const completionRate = todos.length > 0 ? 
    (todos.filter(todo => todo.completed).length / todos.length * 100).toFixed(1) : 0;

  // Get wellness impact
  const wellnessImpact = todos.filter(todo => todo.completed && todo.wellnessImpact === 'positive').length;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Personalized Wellness Tasks</h2>
          <p className="text-slate-400">Track your progress and build healthy habits</p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{todos.length}</div>
          <div className="text-sm text-slate-400">Total Tasks</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{completionRate}%</div>
          <div className="text-sm text-slate-400">Completion Rate</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{wellnessImpact}</div>
          <div className="text-sm text-slate-400">Wellness Impact</div>
        </div>
      </div>

      {/* Coach Prompt for Low Wellness */}
      {showCoachPrompt && needsIntervention && (
        <div className="mb-6 bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Wellness Support Needed</h3>
              <p className="text-amber-200 text-sm">
                Your wellness score is {wellnessScore}/5. Let's work together to improve your mental health.
              </p>
            </div>
            <button
              onClick={() => setView('chat')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              Talk with Coach
            </button>
          </div>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <div className="text-4xl mb-4">📝</div>
            <p>No tasks yet. Log a mood to get personalized recommendations!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-slate-700/50 rounded-lg p-4 border-l-4 ${getPriorityColor(todo.priority)} transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => handleTodoComplete(todo._id || todo.id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-400 hover:border-emerald-400'
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{getCategoryIcon(todo.category)}</span>
                      <h3 className={`font-medium ${todo.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {todo.title}
                      </h3>
                      {todo.aiGenerated && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          AI
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-sm ${todo.completed ? 'text-slate-500' : 'text-slate-300'}`}>
                      {todo.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                      <span>⏱️ {todo.estimatedTime}</span>
                      <span className={`px-2 py-1 rounded ${
                        todo.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        todo.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {todo.priority} priority
                      </span>
                      {todo.dueDate && (
                        <span>📅 {new Date(todo.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteTodo(todo._id || todo.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors ml-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList; 