import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import { getCardsForResponse, getMockResponse } from '../utils/aiHelper.js';

export async function handleChat(req, res) {
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
      
      // Fetch user profile from database to get context
      const user = await User.findById(userId);
      const height = user?.height || 175;
      const weight = user?.weight || 70;
      const goal = user?.goal || 'maintain';

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: `You are GymBot, a professional gym instructor and nutrition specialist AI.
Your expertise covers:
1. Designing custom workout routines (Push/Pull/Legs, Upper/Lower, etc.).
2. Explaining correct exercise forms, tips, and common mistakes.
3. Calculating nutrition details, calories, macros, and creating meal plans.
4. Explaining fitness terms like progressive overload, muscle recovery, and hypertrophy.

User Profile Context (Use this context internally for all calculations and recommendations, but do NOT output it raw to the user):
- Height: ${height} cm
- Weight: ${weight} kg
- Goal: ${goal} (For 'bulk' supply calorie surplus, for 'cut' supply calorie deficit, for 'maintain' supply maintenance calories).

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

For a meal plan or multiple meals, output a JSON array of meal objects (each MUST contain prepTime, ingredients with quantities, instructions, name, calories, macros):
[
  {
    "type": "meal",
    "name": "Meal Name",
    "type": "breakfast" | "lunch" | "dinner" | "snack",
    "calories": 420,
    "protein": 28,
    "carbs": 52,
    "fat": 10,
    "ingredients": ["150g chicken breast", "1 cup cooked rice", "etc"],
    "instructions": ["Chop chicken", "Cook rice", "etc"],
    "prepTime": "15 mins"
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
}
