import crypto from 'crypto';

export const MOCK_WORKOUT = {
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
  calories: 1500,
  targetMuscles: ['Full Body'],
};

export const MOCK_NUTRITION = {
  name: 'Grilled Chicken & Rice Bowl',
  calories: 520,
  protein: 45,
  carbs: 55,
  fat: 12,
  fiber: 3,
  servings: 1,
};

export const MOCK_EXERCISE = {
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

export const MOCK_MEAL_PLAN = [
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

export const AI_RESPONSES = {
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

export function getCardsForResponse(text) {
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

export function getMockResponse(userMessage) {
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
