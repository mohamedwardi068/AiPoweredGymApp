import { Achievement, Conversation, MessageCard, UserProfile, WorkoutPlan } from '../types';

export const NAV_ITEMS = [
  { id: 'chat', label: 'Chat', icon: 'MessageCircle' },
  { id: 'workouts', label: 'Workout Plans', icon: 'Dumbbell' },
  { id: 'nutrition', label: 'Nutrition', icon: 'Apple' },
  { id: 'progress', label: 'Progress', icon: 'TrendingUp' },
  { id: 'saved', label: 'Saved Conversations', icon: 'Bookmark' },
] as const;

export const SUGGESTED_PROMPTS = [
  { title: 'Create a Push Pull Legs routine', icon: 'Dumbbell', color: 'green' },
  { title: 'Calculate calories for chicken and rice', icon: 'Calculator', color: 'blue' },
  { title: 'Explain progressive overload', icon: 'BookOpen', color: 'green' },
  { title: 'Best chest exercises', icon: 'Target', color: 'blue' },
  { title: 'Build a fat loss meal plan', icon: 'Utensils', color: 'green' },
  { title: 'Recovery tips for sore muscles', icon: 'Heart', color: 'blue' },
] as const;

export const MOCK_WORKOUT: MessageCard['data'] = {
  title: 'Push Day - Chest & Triceps',
  difficulty: 'intermediate',
  duration: 60,
  equipment: ['Barbell', 'Dumbbells', 'Cable Machine'],
  exercises: [
    { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90s', notes: 'Keep shoulder blades retracted' },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60s' },
    { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '45s', notes: 'Focus on the squeeze' },
    { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '60s' },
    { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '45s' },
    { name: 'Overhead Tricep Extension', sets: 3, reps: '12', rest: '45s' },
  ],
  calories: 450,
  targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
};

export const MOCK_NUTRITION: MessageCard['data'] = {
  name: 'Grilled Chicken & Rice Bowl',
  calories: 520,
  protein: 45,
  carbs: 55,
  fat: 12,
  fiber: 3,
  servings: 1,
};

export const MOCK_EXERCISE: MessageCard['data'] = {
  name: 'Barbell Back Squat',
  targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
  difficulty: 'intermediate',
  equipment: ['Barbell', 'Squat Rack'],
  commonMistakes: [
    'Knees caving inward',
    'Lifting heels off the ground',
    'Rounding the lower back',
    'Not reaching proper depth',
  ],
  tips: [
    'Keep your chest up throughout the movement',
    'Drive through your heels',
    'Maintain a neutral spine',
    'Brace your core before descending',
  ],
};

export const MOCK_MEAL_PLAN: MessageCard['data'][] = [
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

export const MOCK_USER: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  streak: 12,
  totalWorkouts: 48,
  goals: [
    { id: '1', type: 'muscle_gain', target: 180, current: 175 },
    { id: '2', type: 'strength', target: 225, current: 185 },
  ],
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: '1', title: 'Push Pull Legs Routine', messages: [], createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(Date.now() - 86400000) },
  { id: '2', title: 'Meal Prep Ideas', messages: [], createdAt: new Date(Date.now() - 172800000), updatedAt: new Date(Date.now() - 172800000), pinned: true },
  { id: '3', title: 'Recovery Tips', messages: [], createdAt: new Date(Date.now() - 259200000), updatedAt: new Date(Date.now() - 259200000) },
];

export const MOCK_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Push Pull Legs',
    description: 'Classic 6-day split focusing on compound movements',
    difficulty: 'intermediate',
    duration: 12,
    workoutsPerWeek: 6,
    workouts: [
      { id: '1', day: 1, name: 'Push - Chest, Shoulders, Triceps', exercises: [], duration: 60 },
      { id: '2', day: 2, name: 'Pull - Back, Biceps', exercises: [], duration: 60 },
      { id: '3', day: 3, name: 'Legs - Quads, Hamstrings, Glutes', exercises: [], duration: 60 },
      { id: '4', day: 4, name: 'Push - Chest, Shoulders, Triceps', exercises: [], duration: 60 },
      { id: '5', day: 5, name: 'Pull - Back, Biceps', exercises: [], duration: 60 },
      { id: '6', day: 6, name: 'Legs - Quads, Hamstrings, Glutes', exercises: [], duration: 60 },
    ],
  },
  {
    id: '2',
    name: 'Upper Lower Split',
    description: '4-day split balancing upper and lower body',
    difficulty: 'beginner',
    duration: 8,
    workoutsPerWeek: 4,
    workouts: [
      { id: '1', day: 1, name: 'Upper Body A', exercises: [], duration: 50 },
      { id: '2', day: 2, name: 'Lower Body A', exercises: [], duration: 50 },
      { id: '3', day: 4, name: 'Upper Body B', exercises: [], duration: 50 },
      { id: '4', day: 5, name: 'Lower Body B', exercises: [], duration: 50 },
    ],
  },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'First Steps', description: 'Complete your first workout', icon: 'Trophy', progress: 1, total: 1, unlockedAt: new Date() },
  { id: '2', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'Flame', progress: 7, total: 7, unlockedAt: new Date() },
  { id: '3', name: 'Iron Will', description: 'Complete 50 workouts', icon: 'Dumbbell', progress: 48, total: 50 },
  { id: '4', name: 'Nutrition Ninja', description: 'Log meals for 30 days', icon: 'Apple', progress: 12, total: 30 },
];

