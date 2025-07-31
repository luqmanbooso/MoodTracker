import express from 'express';
import { 
  getTodos, 
  addTodo, 
  generateTodoRecommendations, 
  trackTodoCompletion, 
  deleteTodo 
} from '../controllers/todoController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Get all todos for user (requires authentication)
router.get('/', verifyToken, getTodos);

// Add a new todo (requires authentication)
router.post('/', verifyToken, addTodo);

// Test route to verify todo routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Todo routes are working!' });
});

// Generate personalized todo recommendations (requires authentication)
router.post('/todo-recommendations', verifyToken, generateTodoRecommendations);

// Track todo completion for AI analysis (requires authentication)
router.post('/track-todo-completion', verifyToken, trackTodoCompletion);

// Delete a todo (requires authentication)
router.delete('/:todoId', verifyToken, deleteTodo);

export default router; 