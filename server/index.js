import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import User from './models/User.js';
import Conversation from './models/Conversation.js';
import UserWorkoutPlan from './models/UserWorkoutPlan.js';
import UserNutritionPlan from './models/UserNutritionPlan.js';
import UserWorkoutSchedule from './models/UserWorkoutSchedule.js';
import { authenticateToken } from './middleware/auth.js';

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
  .then(() => console.log('Successfully connected to MongoDB Atlas.'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Mock response constants (copied and adapted from frontend constants)
const MOCK_WORKOUT = {
  title: 'Push Pull Legs - 3 Day Split',
  difficulty: 'intermediate',
  duration: 60,
  equipment: ['Barbell', 'Dumbbells', 'Cable Machine', 'Squat Rack'],
  days: [
    {
      dayName: 'Push Day - Chest, Shoulders, Triceps',
      targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90s', notes: 'Keep shoulder blades retracted' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '90s' },
        { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '45s' },
      ],
    },
    {
      dayName: 'Pull Day - Back, Biceps, Rear Delts',
      targetMuscles: ['Back', 'Biceps', 'Rear Delts'],
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: '5-8', rest: '120s', notes: 'Maintain a neutral spine' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '90s' },
        { name: 'Barbell Rows', sets: 3, reps: '8-10', rest: '90s' },
        { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Bicep Curls', sets: 3, reps: '10-12', rest: '60s' },
      ],
    },
    {
      dayName: 'Leg Day - Quads, Hamstrings, Calves',
      targetMuscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
      exercises: [
        { name: 'Barbell Squats', sets: 4, reps: '6-8', rest: '120s', notes: 'Break parallel if mobility allows' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '8-10', rest: '90s' },
        { name: 'Leg Press', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45s' },
      ],
    }
  ],
  calories: 1500, // total roughly
  targetMuscles: ['Full Body'],
};

const MOCK_NUTRITION = {
  name: 'Grilled Chicken & Rice Bowl',
  calories: 520,
  protein: 45,
  carbs: 55,
  fat: 12,
  fiber: 3,
  servings: 1,
};

const MOCK_EXERCISE = {
  name: 'Barbell Bench Press',
  targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps'],
  difficulty: 'intermediate',
  equipment: ['Barbell', 'Bench', 'Rack'],
  commonMistakes: [
    'Flaring elbows too wide',
    'Bouncing the bar off chest',
    'Arching the lower back',
    'Not using full range of motion',
  ],
  tips: [
    'Retract shoulder blades for stability',
    'Keep elbows at 45 degrees',
    'Lower the bar to mid-chest',
    'Drive feet into the floor',
  ],
};

const MOCK_MEAL_PLAN = [
  {
    name: 'Overnight Oats with Berries',
    type: 'breakfast',
    calories: 420,
    protein: 28,
    carbs: 52,
    fat: 10,
    ingredients: ['1 cup oats', '1 scoop protein powder', '1/2 cup almond milk', 'Mixed berries', '1 tbsp honey'],
    instructions: ['Mix oats with protein powder', 'Add almond milk and stir', 'Top with berries and honey', 'Refrigerate overnight'],
  },
  {
    name: 'Grilled Chicken Salad',
    type: 'lunch',
    calories: 480,
    protein: 45,
    carbs: 25,
    fat: 18,
    ingredients: ['150g grilled chicken', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing'],
    instructions: ['Grill seasoned chicken breast', 'Chop vegetables', 'Combine in large bowl', 'Add dressing and serve'],
  },
  {
    name: 'Salmon with Quinoa',
    type: 'dinner',
    calories: 580,
    protein: 42,
    carbs: 45,
    fat: 22,
    ingredients: ['150g salmon fillet', '1 cup cooked quinoa', 'Asparagus', 'Lemon', 'Olive oil'],
    instructions: ['Season salmon with herbs', 'Pan-sear for 4 mins per side', 'Serve over quinoa', 'Add roasted asparagus'],
  },
];

const AI_RESPONSES = {
  workout: `I'll create a comprehensive Push Pull Legs routine for you! Here's a detailed 3-day split designed for muscle growth:\n\n**Push Day (Chest, Shoulders, Triceps)**\n- Focus on compound movements like bench press and overhead press\n- 4-5 exercises per session\n- Rep range: 6-12 for hypertrophy\n\n**Pull Day (Back, Biceps, Rear Delts)**\n- Deadlifts and pull-ups as primary movements\n- Focus on the mind-muscle connection\n- 60-90 second rest periods\n\n**Legs (Quads, Hamstrings, Glutes, Calves)**\n- Squats and Romanian deadlifts for strength\n- Higher volume for leg development\n- Don't skip the warm-up!\n\nThis routine is perfect for intermediate lifters looking to maximize muscle growth. Would you like me to customize any specific day?`,

  workout_4day: `I'll create a comprehensive 4-Day Split routine for you, with a specific focus on shoulders! Here's a detailed 4-day split designed for muscle growth and balanced development:\n\n**Day 1: Upper Body (Chest & Back Focus)**\n- Bench Press & Barbell Rows\n- Incline Dumbbell Press & Pull-ups\n- Bicep & Tricep isolations\n\n**Day 2: Lower Body (Quads & Calves Focus)**\n- Squats & Leg Press\n- Leg Extensions & Calf Raises\n- Core work\n\n**Day 3: Rest/Recovery\n\n**Day 4: Shoulders & Arms (Specific Shoulder Day)**\n- Overhead Press (Heavy compound)\n- Lateral Raises (3 sets for width)\n- Face Pulls (Rear delts)\n- Bicep Curls & Tricep Extensions\n\n**Day 5: Lower Body (Hamstrings & Glutes Focus)**\n- Romanian Deadlifts & Hip Thrusts\n- Leg Curls\n- Core work\n\n**Day 6 & 7: Rest/Recovery**\n\nThis 4-day split gives you plenty of recovery time while dedicating a specific day to shoulder development. Would you like to adjust any of these exercises?`,

  workout_2day: `Alright team, let's get you set up for success! A 2-Day Split is an excellent choice for individuals who might have busy schedules but are committed to making significant progress. It allows for focused training sessions while giving your muscles ample time to recover and grow.

This split will focus on an Upper/Lower structure, ensuring you hit all major muscle groups twice a week with adequate rest in between.

Let's dive into your tailored 2-Day Split!

Day 1: Upper Body Focus – Targeting your chest, back, shoulders, biceps, and triceps.
Day 2: Lower Body & Core Focus – Targeting your quads, hamstrings, glutes, calves, and core.

\`\`\`json
{
  "type": "workout",
  "title": "Upper / Lower - 2 Day Split",
  "difficulty": "beginner",
  "duration": 60,
  "equipment": ["Barbell", "Dumbbells", "Cables", "Leg Press"],
  "days": [
    {
      "dayName": "Day 1: Upper Body Domination",
      "targetMuscles": ["Chest", "Back", "Shoulders", "Biceps", "Triceps"],
      "exercises": [
        { "name": "Barbell Bench Press", "sets": 3, "reps": "8-12", "rest": "90s", "notes": "Control the descent, drive through chest." },
        { "name": "Lat Pulldown", "sets": 3, "reps": "8-12", "rest": "60s", "notes": "Focus on pulling with back muscles." },
        { "name": "Overhead Press", "sets": 3, "reps": "8-12", "rest": "90s", "notes": "Drive weight directly overhead." },
        { "name": "Seated Cable Rows", "sets": 3, "reps": "8-12", "rest": "60s", "notes": "Squeeze shoulder blades together." },
        { "name": "Dumbbell Bicep Curls", "sets": 3, "reps": "10-15", "rest": "45s", "notes": "Keep elbows tucked in." },
        { "name": "Tricep Pushdowns", "sets": 3, "reps": "10-15", "rest": "45s", "notes": "Keep elbows pinned to your sides." }
      ]
    },
    {
      "dayName": "Day 2: Lower Body & Core Power",
      "targetMuscles": ["Quads", "Glutes", "Hamstrings", "Calves", "Core"],
      "exercises": [
        { "name": "Barbell Squats", "sets": 3, "reps": "8-12", "rest": "120s", "notes": "Keep chest up, drive knees out." },
        { "name": "Romanian Deadlifts", "sets": 3, "reps": "8-12", "rest": "90s", "notes": "Push hips back, feel stretch in hamstrings." },
        { "name": "Walking Lunges", "sets": 3, "reps": "10-12 per leg", "rest": "60s", "notes": "Ensure front knee stays over ankle." },
        { "name": "Leg Press", "sets": 3, "reps": "10-15", "rest": "90s", "notes": "Control the movement." },
        { "name": "Standing Calf Raises", "sets": 3, "reps": "15-20", "rest": "45s", "notes": "Full range of motion." },
        { "name": "Plank", "sets": 3, "reps": "30-60s hold", "rest": "60s", "notes": "Straight line from head to heels." },
        { "name": "Russian Twists", "sets": 3, "reps": "15-20 per side", "rest": "45s", "notes": "Twist from torso, not just arms." }
      ]
    }
  ]
}
\`\`\`
`,

  nutrition: `Here's the macronutrient breakdown for your grilled chicken and rice bowl:\n\n**Grilled Chicken & Rice Bowl (1 serving)**\n\nPerfect for post-workout nutrition with a balanced macro profile!\n\nThis meal provides high-quality protein for muscle recovery, complex carbs for sustained energy, and healthy fats for hormone production. Great choice for meal prep!`,

  progressive_overload: `**Progressive Overload Explained**\n\nProgressive overload is the gradual increase of stress placed on your body during exercise. It's the fundamental principle behind muscle growth and strength gains.\n\n**Key Methods:**\n1. **Increase Weight** - Add 2.5-5lbs when you hit the top of your rep range\n2. **Increase Reps** - Add 1-2 reps each session\n3. **Increase Sets** - Add volume over time\n4. **Decrease Rest** - Shorten rest periods for metabolic stress\n5. **Improve Form** - Better technique = more muscle activation\n\n**Pro Tip:** Track your workouts! What gets measured gets improved. Small, consistent improvements compound over time.\n\nWould you like a sample progression plan?`,

  chest_exercises: `Here are the **Best Chest Exercises** for muscle development:\n\n**Compound Movements:**\n1. Barbell Bench Press - The king of chest exercises\n2. Incline Dumbbell Press - Upper chest emphasis\n3. Dips (weighted) - Lower chest focus\n\n**Isolation Movements:**\n1. Cable Flyes - Constant tension\n2. Pec Deck - Peak contraction\n3. Landmine Press - Joint-friendly option\n\n**Pro Tips for Chest Training:**\n- Retract your scapula to isolate the chest\n- Focus on the stretch at the bottom\n- Squeeze at the top for maximum activation\n- Train the chest from multiple angles\n\nWant me to explain proper form for any of these exercises?`,

  meal_plan: `I've created a balanced **Fat Loss Meal Plan** for you:\n\n**Daily Targets:**\n- Calories: 1800\n- Protein: 180g (40%)\n- Carbs: 158g (35%)\n- Fat: 47g (25%)\n\nThis plan features a caloric deficit for fat loss while maintaining high protein to preserve muscle mass. The meals are nutrient-dense and satisfying!`,

  recovery: `**Muscle Recovery Tips**\n\nRecovery is just as important as training! Here's your complete guide:\n\n1. **Sleep** - Aim for 7-9 hours; this is when growth hormone peaks\n2. **Nutrition** - Eat protein within 2 hours post-workout\n3. **Hydration** - Drink 3-4L water daily\n4. **Active Recovery** - Light cardio or yoga on rest days\n5. **Foam Rolling** - Reduce muscle tension and improve mobility\n6. **Cold Therapy** - Ice baths can reduce inflammation\n7. **Deload Weeks** - Take a light week every 4-6 weeks\n\nListen to your body! Overtraining leads to injury and stalled progress.`,
};

// Helper function to dynamically add visual UI cards based on message keywords
function getCardsForResponse(text) {
  const cards = [];

  // 1. Try to extract and parse any JSON blocks
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
  let match;
  const parsedJsonCards = [];

  while ((match = jsonRegex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (Array.isArray(parsed)) {
        parsedJsonCards.push(...parsed);
      } else if (parsed && typeof parsed === 'object') {
        parsedJsonCards.push(parsed);
      }
    } catch (e) {
      console.error('Error parsing JSON from response text:', e);
    }
  }

  if (parsedJsonCards.length > 0) {
    for (const item of parsedJsonCards) {
      if (item && item.type && item.data) {
        cards.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
          type: item.type,
          data: item.data
        });
      } else if (item && item.type) {
        const { type, ...data } = item;
        cards.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
          type,
          data
        });
      } else if (item) {
        // Guess type
        let type = 'tip';
        if (item.days || item.exercises || item.difficulty) {
          type = 'workout';
        } else if (item.calories && item.protein && item.carbs && item.fat) {
          type = (item.ingredients || item.instructions) ? 'meal' : 'nutrition';
        } else if (item.commonMistakes || item.tips) {
          type = 'exercise';
        }
        cards.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
          type,
          data: item
        });
      }
    }
  }

  // 2. Fallback to keyword matching if no JSON cards were extracted
  if (cards.length === 0) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('push day') || lowerText.includes('push pull legs') || lowerText.includes('workout routine') || lowerText.includes('workout plan')) {
      cards.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        type: 'workout',
        data: MOCK_WORKOUT,
      });
    }

    if (lowerText.includes('grilled chicken') || lowerText.includes('rice bowl') || lowerText.includes('calories') || lowerText.includes('protein')) {
      if (!lowerText.includes('meal plan')) {
        cards.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
          type: 'nutrition',
          data: MOCK_NUTRITION,
        });
      }
    }

    if (lowerText.includes('bench press') || lowerText.includes('chest exercise')) {
      cards.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        type: 'exercise',
        data: MOCK_EXERCISE,
      });
    }

    if (lowerText.includes('meal plan') || lowerText.includes('breakfast') || lowerText.includes('fat loss meal')) {
      MOCK_MEAL_PLAN.forEach((meal) => {
        cards.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
          type: 'meal',
          data: meal,
        });
      });
    }
  }

  return cards;
}

// Router to handle mock answers when API key is missing
function getMockResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('2 day') || lowerMessage.includes('two day') || (lowerMessage.includes('split') && lowerMessage.includes('2'))) {
    return {
      text: AI_RESPONSES.workout_2day,
      cards: getCardsForResponse(AI_RESPONSES.workout_2day),
    };
  }

  if (lowerMessage.includes('4 day') || lowerMessage.includes('four day') || lowerMessage.includes('shoulder')) {
    return {
      text: AI_RESPONSES.workout_4day,
      cards: [],
    };
  }

  if (lowerMessage.includes('push pull legs') || lowerMessage.includes('workout') || lowerMessage.includes('routine')) {
    return {
      text: AI_RESPONSES.workout,
      cards: getCardsForResponse(AI_RESPONSES.workout),
    };
  }

  if (lowerMessage.includes('calories') || lowerMessage.includes('chicken') || lowerMessage.includes('rice')) {
    return {
      text: AI_RESPONSES.nutrition,
      cards: getCardsForResponse(AI_RESPONSES.nutrition),
    };
  }

  if (lowerMessage.includes('progressive overload') || lowerMessage.includes('overload')) {
    return {
      text: AI_RESPONSES.progressive_overload,
      cards: [],
    };
  }

  if (lowerMessage.includes('chest') || lowerMessage.includes('exercise')) {
    return {
      text: AI_RESPONSES.chest_exercises,
      cards: getCardsForResponse(AI_RESPONSES.chest_exercises),
    };
  }

  if (lowerMessage.includes('meal plan') || lowerMessage.includes('fat loss') || lowerMessage.includes('nutrition')) {
    return {
      text: AI_RESPONSES.meal_plan,
      cards: getCardsForResponse(AI_RESPONSES.meal_plan),
    };
  }

  if (lowerMessage.includes('recovery') || lowerMessage.includes('sore') || lowerMessage.includes('rest')) {
    return {
      text: AI_RESPONSES.recovery,
      cards: [],
    };
  }

  return {
    text: `As your gym-specialized AI fitness coach, I understand you're asking about "${userMessage}". Let me know if you need help with workout splits, specific exercises, meal prep suggestions, or recovery guidelines!`,
    cards: [],
  };
}

