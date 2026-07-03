import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRouter from './routers/authRouter.js';
import conversationRouter from './routers/conversationRouter.js';
import workoutRouter from './routers/workoutRouter.js';
import nutritionRouter from './routers/nutritionRouter.js';
import chatRouter from './routers/chatRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas.');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// API Routes mounting
app.use('/api/auth', authRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/workouts', workoutRouter);
app.use('/api/nutrition', nutritionRouter);
app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`GymBot Express server running on port ${PORT}`);
});
