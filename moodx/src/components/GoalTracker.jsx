import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const GoalTracker = ({ goals = [], onAddGoal, onUpdateGoal, onDeleteGoal }) => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    targetDate: '',
    milestones: [''],
    priority: 'medium'
  });
  
  const goalCategories = [
    { id: 'personal', name: 'Personal Growth', icon: '🌱' },
    { id: 'career', name: 'Career', icon: '💼' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'financial', name: 'Financial', icon: '💰' },
    { id: 'skills', name: 'Skills', icon: '🔧' },
    { id: 'relationships', name: 'Relationships', icon: '👥' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMilestoneChange = (index, value) => {
    setNewGoal(prev => {
      const milestones = [...prev.milestones];
      milestones[index] = value;
      return { ...prev, milestones };
    });
  };
  
  const addMilestone = () => {
    setNewGoal(prev => ({
      ...prev,
      milestones: [...prev.milestones, '']
    }));
  };
  
  const removeMilestone = (index) => {
    setNewGoal(prev => {
      const milestones = prev.milestones.filter((_, i) => i !== index);
      return { ...prev, milestones };
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter empty milestones
    const milestones = newGoal.milestones.filter(m => m.trim());
    
    onAddGoal({
      ...newGoal,
      milestones,
      id: Date.now().toString(),
      createdAt: new Date(),
      progress: 0,
      completed: false
    });
    
    // Reset form
    setNewGoal({
      title: '',
      description: '',
      category: 'personal',
      targetDate: '',
      milestones: [''],
      priority: 'medium'
    });
    setIsAdding(false);
  };
  
  const calculateProgress = (goal) => {
    if (!goal.milestones || goal.milestones.length === 0) return 0;
    
    const completedMilestones = goal.milestones.filter(m => m.completed).length;
    return Math.round((completedMilestones / goal.milestones.length) * 100);
  };
  
  const toggleMilestone = (goalId, milestoneIndex) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const updatedMilestones = goal.milestones.map((milestone, index) => {
      if (index === milestoneIndex) {
        return { ...milestone, completed: !milestone.completed };
      }
      return milestone;
    });
    
    const progress = (updatedMilestones.filter(m => m.completed).length / updatedMilestones.length) * 100;
    
    onUpdateGoal({
      ...goal,
      milestones: updatedMilestones,
      progress,
      completed: progress === 100
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${theme.textColor}`}>
          Meaningful Goals
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className={`px-3 py-1 rounded bg-${theme.primaryColor}-600 text-white hover:bg-${theme.primaryColor}-700 transition-colors`}
          >
            Set New Goal
          </button>
        )}
      </div>
      
      {isAdding ? (
        <div className={`bg-${theme.cardBg} p-5 rounded-lg shadow-md mb-6`}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Goal Title
              </label>
              <input
                type="text"
                name="title"
                value={newGoal.title}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
                placeholder="What do you want to accomplish?"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={newGoal.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
                >
                  {goalCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  name="targetDate"
                  value={newGoal.targetDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Why this matters (Your purpose)
              </label>
              <textarea
                name="description"
                value={newGoal.description}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
                placeholder="Why is this goal important to you?"
                rows="2"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Milestones
              </label>
              <div className="space-y-2">
                {newGoal.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={milestone}
                      onChange={(e) => handleMilestoneChange(index, e.target.value)}
                      className="flex-1 p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
                      placeholder={`Milestone ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      disabled={newGoal.milestones.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMilestone}
                className="mt-2 text-blue-600 flex items-center hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Add Another Milestone
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={newGoal.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
              >
                <option value="high">High - Critical</option>
                <option value="medium">Medium - Important</option>
                <option value="low">Low - Eventually</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-${theme.primaryColor}-600 text-white rounded hover:bg-${theme.primaryColor}-700 transition-colors`}
              >
                Create Goal
              </button>
            </div>
          </form>
        </div>
      ) : goals.length === 0 ? (
        <div className={`bg-${theme.cardBg} p-6 rounded-lg shadow-md text-center mb-6`}>
          <p className="text-gray-600 mb-4">No goals set yet. Define clear targets to move your life forward.</p>
          <button
            onClick={() => setIsAdding(true)}
            className={`px-4 py-2 bg-${theme.primaryColor}-600 text-white rounded hover:bg-${theme.primaryColor}-700 transition-colors`}
          >
            Set Your First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-6 mb-6">
          {goals.map(goal => (
            <div 
              key={goal.id} 
              className={`bg-${theme.cardBg} rounded-lg shadow-md overflow-hidden`}
            >
              <div className={`p-4 border-b border-gray-200`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">
                      {goalCategories.find(c => c.id === goal.category)?.icon}
                    </span>
                    <h3 className="font-semibold">{goal.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      goal.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                    </span>
                    {goal.targetDate && (
                      <span className="text-xs text-gray-500">
                        Due: {new Date(goal.targetDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                {goal.description && (
                  <p className="text-sm text-gray-600 mt-2">{goal.description}</p>
                )}
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`bg-${theme.primaryColor}-600 h-2.5 rounded-full`}
                      style={{ width: `${goal.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{goal.progress || 0}% complete</span>
                    <span>{goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones:</h4>
                <ul className="space-y-2">
                  {goal.milestones.map((milestone, index) => (
                    <li key={index} className="flex items-start">
                      <button
                        onClick={() => toggleMilestone(goal.id, index)}
                        className={`mt-0.5 mr-2 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                          milestone.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                        }`}
                      >
                        {milestone.completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <span className={`text-sm ${milestone.completed ? 'line-through text-gray-500' : ''}`}>
                        {milestone.text || milestone}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalTracker;