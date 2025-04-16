import { useState } from 'react';

const CustomMoodManager = ({ categories, onAdd, onRemove }) => {
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      setError('Please enter a category name');
      return;
    }
    
    if (newCategory.length > 20) {
      setError('Category name must be less than 20 characters');
      return;
    }
    
    if (categories.includes(newCategory.trim())) {
      setError('This category already exists');
      return;
    }
    
    onAdd(newCategory.trim());
    setNewCategory('');
    setError('');
  };

  return (
    <div>
      <p className="text-gray-600 mb-4">
        Create custom mood categories to better track how you're feeling.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category..."
            className="flex-1 p-2 border rounded focus:ring focus:ring-blue-200 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </form>
      
      <div className="mt-4">
        <h3 className="font-medium text-gray-700 mb-2">Your Custom Categories</h3>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">No custom categories yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <span>{category}</span>
                <button
                  onClick={() => onRemove(category)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                  aria-label={`Remove ${category}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomMoodManager;