import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import moodRoutes from './routes/moodRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import { seedResources } from './controllers/resourceController.js';
import { initializeDatabase } from './utils/initDb.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/moods', moodRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/resources', resourceRoutes); // Add the new resource routes
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  // Initialize database with test data
  await initializeDatabase();
  
  // Seed initial resources
  seedResources();
  
  // Start the server after initialization
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch((err) => console.error('Error connecting to MongoDB:', err));