export const AI_RESPONSES = {
  workout: `I'll create a comprehensive Push Pull Legs routine for you! Here's a detailed 6-day split designed for muscle growth:

**Push Day (Chest, Shoulders, Triceps)**
- Focus on compound movements like bench press and overhead press
- 4-5 exercises per session
- Rep range: 6-12 for hypertrophy

**Pull Day (Back, Biceps, Rear Delts)**
- Deadlifts and pull-ups as primary movements
- Focus on the mind-muscle connection
- 60-90 second rest periods

**Legs (Quads, Hamstrings, Glutes, Calves)**
- Squats and Romanian deadlifts for strength
- Higher volume for leg development
- Don't skip the warm-up!

This routine is perfect for intermediate lifters looking to maximize muscle growth. Would you like me to customize any specific day?`,

  workout_4day: `I'll create a comprehensive 4-Day Split routine for you, with a specific focus on shoulders! Here's a detailed 4-day split designed for muscle growth and balanced development:

**Day 1: Upper Body (Chest & Back Focus)**
- Bench Press & Barbell Rows
- Incline Dumbbell Press & Pull-ups
- Bicep & Tricep isolations

**Day 2: Lower Body (Quads & Calves Focus)**
- Squats & Leg Press
- Leg Extensions & Calf Raises
- Core work

**Day 3: Rest/Recovery**

**Day 4: Shoulders & Arms (Specific Shoulder Day)**
- Overhead Press (Heavy compound)
- Lateral Raises (3 sets for width)
- Face Pulls (Rear delts)
- Bicep Curls & Tricep Extensions

**Day 5: Lower Body (Hamstrings & Glutes Focus)**
- Romanian Deadlifts & Hip Thrusts
- Leg Curls
- Core work

**Day 6 & 7: Rest/Recovery**

This 4-day split gives you plenty of recovery time while dedicating a specific day to shoulder development. Would you like to adjust any of these exercises?`,

  nutrition: `Here's the macronutrient breakdown for your grilled chicken and rice bowl:

**Grilled Chicken & Rice Bowl (1 serving)**

Perfect for post-workout nutrition with a balanced macro profile!

This meal provides high-quality protein for muscle recovery, complex carbs for sustained energy, and healthy fats for hormone production. Great choice for meal prep!`,

  progressive_overload: `**Progressive Overload Explained**

Progressive overload is the gradual increase of stress placed on your body during exercise. It's the fundamental principle behind muscle growth and strength gains.

**Key Methods:**
1. **Increase Weight** - Add 2.5-5lbs when you hit the top of your rep range
2. **Increase Reps** - Add 1-2 reps each session
3. **Increase Sets** - Add volume over time
4. **Decrease Rest** - Shorten rest periods for metabolic stress
5. **Improve Form** - Better technique = more muscle activation

**Pro Tip:** Track your workouts! What gets measured gets improved. Small, consistent improvements compound over time.

Would you like a sample progression plan?`,

  chest_exercises: `Here are the **Best Chest Exercises** for muscle development:

**Compound Movements:**
1. Barbell Bench Press - The king of chest exercises
2. Incline Dumbbell Press - Upper chest emphasis
3. Dips (weighted) - Lower chest focus

**Isolation Movements:**
1. Cable Flyes - Constant tension
2. Pec Deck - Peak contraction
3. Landmine Press - Joint-friendly option

**Pro Tips for Chest Training:**
- Retract your scapula to isolate the chest
- Focus on the stretch at the bottom
- Squeeze at the top for maximum activation
- Train the chest from multiple angles

Want me to explain proper form for any of these exercises?`,

  meal_plan: `I've created a balanced **Fat Loss Meal Plan** for you:

**Daily Targets:**
- Calories: 1800
- Protein: 180g (40%)
- Carbs: 158g (35%)
- Fat: 47g (25%)

This plan features a caloric deficit for fat loss while maintaining high protein to preserve muscle mass. The meals are nutrient-dense and satisfying!`,

  recovery: `**Muscle Recovery Tips**

Recovery is just as important as training! Here's your complete guide:

1. **Sleep** - Aim for 7-9 hours; this is when growth hormone peaks
2. **Nutrition** - Eat protein within 2 hours post-workout
3. **Hydration** - Drink 3-4L water daily
4. **Active Recovery** - Light cardio or yoga on rest days
5. **Foam Rolling** - Reduce muscle tension and improve mobility
6. **Cold Therapy** - Ice baths can reduce inflammation
7. **Deload Weeks** - Take a light week every 4-6 weeks

Listen to your body! Overtraining leads to injury and stalled progress.`,
};

export const THINKING_MESSAGES = [
  'Analyzing your training request...',
  'Building your workout plan...',
  'Calculating optimal macros...',
  'Consulting exercise database...',
  'Generating personalized recommendations...',
  'Optimizing for your goals...',
];
