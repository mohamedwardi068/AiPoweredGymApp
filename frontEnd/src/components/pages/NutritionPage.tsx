import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Apple, Plus, Search, Target, Edit, Trash2, Copy, 
  Star, X, Scale, Info
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { FoodItem } from '../../types';

export function NutritionPage() {
  const { 
    user, 
    updateProfile, 
    validatedMeals, 
    validateNutrition, 
    updateValidatedNutrition, 
    deleteValidatedNutrition,
    searchFoods,
    getFavorites,
    addFavorite,
    removeFavorite,
    getRecents,
    addRecent
  } = useApp();

  // Navigation and Modal tab states
  const [activePeriod, setActivePeriod] = useState<'today' | 'week' | 'month'>('today');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showFoodDbModal, setShowFoodDbModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any | null>(null);

  // Profile Form States
  const [heightInput, setHeightInput] = useState(user?.height || 175);
  const [weightInput, setWeightInput] = useState(user?.weight || 70);
  const [goalInput, setGoalInput] = useState<'bulk' | 'cut' | 'maintain'>(user?.goal || 'maintain');
  const [overrideCalInput, setOverrideCalInput] = useState(user?.targetCaloriesOverride ? String(user?.targetCaloriesOverride) : '');
  const [useOverride, setUseOverride] = useState(!!user?.targetCaloriesOverride);

  // Log Meal Form States
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [selectedIngredients, setSelectedIngredients] = useState<{ food: FoodItem; quantity: number }[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [ingredientCategory, setIngredientCategory] = useState('All');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [favoritesList, setFavoritesList] = useState<FoodItem[]>([]);
  const [recentsList, setRecentsList] = useState<FoodItem[]>([]);
  const [foodTab, setFoodTab] = useState<'search' | 'favorites' | 'recents'>('search');
  const [logTime, setLogTime] = useState(new Date().toISOString().substring(0, 16));

  // Sync profile input fields with user context changes
  useEffect(() => {
    if (user) {
      setHeightInput(user.height || 175);
      setWeightInput(user.weight || 70);
      setGoalInput(user.goal || 'maintain');
      setOverrideCalInput(user.targetCaloriesOverride ? String(user.targetCaloriesOverride) : '');
      setUseOverride(!!user.targetCaloriesOverride);
    }
  }, [user]);

  // Load food data databases when modals open
  useEffect(() => {
    if (showLogModal || showFoodDbModal || editingMeal) {
      loadFavoritesAndRecents();
      triggerFoodSearch();
    }
  }, [showLogModal, showFoodDbModal, editingMeal, ingredientSearch, ingredientCategory]);

  const loadFavoritesAndRecents = async () => {
    const favs = await getFavorites();
    const recs = await getRecents();
    setFavoritesList(favs);
    setRecentsList(recs);
  };

  const triggerFoodSearch = async () => {
    const res = await searchFoods(ingredientSearch, ingredientCategory);
    setSearchResults(res);
  };

  // Profile calculations
  const weight = user?.weight || 70;
  const height = user?.height || 175;
  const goal = user?.goal || 'maintain';

  // Mifflin-St Jeor formula (moderately active standard factor 1.375)
  const bmr = 10 * weight + 6.25 * height - 125;
  const maintenanceCalories = Math.round(bmr * 1.375);
  
  let calculatedTarget = maintenanceCalories;
  if (goal === 'bulk') calculatedTarget += 500;
  else if (goal === 'cut') calculatedTarget -= 500;

  const dailyTargetCalories = user?.targetCaloriesOverride || calculatedTarget;

  // Macros Calculation: Protein (2g per kg), Fat (25% calories), Carbs (Rest)
  const targetProtein = Math.round(weight * 2.0);
  const targetFat = Math.round((dailyTargetCalories * 0.25) / 9);
  const targetCarbs = Math.round((dailyTargetCalories - (targetProtein * 4) - (targetFat * 9)) / 4);

  // Time period filters
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const currentDay = now.getDay();
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday);
  
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Filter logged meals for calculations
  const getMealsForPeriod = (period: 'today' | 'week' | 'month') => {
    if (period === 'today') {
      return validatedMeals.filter(m => new Date(m.createdAt) >= startOfToday);
    } else if (period === 'week') {
      return validatedMeals.filter(m => new Date(m.createdAt) >= startOfThisWeek);
    } else {
      return validatedMeals.filter(m => new Date(m.createdAt) >= startOfThisMonth);
    }
  };

  const periodMeals = getMealsForPeriod(activePeriod);

  // Calculations for dashboards
  const calculateMacros = (meals: any[]) => {
    return meals.reduce((acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };


  const getTargetForPeriod = (period: 'today' | 'week' | 'month') => {
    if (period === 'today') return dailyTargetCalories;
    if (period === 'week') return dailyTargetCalories * 7;
    return dailyTargetCalories * 30;
  };

  const periodStats = calculateMacros(periodMeals);
  const periodTarget = getTargetForPeriod(activePeriod);
  const periodRemaining = Math.max(0, periodTarget - periodStats.calories);
  const periodPercent = Math.min(100, Math.round((periodStats.calories / periodTarget) * 100));

  // Profile setup handler
  const handleSaveProfile = async () => {
    const overrideVal = useOverride && overrideCalInput ? parseInt(overrideCalInput) : null;
    await updateProfile({
      height: heightInput,
      weight: weightInput,
      goal: goalInput,
      targetCaloriesOverride: overrideVal
    });
    setShowProfileModal(false);
  };

  // Adding ingredients helper
  const addIngredientToMeal = (food: FoodItem) => {
    const existing = selectedIngredients.find(i => i.food._id === food._id);
    if (existing) {
      setSelectedIngredients(selectedIngredients.map(i => 
        i.food._id === food._id ? { ...i, quantity: i.quantity + 100 } : i
      ));
    } else {
      setSelectedIngredients([...selectedIngredients, { food, quantity: 100 }]);
    }
    addRecent(food._id); // log as recent food
  };

  const removeIngredientFromMeal = (foodId: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.food._id !== foodId));
  };

  const updateIngredientQuantity = (foodId: string, quantity: number) => {
    setSelectedIngredients(selectedIngredients.map(i => 
      i.food._id === foodId ? { ...i, quantity: Math.max(1, quantity) } : i
    ));
  };

  // Calculate live meal totals in modal
  const liveMealTotals = selectedIngredients.reduce((acc, item) => {
    const factor = item.quantity / 100;
    return {
      calories: acc.calories + Math.round(item.food.calories * factor),
      protein: acc.protein + Math.round(item.food.protein * factor),
      carbs: acc.carbs + Math.round(item.food.carbs * factor),
      fat: acc.fat + Math.round(item.food.fat * factor),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Handle manual meal logging submit
  const handleSaveManualMeal = async () => {
    if (!mealName.trim()) return;

    const mealData = {
      name: mealName.trim(),
      type: mealType,
      calories: liveMealTotals.calories,
      protein: liveMealTotals.protein,
      carbs: liveMealTotals.carbs,
      fat: liveMealTotals.fat,
      ingredients: selectedIngredients.map(i => `${i.quantity}g ${i.food.name}`),
      instructions: ['Log manually generated ingredient list'],
    };

    if (editingMeal) {
      await updateValidatedNutrition(editingMeal._id, {
        ...mealData,
        createdAt: logTime
      });
      setEditingMeal(null);
    } else {
      await validateNutrition(mealData, logTime);
    }

    // Reset Form
    setMealName('');
    setSelectedIngredients([]);
    setShowLogModal(false);
  };

  // Duplicate a meal for today
  const handleDuplicateMeal = async (meal: any) => {
    const duplicated = {
      name: meal.name,
      type: meal.type,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      ingredients: meal.ingredients,
      instructions: meal.instructions
    };
    await validateNutrition(duplicated);
  };

  // Set meal up for editing
  const startEditingMeal = (meal: any) => {
    setEditingMeal(meal);
    setMealName(meal.name);
    setMealType(meal.type);
    setLogTime(new Date(meal.createdAt).toISOString().substring(0, 16));
    
    // Parse text ingredients back to items if possible or create stub food items
    const parsedIngredients = meal.ingredients.map((ingStr: string) => {
      const match = ingStr.match(/^(\d+)g\s+(.+)$/);
      const qty = match ? parseInt(match[1]) : 100;
      const name = match ? match[2] : ingStr;
      
      const stubFood: FoodItem = {
        _id: Math.random().toString(),
        name,
        category: 'Parsed',
        calories: Math.round((meal.calories / meal.ingredients.length) / (qty / 100)),
        protein: Math.round((meal.protein / meal.ingredients.length) / (qty / 100)),
        carbs: Math.round((meal.carbs / meal.ingredients.length) / (qty / 100)),
        fat: Math.round((meal.fat / meal.ingredients.length) / (qty / 100)),
        servingSize: '100g'
      };
      return { food: stubFood, quantity: qty };
    });
    setSelectedIngredients(parsedIngredients);
  };

  const handleFavoriteToggle = async (food: FoodItem) => {
    const isFav = favoritesList.some(f => f._id === food._id);
    if (isFav) {
      await removeFavorite(food._id);
    } else {
      await addFavorite(food._id);
    }
    loadFavoritesAndRecents();
  };

  return (
    <div className="min-h-screen bg-dark-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Title and Setup Profile Widget */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Apple className="w-8 h-8 text-accent-green" />
              Nutrition Dashboard
            </h1>
            <p className="text-dark-400">Track and refine your nutritional calorie goals</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              icon={<Star className="w-4 h-4 text-yellow-400" />}
              onClick={() => setShowFoodDbModal(true)}
            >
              Food Database
            </Button>
            <Button 
              variant="primary" 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingMeal(null);
                setMealName('');
                setSelectedIngredients([]);
                setLogTime(new Date().toISOString().substring(0, 16));
                setShowLogModal(true);
              }}
            >
              Log Meal
            </Button>
          </div>
        </div>

        {/* Profile Goal Card (Injects context to Gemini) */}
        <GlassCard variant="elevated" className="overflow-hidden relative border-accent-blue/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-bl-full pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-green/20 flex items-center justify-center border border-accent-blue/30">
                <Target className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">Goals & Internal Context</h2>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-accent-blue/20 text-accent-blue rounded-full capitalize">
                    {goal}
                  </span>
                </div>
                <p className="text-xs text-dark-400 mt-0.5">
                  Height: <span className="text-white font-medium">{height} cm</span> | 
                  Weight: <span className="text-white font-medium">{weight} kg</span> | 
                  Target: <span className="text-white font-medium">{dailyTargetCalories} kcal</span>
                  {user?.targetCaloriesOverride && <span className="ml-1.5 text-[10px] text-yellow-400">(Manual Override)</span>}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setShowProfileModal(true)}>
              Edit Profile & Goals
            </Button>
          </div>
        </GlassCard>

        {/* Nutrition Dashboard Stats tabs */}
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['today', 'week', 'month'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActivePeriod(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activePeriod === tab
                    ? 'bg-dark-800 text-white border border-dark-700 shadow-md shadow-black/20'
                    : 'text-dark-400 hover:text-white hover:bg-dark-900/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Dashboard
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            
            {/* Dashboard Core Tracker card */}
            <GlassCard className="md:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs text-dark-400">
                  Calorie Tracking Summary
                </h3>
                <span className="text-xs text-accent-green font-semibold">
                  {periodPercent}% Consumed
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-dark-900/40 p-3 rounded-xl border border-dark-800">
                  <div className="text-2xl font-black text-white">{periodStats.calories}</div>
                  <div className="text-[10px] text-dark-400 uppercase tracking-widest mt-1">Consumed</div>
                </div>
                <div className="bg-dark-900/40 p-3 rounded-xl border border-dark-800">
                  <div className="text-2xl font-black text-accent-blue">{periodTarget}</div>
                  <div className="text-[10px] text-dark-400 uppercase tracking-widest mt-1">Target</div>
                </div>
                <div className="bg-dark-900/40 p-3 rounded-xl border border-dark-800">
                  <div className="text-2xl font-black text-accent-green">{periodRemaining}</div>
                  <div className="text-[10px] text-dark-400 uppercase tracking-widest mt-1">Remaining</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden p-0.5 border border-dark-700">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent-green via-accent-green-light to-accent-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${periodPercent}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Macro Breakdown card */}
            <GlassCard className="space-y-4">
              <h3 className="font-bold text-white uppercase tracking-wider text-xs text-dark-400">
                Macro Totals ({activePeriod})
              </h3>
              
              <div className="space-y-3">
                {/* Protein */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-300 font-medium">Protein</span>
                    <span className="text-white font-semibold">{periodStats.protein}g / {activePeriod === 'today' ? targetProtein : targetProtein * (activePeriod === 'week' ? 7 : 30)}g</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-blue rounded-full" 
                      style={{ width: `${Math.min(100, (periodStats.protein / (activePeriod === 'today' ? targetProtein : targetProtein * (activePeriod === 'week' ? 7 : 30))) * 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Carbs */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-300 font-medium">Carbs</span>
                    <span className="text-white font-semibold">{periodStats.carbs}g / {activePeriod === 'today' ? targetCarbs : targetCarbs * (activePeriod === 'week' ? 7 : 30)}g</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ width: `${Math.min(100, (periodStats.carbs / (activePeriod === 'today' ? targetCarbs : targetCarbs * (activePeriod === 'week' ? 7 : 30))) * 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Fat */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-300 font-medium">Fat</span>
                    <span className="text-white font-semibold">{periodStats.fat}g / {activePeriod === 'today' ? targetFat : targetFat * (activePeriod === 'week' ? 7 : 30)}g</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ width: `${Math.min(100, (periodStats.fat / (activePeriod === 'today' ? targetFat : targetFat * (activePeriod === 'week' ? 7 : 30))) * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Dashboard visual graphs section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <GlassCard>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Calorie Intake Trends</h2>
                <div className="flex gap-1.5 text-xs text-dark-400">
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-accent-green rounded-sm" /> Intake</div>
                  <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-accent-blue rounded-sm" /> Target</div>
                </div>
              </div>

              {/* Simple CSS bar chart representing past 7 days */}
              <div className="h-48 flex items-end justify-between gap-2 pt-6">
                {[...Array(7)].map((_, i) => {
                  const dayDate = new Date();
                  dayDate.setDate(dayDate.getDate() - (6 - i));
                  const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  // Filter meals logged on this specific calendar day
                  const dStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
                  const dEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() + 1);
                  const dMeals = validatedMeals.filter(m => {
                    const c = new Date(m.createdAt);
                    return c >= dStart && c < dEnd;
                  });
                  const dCals = dMeals.reduce((sum, m) => sum + m.calories, 0);
                  const isToday = i === 6;

                  const percentIntake = Math.min(100, (dCals / dailyTargetCalories) * 100);

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full relative bg-dark-800/40 rounded-lg flex flex-col justify-end h-full overflow-hidden border border-dark-800">
                        {/* Target line indicator */}
                        <div className="absolute left-0 right-0 border-t border-accent-blue/30 border-dashed" style={{ bottom: '70%' }} title="Target Calorie Line" />
                        
                        <motion.div 
                          className={`w-full rounded-t-md bg-gradient-to-t ${
                            percentIntake > 100 
                              ? 'from-red-600 to-red-400' 
                              : isToday 
                              ? 'from-accent-green to-accent-green-light'
                              : 'from-dark-700 to-dark-600'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: `${percentIntake}%` }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                        />
                      </div>
                      <span className={`text-[10px] uppercase font-semibold ${isToday ? 'text-accent-green font-bold' : 'text-dark-400'}`}>
                        {dayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Quick Info & Tips card */}
          <div className="space-y-4">
            <GlassCard className="relative overflow-hidden bg-gradient-to-br from-dark-900/60 to-dark-800/50">
              <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-accent-green" />
                Nutrition Coach Tip
              </h3>
              <p className="text-sm text-dark-300 leading-relaxed">
                {goal === 'bulk' && "To build clean muscle mass, consume a slight surplus (+500 kcal) and maintain high protein intake (2g per kg) to facilitate hypertrophy."}
                {goal === 'cut' && "To maximize fat loss while preserving lean tissue, ensure a controlled caloric deficit (-500 kcal) and stay consistent with weight training."}
                {goal === 'maintain' && "Maintaining weight is ideal for body recomposition. Keep your calories in balance while focusing on progressive overload in the gym."}
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Meal History Tracker */}
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Meal History Log</h2>
              <p className="text-xs text-dark-400">Modify, duplicate, or delete your previous meal entries</p>
            </div>
            <span className="text-xs text-dark-300 font-medium">
              {validatedMeals.length} Total Meals Logged
            </span>
          </div>

          <div className="space-y-3">
            {validatedMeals.length === 0 ? (
              <div className="text-center py-8 bg-dark-900/20 rounded-xl border border-dark-900">
                <p className="text-sm text-dark-400">No meals logged yet. Click "Log Meal" or ask GymBot in the chat to suggest something!</p>
              </div>
            ) : (
              validatedMeals.map((meal) => {
                const mealDate = new Date(meal.createdAt);
                const timeString = mealDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateString = mealDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

                return (
                  <motion.div
                    key={meal._id}
                    layout
                    className="p-4 bg-dark-900/40 border border-dark-800 rounded-xl hover:bg-dark-900/80 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-xl flex-shrink-0 border border-dark-700">
                        {meal.type === 'breakfast' && '🌅'}
                        {meal.type === 'lunch' && '☀️'}
                        {meal.type === 'dinner' && '🌙'}
                        {meal.type === 'snack' && '🍎'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white leading-tight">{meal.name}</h4>
                        <span className="text-[10px] text-dark-400 capitalize bg-dark-800 px-1.5 py-0.5 rounded mr-2 inline-block">
                          {meal.type}
                        </span>
                        <span className="text-[10px] text-dark-400">
                          {dateString} at {timeString}
                        </span>
                        {meal.ingredients && meal.ingredients.length > 0 && (
                          <p className="text-xs text-dark-400 mt-1 truncate max-w-md">
                            {meal.ingredients.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-dark-800/40 sm:border-0 pt-3 sm:pt-0">
                      <div className="text-right">
                        <div className="font-bold text-white">{meal.calories} kcal</div>
                        <div className="text-[10px] text-dark-500 font-mono">
                          P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            startEditingMeal(meal);
                            setShowLogModal(true);
                          }}
                          className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
                          title="Edit meal"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateMeal(meal)}
                          className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
                          title="Duplicate meal for today"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteValidatedNutrition(meal._id)}
                          className="p-2 rounded-lg text-red-500/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete meal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </GlassCard>

      </div>

      {/* MODAL 1: Edit Profile & Goals */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-accent-green" />
                  User Profile Setup
                </h3>
                <button onClick={() => setShowProfileModal(false)} className="text-dark-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Height */}
                <div className="space-y-1">
                  <label className="text-xs text-dark-400 font-semibold uppercase tracking-wider">Height (cm)</label>
                  <input
                    type="number"
                    value={heightInput}
                    onChange={(e) => setHeightInput(parseInt(e.target.value) || 0)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2 text-white font-semibold focus:outline-none focus:border-accent-green"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-1">
                  <label className="text-xs text-dark-400 font-semibold uppercase tracking-wider">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightInput}
                    onChange={(e) => setWeightInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2 text-white font-semibold focus:outline-none focus:border-accent-green"
                  />
                </div>

                {/* Goal Selector */}
                <div className="space-y-1">
                  <label className="text-xs text-dark-400 font-semibold uppercase tracking-wider">Goal</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['bulk', 'cut', 'maintain'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGoalInput(g)}
                        className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                          goalInput === g
                            ? 'bg-accent-green/20 border-accent-green text-white shadow'
                            : 'bg-dark-800 border-dark-700 text-dark-400 hover:text-white'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calorie Override option */}
                <div className="space-y-2 pt-2 border-t border-dark-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-300 font-medium">Manually Override Calories</span>
                    <button
                      type="button"
                      onClick={() => setUseOverride(!useOverride)}
                      className={`w-9 h-5 rounded-full transition-colors flex items-center p-0.5 ${
                        useOverride ? 'bg-accent-green justify-end' : 'bg-dark-800 justify-start border border-dark-700'
                      }`}
                    >
                      <motion.div className="w-4 h-4 bg-white rounded-full" layout />
                    </button>
                  </div>

                  {useOverride && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1"
                    >
                      <label className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">Custom Target Calories (kcal)</label>
                      <input
                        type="number"
                        placeholder="e.g. 2500"
                        value={overrideCalInput}
                        onChange={(e) => setOverrideCalInput(e.target.value)}
                        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2 text-white font-semibold focus:outline-none focus:border-accent-green"
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" className="w-full" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="w-full" onClick={handleSaveProfile}>
                  Save Setup
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Manual Log Meal Form & Edit Meal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Apple className="w-5 h-5 text-accent-green" />
                  {editingMeal ? 'Edit Logged Meal' : 'Create Custom Meal'}
                </h3>
                <button onClick={() => setShowLogModal(false)} className="text-dark-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                
                {/* Left side: Meal properties & chosen ingredients */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">Meal Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Chicken Rice bowl"
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2 text-white font-semibold focus:outline-none focus:border-accent-green text-sm"
                    />
                  </div>

                  {/* Meal Type & Date Time */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">Meal Type</label>
                      <select
                        value={mealType}
                        onChange={(e: any) => setMealType(e.target.value)}
                        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-accent-green text-sm"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider">Date & Time</label>
                      <input
                        type="datetime-local"
                        value={logTime}
                        onChange={(e) => setLogTime(e.target.value)}
                        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-2 py-1.5 text-white font-semibold focus:outline-none focus:border-accent-green text-xs"
                      />
                    </div>
                  </div>

                  {/* Selected Ingredients weights adjustment */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider block">Ingredients list</label>
                    
                    {selectedIngredients.length === 0 ? (
                      <p className="text-xs text-dark-500 italic">No ingredients added yet. Search on the right side to add.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {selectedIngredients.map((item) => (
                          <div key={item.food._id} className="flex justify-between items-center bg-dark-950 p-2 rounded-xl border border-dark-800 gap-2">
                            <span className="text-xs text-white font-semibold truncate flex-1">{item.food.name}</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateIngredientQuantity(item.food._id, parseInt(e.target.value) || 0)}
                                className="w-16 bg-dark-800 border border-dark-700 rounded-lg px-2 py-0.5 text-white text-center text-xs"
                              />
                              <span className="text-xs text-dark-400">g</span>
                              <button
                                onClick={() => removeIngredientFromMeal(item.food._id)}
                                className="text-red-500 hover:text-red-400"
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Live calculations */}
                  <div className="bg-dark-950/60 p-3 rounded-xl border border-dark-800 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-white border-b border-dark-800 pb-1">
                      <span>Live Total Calories</span>
                      <span className="text-accent-green">{liveMealTotals.calories} kcal</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center font-semibold text-dark-300">
                      <div>P: <span className="text-white">{liveMealTotals.protein}g</span></div>
                      <div>C: <span className="text-white">{liveMealTotals.carbs}g</span></div>
                      <div>F: <span className="text-white">{liveMealTotals.fat}g</span></div>
                    </div>
                  </div>
                </div>

                {/* Right side: Searchable ingredient DB */}
                <div className="border-l border-dark-850 pl-0 md:pl-4 space-y-3">
                  <div className="flex gap-2">
                    {/* Database categories selector tab */}
                    {(['search', 'favorites', 'recents'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setFoodTab(tab)}
                        className={`flex-1 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                          foodTab === tab 
                            ? 'bg-dark-800 text-white' 
                            : 'text-dark-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {foodTab === 'search' && (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-dark-500" />
                        <input
                          type="text"
                          placeholder="Search Chicken, Rice..."
                          value={ingredientSearch}
                          onChange={(e) => setIngredientSearch(e.target.value)}
                          className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-9 pr-4 py-2 text-white text-xs focus:outline-none focus:border-accent-green"
                        />
                      </div>
                      <select
                        value={ingredientCategory}
                        onChange={(e) => setIngredientCategory(e.target.value)}
                        className="bg-dark-800 border border-dark-700 rounded-xl px-2 py-1 text-white text-xs"
                      >
                        <option value="All">All</option>
                        <option value="Protein">Protein</option>
                        <option value="Carbs">Carbs</option>
                        <option value="Fats">Fats</option>
                        <option value="Grains">Grains</option>
                        <option value="Supplements">Supplements</option>
                      </select>
                    </div>
                  )}

                  {/* Food Database lists rendering */}
                  <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                    {foodTab === 'search' && searchResults.map((food) => (
                      <div 
                        key={food._id}
                        className="flex justify-between items-center p-2 rounded-xl bg-dark-800/40 hover:bg-dark-800 border border-dark-800/80 transition-colors text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{food.name}</div>
                          <div className="text-[10px] text-dark-400">
                            {food.calories} kcal | P:{food.protein}g C:{food.carbs}g F:{food.fat}g ({food.servingSize})
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleFavoriteToggle(food)}
                            className="p-1 rounded text-yellow-500 hover:bg-dark-700"
                          >
                            <Star className={`w-3.5 h-3.5 ${favoritesList.some(f => f._id === food._id) ? 'fill-yellow-500' : ''}`} />
                          </button>
                          <button
                            onClick={() => addIngredientToMeal(food)}
                            className="px-2 py-1 rounded bg-accent-green/20 text-accent-green hover:bg-accent-green hover:text-white"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}

                    {foodTab === 'favorites' && favoritesList.map((food) => (
                      <div 
                        key={food._id}
                        className="flex justify-between items-center p-2 rounded-xl bg-dark-800/40 hover:bg-dark-800 border border-dark-800/80 transition-colors text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{food.name}</div>
                          <div className="text-[10px] text-dark-400">
                            {food.calories} kcal | P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                          </div>
                        </div>
                        <button
                          onClick={() => addIngredientToMeal(food)}
                          className="px-2 py-1 rounded bg-accent-green/20 text-accent-green hover:bg-accent-green hover:text-white"
                        >
                          Add
                        </button>
                      </div>
                    ))}

                    {foodTab === 'recents' && recentsList.map((food) => (
                      <div 
                        key={food._id}
                        className="flex justify-between items-center p-2 rounded-xl bg-dark-800/40 hover:bg-dark-800 border border-dark-800/80 transition-colors text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{food.name}</div>
                          <div className="text-[10px] text-dark-400">
                            {food.calories} kcal | P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                          </div>
                        </div>
                        <button
                          onClick={() => addIngredientToMeal(food)}
                          className="px-2 py-1 rounded bg-accent-green/20 text-accent-green hover:bg-accent-green hover:text-white"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-dark-850">
                <Button variant="secondary" className="w-full" onClick={() => setShowLogModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="w-full" onClick={handleSaveManualMeal} disabled={!mealName || selectedIngredients.length === 0}>
                  {editingMeal ? 'Save Changes' : 'Log Meal'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Food Database Manager */}
      <AnimatePresence>
        {showFoodDbModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  Searchable Food Database
                </h3>
                <button onClick={() => setShowFoodDbModal(false)} className="text-dark-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-dark-500" />
                  <input
                    type="text"
                    placeholder="Search food by name..."
                    value={ingredientSearch}
                    onChange={(e) => setIngredientSearch(e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-accent-green"
                  />
                </div>
                <select
                  value={ingredientCategory}
                  onChange={(e) => setIngredientCategory(e.target.value)}
                  className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-white text-sm"
                >
                  <option value="All">All Categories</option>
                  <option value="Protein">Protein</option>
                  <option value="Carbs">Carbs</option>
                  <option value="Fats">Fats</option>
                  <option value="Grains">Grains</option>
                  <option value="Supplements">Supplements</option>
                </select>
              </div>

              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                {searchResults.length === 0 ? (
                  <p className="text-center py-6 text-dark-400 text-sm">No food items found matching criteria.</p>
                ) : (
                  searchResults.map((food) => (
                    <div 
                      key={food._id}
                      className="p-3 bg-dark-850/60 rounded-xl border border-dark-800 hover:bg-dark-800 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{food.name}</div>
                        <div className="text-xs text-dark-400 mt-0.5">
                          Category: <span className="text-accent-blue font-medium">{food.category}</span> | Serving: {food.servingSize}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right text-xs">
                          <div className="font-bold text-white">{food.calories} kcal</div>
                          <div className="text-[10px] text-dark-500 font-mono">
                            P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                          </div>
                        </div>

                        <button
                          onClick={() => handleFavoriteToggle(food)}
                          className="p-2 rounded-lg hover:bg-dark-700 text-yellow-500"
                        >
                          <Star className={`w-4 h-4 ${favoritesList.some(f => f._id === food._id) ? 'fill-yellow-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Button variant="secondary" className="w-full" onClick={() => setShowFoodDbModal(false)}>
                Close Database
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
