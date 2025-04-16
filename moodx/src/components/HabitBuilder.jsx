import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const HabitBuilder = ({ onAddHabit, onCompleteHabit, userHabits = [] }) => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    priority: 'medium',
    category: 'productivity'
  });
  const [todaysHabits, setTodaysHabits] = useState([]);
  
  // Habit categories that help men "get shit together"
  const habitCategories = [
    { id: 'productivity', name: 'Productivity', icon: '⚒️' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'mental', name: 'Mental Strength', icon: '🧠' },
    { id: 'discipline', name: 'Discipline', icon: '⏰' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'social', name: 'Social', icon: '🤝' }
  ];
  
  // Suggested habits by category
  const suggestedHabits = {
    productivity: [
      "Complete most important task before noon",
      "Zero inbox at end of day",
      "Plan next day the night before",
      "Focus blocks: 90 minutes, no distractions"
    ],
    fitness: [
      "30+ minutes of strength training",
      "10,000 steps daily",
      "5-minute cold shower",
      "Eat protein with every meal"
    ],
    mental: [
      "10 minutes of meditation",
      "Daily journaling/gratitude",
      "Read for 20 minutes",
      "No social media before breakfast"
    ],
    discipline: [
      "Wake up at 5:30 AM",
      "Make bed immediately after waking",
      "No alcohol during weekdays",
      "Track all expenses"
    ],
    learning: [
      "Learn one new concept daily",
      "Practice a skill for 30 minutes",
      "Listen to educational content during commute",
      "Teach someone what you learned"
    ],
    finance: [
      "No impulsive purchases",
      "Review finances weekly",
      "Add to investments/savings",
      "Cook at home instead of eating out"
    ],
    social: [
      "Reach out to one connection",
      "Have a meaningful conversation",
      "Practice active listening",
      "Express genuine gratitude to someone"
    ]
  };
  
  useEffect(() => {
    // Filter habits that should be done today
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const habits = userHabits.filter(habit => {
      if (habit.frequency === 'daily') return true;
      if (habit.frequency === 'weekdays' && today >= 1 && today <= 5) return true;
      if (habit.frequency === 'weekends' && (today === 0 || today === 6)) return true;
      return false;
    });
    
    setTodaysHabits(habits);
  }, [userHabits]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHabit(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;
    
    onAddHabit({
      ...newHabit,
      id: Date.now().toString(),
      createdAt: new Date(),
      completed: false,
      streak: 0
    });
    
    // Reset form
    setNewHabit({
      name: '',
      description: '',
      frequency: 'daily',
      priority: 'medium',
      category: 'productivity'
    });
    setIsAdding(false);
  };
  
  const handleSuggestedHabit = (habit) => {
    setNewHabit(prev => ({
      ...prev,
      name: habit
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${theme.textColor}`}>
          Daily Habits & Disciplines
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className={`px-3 py-1 rounded bg-${theme.primaryColor}-600 text-white hover:bg-${theme.primaryColor}-700 transition-colors`}
          >
            Add New Habit
          </button>
        )}
      </div>
      
      {isAdding ? (
        <div className={`bg-${theme.cardBg} p-5 rounded-lg shadow-md mb-6 animate-fadeIn`}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Habit Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newHabit.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
                  placeholder="e.g., Morning workout, Read for 30 minutes"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={newHabit.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
                >
                  {habitCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={newHabit.description}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
                placeholder="Why this habit matters to you"
                rows="2"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={newHabit.frequency}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={newHabit.priority}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300 focus:border-blue-500"
                >
                  <option value="high">High - Essential</option>
                  <option value="medium">Medium - Important</option>
                  <option value="low">Low - Beneficial</option>
                </select>
              </div>
            </div>
            
            {/* Suggested habits based on selected category */}
            {suggestedHabits[newHabit.category] && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Suggested habits:
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedHabits[newHabit.category].map((habit, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestedHabit(habit)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                    >
                      {habit}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
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
                Add Habit
              </button>
            </div>
          </form>
        </div>
      ) : todaysHabits.length === 0 ? (
        <div className={`bg-${theme.cardBg} p-6 rounded-lg shadow-md text-center mb-6`}>
          <p className="text-gray-600 mb-4">No habits added yet. Start building discipline with daily habits.</p>
          <button
            onClick={() => setIsAdding(true)}
            className={`px-4 py-2 bg-${theme.primaryColor}-600 text-white rounded hover:bg-${theme.primaryColor}-700 transition-colors`}
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {todaysHabits.map(habit => (
            <div 
              key={habit.id} 
              className={`bg-${theme.cardBg} p-4 rounded-lg shadow-md flex items-center border-l-4 ${
                habit.priority === 'high' ? 'border-red-500' : 
                habit.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
              }`}
            >
              <div className="mr-4">
                <button
                  onClick={() => onCompleteHabit(habit.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    habit.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  {habit.completed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${habit.completed ? 'line-through text-gray-500' : ''}`}>
                    {habit.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Streak: {habit.streak || 0}</span>
                    <span className="text-xl" title={habitCategories.find(c => c.id === habit.category)?.name}>
                      {habitCategories.find(c => c.id === habit.category)?.icon}
                    </span>
                  </div>
                </div>
                {habit.description && (
                  <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitBuilder;