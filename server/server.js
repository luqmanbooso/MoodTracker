import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import moodRoutes from './routes/moodRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import wellnessJourneyRoutes from './routes/wellnessJourneyRoutes.js';
import { seedResources } from './controllers/resourceController.js';
import { initializeDatabase } from './utils/initDb.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Debug all incoming requests (moved before routes)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/resources', resourceRoutes); // Add the new resource routes
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/wellness-journey', wellnessJourneyRoutes);

// Debug route to test if server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Test auth route
app.get('/api/auth-test', (req, res) => {
  res.json({ message: 'Auth test route is working!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
}).then(async () => {
  console.log('Connected to MongoDB');

  
  
  // Start the server after initialization
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch((err) => console.error('Error connecting to MongoDB:', err));
