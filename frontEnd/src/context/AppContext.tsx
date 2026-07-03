import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Conversation, Message, Page, MessageCard, UserProfile, FoodItem } from '../types';
import { AI_RESPONSES, MOCK_WORKOUT_PLANS } from '../constants';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conv: Conversation | null) => void;
  isStreaming: boolean;
  user: UserProfile | null;
  appLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  createNewConversation: () => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  pinConversation: (id: string) => void;
  toggleLikeMessage: (messageId: string) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  validatedWorkouts: any[];
  validatedMeals: any[];
  validateWorkout: (workout: any, startDate?: string, preventNavigation?: boolean) => Promise<any>;
  validateNutrition: (meal: any, date?: string) => Promise<void>;
  updateValidatedNutrition: (id: string, meal: any) => Promise<void>;
  deleteValidatedWorkout: (id: string) => Promise<void>;
  deleteValidatedNutrition: (id: string) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  searchFoods: (query: string, category: string) => Promise<FoodItem[]>;
  getFavorites: () => Promise<FoodItem[]>;
  addFavorite: (foodId: string) => Promise<void>;
  removeFavorite: (foodId: string) => Promise<void>;
  getRecents: () => Promise<FoodItem[]>;
  addRecent: (foodId: string) => Promise<void>;
  workoutSchedule: any[];
  scheduleWorkout: (date: string, workoutPlanId: string) => Promise<void>;
  unscheduleWorkout: (scheduleId: string) => Promise<void>;
  autoScheduleWorkout: (startDate: string, durationWeeks: number, trainDays: number, restDays: number, workoutPlanId: string) => Promise<void>;
  insertRestDay: (date: string) => Promise<void>;
  activeEditContext: { messageId: string; cardId: string; data: any } | null;
  setActiveEditContext: (context: { messageId: string; cardId: string; data: any } | null) => void;
  updateMessageCard: (messageId: string, cardId: string, newData: any) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeEditContext, setActiveEditContext] = useState<{ messageId: string; cardId: string; data: any } | null>(null);
  
  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appLoading, setAppLoading] = useState(true);

  // Validated Plans State
  const [validatedWorkouts, setValidatedWorkouts] = useState<any[]>([]);
  const [validatedMeals, setValidatedMeals] = useState<any[]>([]);
  const [workoutSchedule, setWorkoutSchedule] = useState<any[]>([]);

  const generateAIResponse = useCallback((userMessage: string): { text: string; cards: MessageCard[] } => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('4 day') || lowerMessage.includes('four day') || lowerMessage.includes('shoulder')) {
      return {
        text: AI_RESPONSES.workout_4day,
        cards: [
          { id: crypto.randomUUID(), type: 'workout', data: MOCK_WORKOUT_PLANS[1] as any } // Using Upper Lower 4-day split from constants
        ],
      };
    }

    if (lowerMessage.includes('push pull legs') || lowerMessage.includes('workout') || lowerMessage.includes('routine')) {
      return {
        text: AI_RESPONSES.workout,
        cards: [
          { id: crypto.randomUUID(), type: 'workout', data: {
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
            ],
            calories: 450,
            targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
          }},
        ],
      };
    }

    if (lowerMessage.includes('calories') || lowerMessage.includes('chicken') || lowerMessage.includes('rice')) {
      return {
        text: AI_RESPONSES.nutrition,
        cards: [
          { id: crypto.randomUUID(), type: 'nutrition', data: {
            name: 'Grilled Chicken & Rice Bowl',
            calories: 520,
            protein: 45,
            carbs: 55,
            fat: 12,
            fiber: 3,
            servings: 1,
          }},
        ],
      };
    }

    if (lowerMessage.includes('progressive overload') || lowerMessage.includes('overload')) {
      return { text: AI_RESPONSES.progressive_overload, cards: [] };
    }

    if (lowerMessage.includes('chest') || lowerMessage.includes('exercise')) {
      return {
        text: AI_RESPONSES.chest_exercises,
        cards: [
          { id: crypto.randomUUID(), type: 'exercise', data: {
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
          }},
        ],
      };
    }

    if (lowerMessage.includes('meal plan') || lowerMessage.includes('fat loss') || lowerMessage.includes('nutrition')) {
      return {
        text: AI_RESPONSES.meal_plan,
        cards: [
          { id: crypto.randomUUID(), type: 'meal', data: {
            name: 'Overnight Oats with Berries',
            type: 'breakfast',
            calories: 420,
            protein: 28,
            carbs: 52,
            fat: 10,
            ingredients: ['1 cup oats', '1 scoop protein powder', '1/2 cup almond milk', 'Mixed berries', '1 tbsp honey'],
            instructions: ['Mix oats with protein powder', 'Add almond milk and stir', 'Top with berries and honey', 'Refrigerate overnight'],
          }},
          { id: crypto.randomUUID(), type: 'meal', data: {
            name: 'Grilled Chicken Salad',
            type: 'lunch',
            calories: 480,
            protein: 45,
            carbs: 25,
            fat: 18,
            ingredients: ['150g grilled chicken', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing'],
            instructions: ['Grill seasoned chicken breast', 'Chop vegetables', 'Combine in large bowl', 'Add dressing and serve'],
          }},
          { id: crypto.randomUUID(), type: 'meal', data: {
            name: 'Salmon with Quinoa',
            type: 'dinner',
            calories: 580,
            protein: 42,
            carbs: 45,
            fat: 22,
            ingredients: ['150g salmon fillet', '1 cup cooked quinoa', 'Asparagus', 'Lemon', 'Olive oil'],
            instructions: ['Season salmon with herbs', 'Pan-sear for 4 mins per side', 'Serve over quinoa', 'Add roasted asparagus'],
          }},
        ],
      };
    }

    if (lowerMessage.includes('recovery') || lowerMessage.includes('sore') || lowerMessage.includes('rest')) {
      return { text: AI_RESPONSES.recovery, cards: [] };
    }

    return {
      text: `I understand you're asking about "${userMessage}". As your AI fitness coach, I'm here to help with workouts, nutrition, recovery, and any fitness-related questions. What specific aspect would you like me to dive deeper into?`,
      cards: [],
    };
  }, []);

  const simulateStreaming = useCallback(async (fullText: string, onUpdate: (text: string) => void) => {
    const words = fullText.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 20));
      currentText += (i === 0 ? '' : ' ') + words[i];
      onUpdate(currentText);
    }
  }, []);

  // Fetch conversations from MongoDB
  const fetchConversations = useCallback(async (jwtToken: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/conversations', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const parsed = data.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        }));
        setConversations(parsed);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, []);

  // Fetch profile on token verify
  const fetchProfile = useCallback(async (jwtToken: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        await fetchConversations(jwtToken);
        await fetchValidatedWorkouts(jwtToken);
        await fetchValidatedMeals(jwtToken);
        await fetchWorkoutSchedule(jwtToken);
      } else {
        localStorage.removeItem('gymbot_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      localStorage.removeItem('gymbot_token');
      setUser(null);
    } finally {
      setAppLoading(false);
    }
  }, [fetchConversations]);

  // Auth Operations
  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }

    localStorage.setItem('gymbot_token', data.token);
    setUser(data.user);
    await fetchConversations(data.token);
    await fetchValidatedWorkouts(data.token);
    await fetchValidatedMeals(data.token);
    await fetchWorkoutSchedule(data.token);
    setCurrentPage('chat');
  }, [fetchConversations]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create account');
    }

    localStorage.setItem('gymbot_token', data.token);
    setUser(data.user);
    setConversations([]);
    setValidatedWorkouts([]);
    setValidatedMeals([]);
    setWorkoutSchedule([]);
    setCurrentPage('chat');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('gymbot_token');
    setUser(null);
    setConversations([]);
    setValidatedWorkouts([]);
    setValidatedMeals([]);
    setWorkoutSchedule([]);
    setCurrentConversation(null);
    setCurrentPage('chat');
  }, []);

  // Check login state on load
  useEffect(() => {
    const token = localStorage.getItem('gymbot_token');
    if (token) {
      fetchProfile(token);
    } else {
      setAppLoading(false);
    }
  }, [fetchProfile]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !user) return;
    
    let finalContent = content.trim();
    
    if (activeEditContext) {
      finalContent = `Please modify the following workout plan according to this request: "${content.trim()}"\n\nCurrent Plan Context:\n\`\`\`json\n${JSON.stringify(activeEditContext.data, null, 2)}\n\`\`\``;
      setActiveEditContext(null);
    }

    const userMessageId = crypto.randomUUID();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: content.trim(), // Keep original content for UI
      timestamp: new Date(),
    };

    let conversation = currentConversation;
    const isNew = !conversation;
    const conversationId = conversation ? conversation.id : crypto.randomUUID();

    const activeConv: Conversation = isNew
      ? {
          id: conversationId,
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          messages: [userMessage],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      : {
          ...conversation!,
          messages: [...conversation!.messages, userMessage],
          updatedAt: new Date(),
        };

    if (isNew) {
      setConversations((prev) => [activeConv, ...prev]);
      setCurrentConversation(activeConv);
    } else {
      setConversations((prev) => prev.map((c) => (c.id === conversationId ? activeConv : c)));
      setCurrentConversation(activeConv);
    }

    setIsStreaming(true);

    let text = '';
    let cards: any[] = [];
    let assistantMessageId = crypto.randomUUID();

    try {
      const token = localStorage.getItem('gymbot_token');
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: finalContent,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      text = data.text;
      cards = data.cards;
      if (data.assistantMessageId) {
        assistantMessageId = data.assistantMessageId;
      }
    } catch (error) {
      console.error('Error fetching chat from Express backend:', error);
      // Fallback to local mock generator if backend is not reachable
      const mock = generateAIResponse(content);
      text = mock.text;
      cards = mock.cards;
    }

    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      cards,
    };

    const streamingConversation: Conversation = {
      ...activeConv,
      messages: [...activeConv.messages, assistantMessage],
    };
    setCurrentConversation(streamingConversation);
    setConversations((prev) => prev.map((c) => (c.id === streamingConversation.id ? streamingConversation : c)));

    await simulateStreaming(text, (streamedContent) => {
      const updatedMessages = streamingConversation.messages.map((m) =>
        m.id === assistantMessage.id ? { ...m, content: streamedContent } : m
      );
      const updatedConv: Conversation = { ...streamingConversation, messages: updatedMessages };
      setCurrentConversation(updatedConv);
      setConversations((prev) => prev.map((c) => (c.id === updatedConv.id ? updatedConv : c)));
    });

    const finalMessages = streamingConversation.messages.map((m) =>
      m.id === assistantMessage.id ? { ...m, content: text, isStreaming: false } : m
    );
    const finalConv: Conversation = { ...streamingConversation, messages: finalMessages };
    setCurrentConversation(finalConv);
    setConversations((prev) => prev.map((c) => (c.id === finalConv.id ? finalConv : c)));

    setIsStreaming(false);
  }, [currentConversation, user, generateAIResponse, simulateStreaming]);

  const createNewConversation = useCallback(() => {
    setCurrentConversation(null);
    setCurrentPage('chat');
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (token) {
        await fetch(`http://localhost:5000/api/conversations/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Failed to delete conversation on server:', error);
    }

    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  }, [currentConversation]);

  const renameConversation = useCallback(async (id: string, title: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (token) {
        await fetch(`http://localhost:5000/api/conversations/${id}/rename`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ title }),
        });
      }
    } catch (error) {
      console.error('Failed to rename conversation on server:', error);
    }

    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title, updatedAt: new Date() } : c))
    );
    if (currentConversation?.id === id) {
      setCurrentConversation({ ...currentConversation, title });
    }
  }, [currentConversation]);

  const pinConversation = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (token) {
        await fetch(`http://localhost:5000/api/conversations/${id}/pin`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Failed to pin conversation on server:', error);
    }

    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  }, []);

  const toggleLikeMessage = useCallback(async (messageId: string) => {
    if (!currentConversation) return;

    const message = currentConversation.messages.find(m => m.id === messageId);
    if (!message) return;

    const newLiked = message.liked === null ? true : message.liked ? null : true;

    try {
      const token = localStorage.getItem('gymbot_token');
      if (token) {
        await fetch(`http://localhost:5000/api/conversations/${currentConversation.id}/messages/${messageId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ liked: newLiked }),
        });
      }
    } catch (error) {
      console.error('Failed to like message on server:', error);
    }

    const updatedMessages = currentConversation.messages.map((m) =>
      m.id === messageId ? { ...m, liked: newLiked } : m
    );
    setCurrentConversation({ ...currentConversation, messages: updatedMessages });
  }, [currentConversation]);

  const updateMessageCard = useCallback((messageId: string, cardId: string, newData: any) => {
    if (!currentConversation) return;

    const updatedMessages = currentConversation.messages.map((m) => {
      if (m.id === messageId && m.cards) {
        const updatedCards = m.cards.map((c) =>
          c.id === cardId ? { ...c, data: newData } : c
        );
        return { ...m, cards: updatedCards };
      }
      return m;
    });

    const updatedConv = { ...currentConversation, messages: updatedMessages };
    setCurrentConversation(updatedConv);
    setConversations((prev) =>
      prev.map((c) => (c.id === updatedConv.id ? updatedConv : c))
    );
  }, [currentConversation]);

  // Fetch validated plans/meals
  const fetchValidatedWorkouts = useCallback(async (jwtToken: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/workouts/plans', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setValidatedWorkouts(data);
      }
    } catch (error) {
      console.error('Error fetching validated workouts:', error);
    }
  }, []);

  const fetchValidatedMeals = useCallback(async (jwtToken: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/nutrition/plans', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setValidatedMeals(data);
      }
    } catch (error) {
      console.error('Error fetching validated meals:', error);
    }
  }, []);

  // Validate/Save plan operations
  const validateWorkout = useCallback(async (workout: any, startDate?: string, preventNavigation?: boolean) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/workouts/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(workout),
      });

      if (response.ok) {
        const data = await response.json();
        setValidatedWorkouts(prev => [data, ...prev]);
        
        // If a startDate is provided, schedule it immediately
        if (startDate) {
          const daysToSchedule = data.days && data.days.length > 0 ? data.days.length : 1;
          
          // Note: startDate is a string like "2026-06-30"
          const start = new Date(`${startDate}T00:00:00`); // Force local timezone interpretation of midnight

          for (let i = 0; i < daysToSchedule; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(currentDate.getDate() + i);
            const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            
            const schedRes = await fetch('http://localhost:5000/api/workouts/schedule', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ date: dateString, workoutPlanId: data._id, dayIndex: i }),
            });
            
            if (schedRes.ok) {
              const schedData = await schedRes.json();
              setWorkoutSchedule(prev => {
                const filtered = prev.filter(s => s.date !== dateString);
                return [...filtered, schedData];
              });
            }
          }
        }
        
        if (!preventNavigation) {
          setCurrentPage('workouts');
        }
        return data;
      } else {
        const err = await response.json();
        console.error('Validation error:', err.error);
      }
    } catch (error) {
      console.error('Error validating workout:', error);
      return null;
    }
  }, []);

  const validateNutrition = useCallback(async (meal: any, date?: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      const payload = {
        name: meal.name || meal.title || 'AI Meal Plan',
        type: meal.type || meal.mealType || 'snack',
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        ingredients: meal.ingredients || [],
        instructions: meal.instructions || [],
        createdAt: date || undefined
      };

      const response = await fetch('http://localhost:5000/api/nutrition/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setValidatedMeals(prev => [data, ...prev]);
        setCurrentPage('nutrition');
      } else {
        const err = await response.json();
        console.error('Validation error:', err.error);
      }
    } catch (error) {
      console.error('Error validating nutrition:', error);
    }
  }, []);

  const updateValidatedNutrition = useCallback(async (id: string, meal: any) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/nutrition/plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(meal),
      });

      if (response.ok) {
        const data = await response.json();
        setValidatedMeals(prev => prev.map(m => m._id === id ? data : m));
      }
    } catch (error) {
      console.error('Error updating nutrition plan:', error);
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(prev => prev ? {
          ...prev,
          height: data.height,
          weight: data.weight,
          goal: data.goal,
          targetCaloriesOverride: data.targetCaloriesOverride
        } : null);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }, []);

  const searchFoods = useCallback(async (query: string, category: string): Promise<FoodItem[]> => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return [];

      const url = new URL('http://localhost:5000/api/nutrition/foods');
      if (query) url.searchParams.append('search', query);
      if (category) url.searchParams.append('category', category);

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error searching foods:', error);
      return [];
    }
  }, []);

  const getFavorites = useCallback(async (): Promise<FoodItem[]> => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return [];

      const response = await fetch('http://localhost:5000/api/nutrition/foods/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }, []);

  const addFavorite = useCallback(async (foodId: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      await fetch('http://localhost:5000/api/nutrition/foods/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId }),
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }, []);

  const removeFavorite = useCallback(async (foodId: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      await fetch(`http://localhost:5000/api/nutrition/foods/favorites/${foodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }, []);

  const getRecents = useCallback(async (): Promise<FoodItem[]> => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return [];

      const response = await fetch('http://localhost:5000/api/nutrition/foods/recent', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error getting recents:', error);
      return [];
    }
  }, []);

  const addRecent = useCallback(async (foodId: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      await fetch('http://localhost:5000/api/nutrition/foods/recent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId }),
      });
    } catch (error) {
      console.error('Error adding recent:', error);
    }
  }, []);

  const deleteValidatedWorkout = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (token) {
        const response = await fetch(`http://localhost:5000/api/workouts/plans/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setValidatedWorkouts(prev => prev.filter(p => p._id !== id));
        }
      }
    } catch (error) {
      console.error('Failed to delete validated workout:', error);
    }
  }, []);

  const deleteValidatedNutrition = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (token) {
        const response = await fetch(`http://localhost:5000/api/nutrition/plans/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setValidatedMeals(prev => prev.filter(m => m._id !== id));
        }
      }
    } catch (error) {
      console.error('Failed to delete validated meal:', error);
    }
  }, []);

  // Fetch workout schedule
  const fetchWorkoutSchedule = useCallback(async (jwtToken: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/workouts/schedule', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWorkoutSchedule(data);
      }
    } catch (error) {
      console.error('Error fetching workout schedule:', error);
    }
  }, []);

  // Schedule a workout plan
  const scheduleWorkout = useCallback(async (date: string, workoutPlanId: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/workouts/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ date, workoutPlanId }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add to schedule (replacing any existing item on that day)
        setWorkoutSchedule(prev => {
          const filtered = prev.filter(s => s.date !== date);
          return [...filtered, data];
        });
      }
    } catch (error) {
      console.error('Error scheduling workout:', error);
    }
  }, []);

  // Remove a workout plan from schedule
  const unscheduleWorkout = useCallback(async (scheduleId: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/workouts/schedule/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWorkoutSchedule(prev => prev.filter(s => s._id !== scheduleId));
      }
    } catch (error) {
      console.error('Error unscheduling workout:', error);
    }
  }, []);

  const autoScheduleWorkout = useCallback(async (startDate: string, durationWeeks: number, trainDays: number, restDays: number, workoutPlanId: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/workouts/schedule/auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ startDate, durationWeeks, trainDays, restDays, workoutPlanId }),
      });

      if (response.ok) {
        // Refetch schedule to get the bulk updates
        await fetchWorkoutSchedule(token);
      }
    } catch (error) {
      console.error('Error auto-scheduling workout:', error);
    }
  }, [fetchWorkoutSchedule]);

  const insertRestDay = useCallback(async (date: string) => {
    try {
      const token = localStorage.getItem('gymbot_token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/workouts/schedule/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ date }),
      });

      if (response.ok) {
        // Refetch schedule to sync shifted dates
        await fetchWorkoutSchedule(token);
      }
    } catch (error) {
      console.error('Error inserting rest day:', error);
    }
  }, [fetchWorkoutSchedule]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        sidebarOpen,
        setSidebarOpen,
        conversations,
        currentConversation,
        setCurrentConversation,
        isStreaming,
        user,
        appLoading,
        sendMessage,
        createNewConversation,
        deleteConversation,
        renameConversation,
        pinConversation,
        toggleLikeMessage,
        login,
        signup,
        logout,
        validatedWorkouts,
        validatedMeals,
        validateWorkout,
        validateNutrition,
        updateValidatedNutrition,
        deleteValidatedWorkout,
        deleteValidatedNutrition,
        updateProfile,
        searchFoods,
        getFavorites,
        addFavorite,
        removeFavorite,
        getRecents,
        addRecent,
        workoutSchedule,
        scheduleWorkout,
        unscheduleWorkout,
        autoScheduleWorkout,
        insertRestDay,
        activeEditContext,
        setActiveEditContext,
        updateMessageCard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