// ================= AUTH ENDPOINTS =================

// Sign Up Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      streak: 1, // default starting streak
      totalWorkouts: 0,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'super_secret_gymbot_jwt_token_key_12345!',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        totalWorkouts: user.totalWorkouts,
      },
    });
  } catch (error) {
    console.error('Signup server error:', error);
    res.status(500).json({ error: 'An error occurred during signup' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'super_secret_gymbot_jwt_token_key_12345!',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        totalWorkouts: user.totalWorkouts,
      },
    });
  } catch (error) {
    console.error('Login server error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Get profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      streak: user.streak,
      totalWorkouts: user.totalWorkouts,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error loading profile' });
  }
});

// ================= CONVERSATION MANAGEMENT ENDPOINTS =================

// Fetch user's conversations
app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    
    const formatted = conversations.map((c) => ({
      id: c._id,
      title: c.title,
      messages: c.messages,
      pinned: c.pinned,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch conversations error:', error);
    res.status(500).json({ error: 'Server error loading chats' });
  }
});

// Sync conversation state (saving or updating)
app.post('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const { id, title, messages, pinned } = req.body;
    if (!id || !title || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Conversation id, title, and messages array are required' });
    }

    let conversation = await Conversation.findOne({ _id: id, userId: req.user.userId });
    
    if (conversation) {
      conversation.title = title;
      conversation.messages = messages;
      if (pinned !== undefined) conversation.pinned = pinned;
      conversation.updatedAt = new Date();
    } else {
      conversation = new Conversation({
        _id: id,
        userId: req.user.userId,
        title,
        messages,
        pinned: pinned || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await conversation.save();
    res.json({ success: true, conversation });
  } catch (error) {
    console.error('Save conversation error:', error);
    res.status(500).json({ error: 'Server error saving conversation' });
  }
});

// Rename conversation
app.post('/api/conversations/:id/rename', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, updatedAt: new Date() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ success: true, title: conversation.title });
  } catch (error) {
    console.error('Rename error:', error);
    res.status(500).json({ error: 'Server error renaming chat' });
  }
});

// Pin/Unpin conversation
app.post('/api/conversations/:id/pin', authenticateToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    conversation.pinned = !conversation.pinned;
    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({ success: true, pinned: conversation.pinned });
  } catch (error) {
    console.error('Pin error:', error);
    res.status(500).json({ error: 'Server error pinning chat' });
  }
});

// Delete conversation
app.delete('/api/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const result = await Conversation.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error deleting chat' });
  }
});

// Like/Dislike message inside conversation
app.post('/api/conversations/:id/messages/:messageId/like', authenticateToken, async (req, res) => {
  try {
    const { liked } = req.body; // true, false or null
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const message = conversation.messages.find((m) => m.id === req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.liked = liked;
    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({ success: true, liked: message.liked });
  } catch (error) {
    console.error('Like message error:', error);
    res.status(500).json({ error: 'Server error setting like status' });
  }
});

// ================= VALIDATED WORKOUT PLANS ENDPOINTS =================

// Get all validated workout plans for the user
app.get('/api/workouts/plans', authenticateToken, async (req, res) => {
  try {
    const plans = await UserWorkoutPlan.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    console.error('Fetch validated workouts error:', error);
    res.status(500).json({ error: 'Server error fetching workout plans' });
  }
});

// Save a validated workout plan
app.post('/api/workouts/plans', authenticateToken, async (req, res) => {
  try {
    const { title, difficulty, duration, equipment, exercises, days, calories, targetMuscles } = req.body;
    if (!title || !difficulty || !duration || (!Array.isArray(exercises) && !Array.isArray(days))) {
      return res.status(400).json({ error: 'Workout title, difficulty, duration, and days/exercises are required' });
    }

    const plan = new UserWorkoutPlan({
      userId: req.user.userId,
      title,
      difficulty,
      duration,
      equipment: equipment || [],
      exercises: exercises || [],
      days: days || [],
      calories,
      targetMuscles: targetMuscles || []
    });

    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    console.error('Save validated workout error:', error);
    res.status(500).json({ error: 'Server error saving workout plan' });
  }
});

// Delete a validated workout plan
app.delete('/api/workouts/plans/:id', authenticateToken, async (req, res) => {
  try {
    const result = await UserWorkoutPlan.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete validated workout error:', error);
    res.status(500).json({ error: 'Server error deleting workout plan' });
  }
});


// ================= WORKOUT SCHEDULE ENDPOINTS =================

// Get all schedule entries for the user
app.get('/api/workouts/schedule', authenticateToken, async (req, res) => {
  try {
    const schedule = await UserWorkoutSchedule.find({ userId: req.user.userId })
      .populate('workoutPlanId')
      .sort({ date: 1 });
    res.json(schedule);
  } catch (error) {
    console.error('Fetch schedule error:', error);
    res.status(500).json({ error: 'Server error fetching workout schedule' });
  }
});

// Add a workout plan to the schedule on a specific date
app.post('/api/workouts/schedule', authenticateToken, async (req, res) => {
  try {
    const { date, workoutPlanId, dayIndex = 0 } = req.body;
    if (!date || !workoutPlanId) {
      return res.status(400).json({ error: 'Date and workoutPlanId are required' });
    }

    // Check if the workout plan exists and belongs to the user
    const workoutPlan = await UserWorkoutPlan.findOne({ _id: workoutPlanId, userId: req.user.userId });
    if (!workoutPlan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    // Replace the scheduled workout on that day to keep the calendar simple (one workout per day)
    let scheduleEntry = await UserWorkoutSchedule.findOne({ date, userId: req.user.userId });
    if (scheduleEntry) {
      scheduleEntry.workoutPlanId = workoutPlanId;
      scheduleEntry.dayIndex = dayIndex;
    } else {
      scheduleEntry = new UserWorkoutSchedule({
        userId: req.user.userId,
        date,
        workoutPlanId,
        dayIndex,
      });
    }

    await scheduleEntry.save();
    
    // Return populated entry
    const populated = await UserWorkoutSchedule.findById(scheduleEntry._id).populate('workoutPlanId');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Save schedule error:', error);
    res.status(500).json({ error: 'Server error saving workout schedule' });
  }
});

// Remove a workout plan from the schedule on a date
app.delete('/api/workouts/schedule/:id', authenticateToken, async (req, res) => {
  try {
    const result = await UserWorkoutSchedule.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Schedule entry not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Server error deleting workout schedule' });
  }
});

// Auto-schedule a workout plan with rest days
app.post('/api/workouts/schedule/auto', authenticateToken, async (req, res) => {
  try {
    const { startDate, durationWeeks, trainDays, restDays, workoutPlanId } = req.body;
    if (!startDate || !durationWeeks || trainDays === undefined || restDays === undefined || !workoutPlanId) {
      return res.status(400).json({ error: 'Missing required auto-schedule parameters' });
    }

    const workoutPlan = await UserWorkoutPlan.findOne({ _id: workoutPlanId, userId: req.user.userId });
    if (!workoutPlan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    const totalDays = parseInt(durationWeeks) * 7;
    const trainCount = parseInt(trainDays);
    const restCount = parseInt(restDays);
    
    // Total cycle length
    const cycleLength = trainCount + restCount;
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // ensure midnight
    
    // Clear schedule for the duration to avoid duplicates or messy calendar
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + totalDays - 1);
    
    const startDateString = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
    const endDateString = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    await UserWorkoutSchedule.deleteMany({
      userId: req.user.userId,
      date: { $gte: startDateString, $lte: endDateString }
    });

    const newSchedules = [];
    const planDays = workoutPlan.days && workoutPlan.days.length > 0 ? workoutPlan.days.length : 1;
    let currentPlanDayIndex = 0;

    for (let i = 0; i < totalDays; i++) {
      const isRestDay = (i % cycleLength) >= trainCount;
      
      if (!isRestDay) {
        const currentDate = new Date(start);
        currentDate.setDate(currentDate.getDate() + i);
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        newSchedules.push({
          userId: req.user.userId,
          date: dateString,
          workoutPlanId,
          dayIndex: currentPlanDayIndex % planDays
        });
        currentPlanDayIndex++;
      }
    }

    if (newSchedules.length > 0) {
      await UserWorkoutSchedule.insertMany(newSchedules);
    }

    res.json({ success: true, inserted: newSchedules.length });
  } catch (error) {
    console.error('Auto-schedule error:', error);
    res.status(500).json({ error: 'Server error auto-scheduling workouts' });
  }
});

// Push workouts by 1 day starting from a given date
app.post('/api/workouts/schedule/push', authenticateToken, async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Find all schedules on or after the dropped date
    const schedules = await UserWorkoutSchedule.find({
      userId: req.user.userId,
      date: { $gte: date }
    }).sort({ date: -1 }); // Sort descending so we move the latest ones first to avoid date conflicts (if we were checking unique dates)

    for (const schedule of schedules) {
      const d = new Date(schedule.date);
      // Ensure we treat the date string accurately
      // schedule.date is like '2026-07-04'
      const year = parseInt(schedule.date.substring(0, 4));
      const month = parseInt(schedule.date.substring(5, 7)) - 1;
      const day = parseInt(schedule.date.substring(8, 10));
      
      const nextDay = new Date(year, month, day + 1);
      const newDateString = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
      
      schedule.date = newDateString;
      await schedule.save();
    }

    res.json({ success: true, pushedCount: schedules.length });
  } catch (error) {
    console.error('Push schedule error:', error);
    res.status(500).json({ error: 'Server error pushing workout schedule' });
  }
});


