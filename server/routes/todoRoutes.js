import express from 'express';
import { 
  getTodos, 
  addTodo, 
  generateTodoRecommendations, 
  trackTodoCompletion, 
  deleteTodo 
} from '../controllers/todoController.js';

const router = express.Router();

// Get all todos for user
router.get('/', getTodos);

// Add a new todo
router.post('/', addTodo);

// Test route to verify todo routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Todo routes are working!' });
});

// Generate personalized todo recommendations
router.post('/todo-recommendations', generateTodoRecommendations);

// Track todo completion for AI analysis
router.post('/track-todo-completion', trackTodoCompletion);

// Delete a todo
router.delete('/:todoId', deleteTodo);

export default router; 