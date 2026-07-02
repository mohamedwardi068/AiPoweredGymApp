export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  cards?: MessageCard[];
  liked?: boolean | null;
}

export interface MessageCard {
  id: string;
  type: 'workout' | 'nutrition' | 'exercise' | 'meal' | 'tip';
  data: WorkoutCard | NutritionCard | ExerciseCard | MealCard | TipCard;
}

export interface WorkoutDay {
  dayName: string;
  targetMuscles: string[];
  exercises: WorkoutExercise[];
}

export interface WorkoutCard {
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  equipment: string[];
  days?: WorkoutDay[];
  exercises?: WorkoutExercise[];
  calories?: number;
  targetMuscles?: string[];
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface NutritionCard {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  servings?: number;
}

export interface ExerciseCard {
  name: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  commonMistakes: string[];
  tips: string[];
}

export interface MealCard {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
}

export interface TipCard {
  title: string;
  content: string;
  category: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  pinned?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  streak: number;
  totalWorkouts: number;
  goals: FitnessGoal[];
}

export interface FitnessGoal {
  id: string;
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'strength';
  target?: number;
  current?: number;
  deadline?: Date;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  workoutsPerWeek: number;
  workouts: PlannedWorkout[];
}

export interface PlannedWorkout {
  id: string;
  day: number;
  name: string;
  exercises: WorkoutExercise[];
  duration: number;
}

export interface NutritionEntry {
  id: string;
  date: Date;
  meals: MealCard[];
  waterIntake: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface ProgressEntry {
  id: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  workoutCompleted?: boolean;
  caloriesBurned?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  total: number;
}

export type Page = 'chat' | 'workouts' | 'nutrition' | 'progress' | 'saved';