// ================= VALIDATED NUTRITION PLANS ENDPOINTS =================

// Get all validated nutrition/meal plans for the user
app.get('/api/nutrition/plans', authenticateToken, async (req, res) => {
  try {
    const meals = await UserNutritionPlan.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (error) {
    console.error('Fetch validated nutrition error:', error);
    res.status(500).json({ error: 'Server error fetching nutrition plans' });
  }
});

// Save a validated nutrition/meal plan
app.post('/api/nutrition/plans', authenticateToken, async (req, res) => {
  try {
    const { name, type, calories, protein, carbs, fat, ingredients, instructions } = req.body;
    if (!name || !calories || !protein || !carbs || !fat) {
      return res.status(400).json({ error: 'Meal name, calories, protein, carbs, and fat are required' });
    }

    const meal = new UserNutritionPlan({
      userId: req.user.userId,
      name,
      type: type || 'snack',
      calories,
      protein,
      carbs,
      fat,
      ingredients: ingredients || [],
      instructions: instructions || []
    });

    await meal.save();
    res.status(201).json(meal);
  } catch (error) {
    console.error('Save validated nutrition error:', error);
    res.status(500).json({ error: 'Server error saving nutrition plan' });
  }
});

// Delete a validated nutrition/meal plan
app.delete('/api/nutrition/plans/:id', authenticateToken, async (req, res) => {
  try {
    const result = await UserNutritionPlan.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Nutrition plan not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete validated nutrition error:', error);
    res.status(500).json({ error: 'Server error deleting nutrition plan' });
  }
});

// ================= AI CHAT ENDPOINT =================

// Endpoint to handle chatbot questions
app.post('/api/chat', authenticateToken, async (req, res) => {
  const { message, conversationId, history } = req.body;
  const userId = req.user.userId;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  if (!conversationId) {
    return res.status(400).json({ error: 'Conversation ID (UUID) is required' });
  }

  console.log(`Received message: "${message}" for conversation: ${conversationId} by user: ${userId}`);

  const userMessageId = crypto.randomUUID();
  const assistantMessageId = crypto.randomUUID();

  // 1. Log User message in database
  const userMessage = {
    id: userMessageId,
    role: 'user',
    content: message.trim(),
    timestamp: new Date(),
    liked: null,
    cards: [],
  };

  let conversation = await Conversation.findOne({ _id: conversationId, userId });
  if (!conversation) {
    conversation = new Conversation({
      _id: conversationId,
      userId,
      title: message.trim().slice(0, 30) + (message.trim().length > 30 ? '...' : ''),
      messages: [userMessage],
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    conversation.messages.push(userMessage);
    conversation.updatedAt = new Date();
  }

  // 2. Fetch or mock Gemini response
  const apiKey = process.env.GEMINI_API_KEY;
  let responseText = '';
  let cards = [];

  if (apiKey) {
    try {
      console.log('Using Gemini API for response...');
      console.log('API Key starts with:', apiKey ? apiKey.substring(0, 15) : 'undefined', 'length:', apiKey ? apiKey.length : 0);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: `You are GymBot, a professional gym instructor and nutrition specialist AI.
Your expertise covers:
1. Designing custom workout routines (Push/Pull/Legs, Upper/Lower, etc.).
2. Explaining correct exercise forms, tips, and common mistakes.
3. Calculating nutrition details, calories, macros, and creating meal plans.
4. Explaining fitness terms like progressive overload, muscle recovery, and hypertrophy.

Be structured, write clean markdown with bullet points where appropriate, and keep your tone highly motivational and professional.

CRITICAL: When generating a workout plan, meal plan, single meal, or exercise details, you MUST also output a corresponding JSON block inside a \`\`\`json ... \`\`\` block at the very end of your response, so the user can interactively edit and validate it in the UI.

For a workout plan, the JSON must be:
{
  "type": "workout",
  "title": "Workout Split Name",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "duration": 60,
  "equipment": ["Equipment 1", "Equipment 2"],
  "days": [
    {
      "dayName": "Day 1 Name",
      "targetMuscles": ["Muscle 1", "Muscle 2"],
      "exercises": [
        { "name": "Exercise Name", "sets": 3, "reps": "8-12", "rest": "90s", "notes": "Form tip" }
      ]
    }
  ]
}

For a single meal or food item:
{
  "type": "nutrition",
  "name": "Meal Name",
  "calories": 520,
  "protein": 45,
  "carbs": 55,
  "fat": 12,
  "fiber": 3,
  "servings": 1
}

For a meal plan or multiple meals, output a JSON array of meal objects:
[
  {
    "type": "meal",
    "name": "Meal Name",
    "type": "breakfast" | "lunch" | "dinner" | "snack",
    "calories": 420,
    "protein": 28,
    "carbs": 52,
    "fat": 10,
    "ingredients": ["1 cup oats", "etc"],
    "instructions": ["Mix oats", "etc"]
  }
]

For an exercise:
{
  "type": "exercise",
  "name": "Exercise Name",
  "targetMuscles": ["Pecs", "Triceps"],
  "difficulty": "intermediate",
  "equipment": ["Barbell"],
  "commonMistakes": ["Mistake 1"],
  "tips": ["Tip 1"]
}`,
      });

      // Format conversation history for Gemini if present
      let geminiHistory = [];
      if (conversation.messages.length > 1) {
        // Exclude the last user message we just pushed
        geminiHistory = conversation.messages.slice(0, -1).map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        }));
      }

      let response;
      if (geminiHistory.length > 0) {
        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(message);
        response = result.response;
      } else {
        const result = await model.generateContent(message);
        response = result.response;
      }
      
      responseText = response.text();
      cards = getCardsForResponse(responseText);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      console.log('Gemini API call failed, falling back to mock system...');
      const mock = getMockResponse(message);
      responseText = mock.text;
      cards = mock.cards;
    }
  } else {
    console.log('No GEMINI_API_KEY found. Using rule-based mock engine...');
    const mock = getMockResponse(message);
    responseText = mock.text;
    cards = mock.cards;
  }

  // 3. Log assistant message in database
  const assistantMessage = {
    id: assistantMessageId,
    role: 'assistant',
    content: responseText,
    timestamp: new Date(),
    liked: null,
    cards: cards.map(c => ({
      id: c.id || crypto.randomUUID(),
      type: c.type,
      data: c.data,
    })),
  };

  conversation.messages.push(assistantMessage);
  conversation.updatedAt = new Date();

  try {
    await conversation.save();
    console.log(`Saved conversation "${conversation.title}" successfully to MongoDB.`);
  } catch (dbErr) {
    console.error('Error saving conversation to MongoDB:', dbErr);
  }

  return res.json({
    text: responseText,
    cards: assistantMessage.cards,
    userMessageId,
    assistantMessageId,
  });
});

app.listen(PORT, () => {
  console.log(`GymBot Express server running on port ${PORT}`);
});
