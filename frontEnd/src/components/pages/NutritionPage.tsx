import { motion } from 'framer-motion';
import { useState } from 'react';
import { Apple, Plus, Search, Target, Zap } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

const MACRO_TARGETS = {
  calories: { current: 1650, target: 2000, label: 'Calories', unit: 'kcal', color: 'green' },
  protein: { current: 125, target: 180, label: 'Protein', unit: 'g', color: 'blue' },
  carbs: { current: 180, target: 200, label: 'Carbs', unit: 'g', color: 'yellow' },
  fat: { current: 58, target: 65, label: 'Fat', unit: 'g', color: 'red' },
};

const MEALS = [
  {
    type: 'Breakfast',
    time: '8:00 AM',
    items: [
      { name: 'Overnight Oats', calories: 350, protein: 25 },
      { name: 'Coffee with Milk', calories: 40, protein: 2 },
    ],
  },
  {
    type: 'Lunch',
    time: '12:30 PM',
    items: [
      { name: 'Grilled Chicken Salad', calories: 480, protein: 45 },
      { name: 'Whole Wheat Bread', calories: 120, protein: 5 },
    ],
  },
  {
    type: 'Snack',
    time: '3:30 PM',
    items: [
      { name: 'Protein Shake', calories: 180, protein: 30 },
      { name: 'Banana', calories: 105, protein: 1 },
    ],
  },
  {
    type: 'Dinner',
    time: '7:00 PM',
    items: [
      { name: 'Salmon with Quinoa', calories: 580, protein: 42 },
      { name: 'Steamed Vegetables', calories: 80, protein: 4 },
    ],
  },
];

export function NutritionPage() {
  const { validatedMeals, deleteValidatedNutrition } = useApp();
  const [activeTab, setActiveTab] = useState('today');

  const dynamicMeals = MEALS.map(meal => {
    const matchedValidated = validatedMeals.filter(
      (m: any) => m.type.toLowerCase() === meal.type.toLowerCase()
    );
    
    return {
      ...meal,
      items: [
        ...meal.items,
        ...matchedValidated.map((m: any) => ({
          id: m._id,
          name: m.name,
          calories: m.calories,
          protein: m.protein,
          isCustom: true
        }))
      ]
    };
  });

  const totalMeals = dynamicMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.items.reduce((sum, item) => sum + item.calories, 0),
    protein: acc.protein + meal.items.reduce((sum, item) => sum + item.protein, 0),
  }), { calories: 0, protein: 0 });

  return (
    <div className="min-h-screen bg-dark-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Nutrition</h1>
              <p className="text-dark-400">Track your meals and macros</p>
            </div>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Log Meal
            </Button>
          </div>

          <div className="flex gap-2 mb-4">
            {['today', 'week', 'month'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-dark-800 text-white border border-dark-700'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <GlassCard>
            <h2 className="text-sm font-semibold text-dark-500 uppercase tracking-wider mb-4">
              Macro Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {Object.entries(MACRO_TARGETS).map(([key, macro], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 sm:p-4 bg-dark-800/50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-400">{macro.label}</span>
                    <span className={`text-sm font-medium ${
                      macro.color === 'green' ? 'text-accent-green' :
                      macro.color === 'blue' ? 'text-accent-blue' :
                      macro.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {macro.current}/{macro.target}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        macro.color === 'green' ? 'bg-gradient-to-r from-accent-green to-accent-green-light' :
                        macro.color === 'blue' ? 'bg-gradient-to-r from-accent-blue to-accent-blue-light' :
                        macro.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(macro.current / macro.target) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Today's Meals</h2>
                  <span className="text-sm text-dark-400">
                    {totalMeals.calories} kcal | {totalMeals.protein}g protein
                  </span>
                </div>

                <div className="space-y-3">
                  {dynamicMeals.map((meal, index) => (
                    <motion.div
                      key={meal.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="p-3 sm:p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center">
                            <Apple className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{meal.type}</h3>
                            <span className="text-xs text-dark-500">{meal.time}</span>
                          </div>
                        </div>
                        <button className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 mt-3">
                        {meal.items.map((item: any) => (
                          <div key={item.name} className="flex items-center justify-between text-sm group/item">
                            <span className="text-dark-300">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-dark-400">{item.calories} kcal</span>
                              <span className="text-accent-green">{item.protein}g</span>
                              {item.isCustom && (
                                <button
                                  onClick={() => deleteValidatedNutrition(item.id)}
                                  className="text-xs text-red-500 hover:text-red-400 transition-colors ml-1 font-bold text-base leading-none p-0.5"
                                  title="Remove meal"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard>
                <h2 className="text-lg font-semibold text-white mb-4">Water Intake</h2>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * 0.7}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        transition={{ duration: 1 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-blue">2.1L</div>
                        <div className="text-xs text-dark-400">/ 3L</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-6 h-8 rounded ${
                        i < 6 ? 'bg-accent-blue/30' : 'bg-dark-700'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    />
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard>
                <h2 className="text-lg font-semibold text-white mb-4">Quick Tools</h2>
                <div className="space-y-2">
                  <Button variant="secondary" className="w-full justify-start" icon={<Target className="w-4 h-4" />}>
                    Macro Calculator
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" icon={<Search className="w-4 h-4" />}>
                    Food Database
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" icon={<Zap className="w-4 h-4" />}>
                    Generate Meal Plan
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
