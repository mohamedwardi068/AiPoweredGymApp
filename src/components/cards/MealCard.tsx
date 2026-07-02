import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChefHat, ChevronDown, Check } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { MealCard as MealCardType } from '../../types';

interface MealCardProps {
  data: MealCardType;
}

const mealTypeIcons: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

const mealTypeColors: Record<string, string> = {
  breakfast: 'from-orange-500/20 to-yellow-500/20',
  lunch: 'from-green-500/20 to-blue-500/20',
  dinner: 'from-purple-500/20 to-blue-500/20',
  snack: 'from-pink-500/20 to-red-500/20',
};

export function MealCard({ data }: MealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  return (
    <GlassCard variant="elevated" padding="none" className="overflow-hidden">
      <motion.div
        className={`relative p-4 sm:p-5 bg-gradient-to-br ${mealTypeColors[data.type]}`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-dark-800/80 backdrop-blur flex items-center justify-center text-2xl">
            {mealTypeIcons[data.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-accent-green uppercase tracking-wider">
                {data.type}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">{data.name}</h3>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">{data.calories}</div>
            <div className="text-xs text-dark-400">kcal</div>
          </div>
        </div>

        <div className="relative flex gap-3 mt-4">
          <div className="flex-1 p-2 rounded-lg bg-dark-800/50 backdrop-blur text-center">
            <div className="text-sm font-bold text-accent-green">{data.protein}g</div>
            <div className="text-[10px] text-dark-400">Protein</div>
          </div>
          <div className="flex-1 p-2 rounded-lg bg-dark-800/50 backdrop-blur text-center">
            <div className="text-sm font-bold text-yellow-400">{data.carbs}g</div>
            <div className="text-[10px] text-dark-400">Carbs</div>
          </div>
          <div className="flex-1 p-2 rounded-lg bg-dark-800/50 backdrop-blur text-center">
            <div className="text-sm font-bold text-red-400">{data.fat}g</div>
            <div className="text-[10px] text-dark-400">Fat</div>
          </div>
        </div>
      </motion.div>

      <div className="p-4 sm:p-5 border-t border-dark-700">
        <motion.button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-sm"
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center gap-2 text-accent-green">
            <ChefHat className="w-4 h-4" />
            <span>View Recipe</span>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-dark-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Ingredients</h4>
                  <div className="space-y-1">
                    {data.ingredients.map((ingredient, index) => (
                      <motion.button
                        key={ingredient}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => toggleIngredient(index)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                          checkedIngredients.has(index)
                            ? 'bg-accent-green/10 text-accent-green line-through'
                            : 'text-dark-300 hover:bg-dark-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          checkedIngredients.has(index)
                            ? 'bg-accent-green border-accent-green'
                            : 'border-dark-600'
                        }`}>
                          {checkedIngredients.has(index) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        {ingredient}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Instructions</h4>
                  <div className="space-y-2">
                    {data.instructions.map((instruction, index) => (
                      <motion.div
                        key={instruction}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 text-sm text-dark-300"
                      >
                        <div className="w-5 h-5 rounded bg-dark-700 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                          {index + 1}
                        </div>
                        <span>{instruction}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
