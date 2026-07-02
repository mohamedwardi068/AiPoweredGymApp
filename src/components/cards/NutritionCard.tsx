import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NutritionCard as NutritionCardType } from '../../types';

interface NutritionCardProps {
  data: NutritionCardType;
}

export function NutritionCard({ data }: NutritionCardProps) {
  const proteinPercent = Math.round((data.protein * 4 / data.calories) * 100);
  const carbsPercent = Math.round((data.carbs * 4 / data.calories) * 100);
  const fatPercent = Math.round((data.fat * 9 / data.calories) * 100);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const proteinOffset = circumference - (proteinPercent / 100) * circumference;
  const carbsOffset = circumference - (carbsPercent / 100) * circumference;
  const fatOffset = circumference - (fatPercent / 100) * circumference;

  return (
    <GlassCard variant="elevated" className="overflow-hidden">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: fatOffset }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r={radius - 10}
              fill="none"
              stroke="#eab308"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference - 20}
              initial={{ strokeDashoffset: circumference - 20 }}
              animate={{ strokeDashoffset: carbsOffset * 0.8 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r={radius - 20}
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference - 40}
              initial={{ strokeDashoffset: circumference - 40 }}
              animate={{ strokeDashoffset: proteinOffset * 0.6 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{data.calories}</div>
              <div className="text-[10px] text-dark-400">kcal</div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-3">{data.name}</h3>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-accent-green/10 border border-accent-green/20">
              <div className="text-lg font-bold text-accent-green">{data.protein}g</div>
              <div className="text-xs text-dark-400">Protein</div>
            </div>
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-lg font-bold text-yellow-400">{data.carbs}g</div>
              <div className="text-xs text-dark-400">Carbs</div>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="text-lg font-bold text-red-400">{data.fat}g</div>
              <div className="text-xs text-dark-400">Fat</div>
            </div>
          </div>
        </div>
      </div>

      {(data.fiber || data.sugar || data.servings) && (
        <div className="flex flex-wrap gap-3 pt-3 border-t border-dark-700">
          {data.fiber && (
            <div className="flex items-center gap-1.5 text-sm text-dark-400">
              <Droplets className="w-4 h-4 text-accent-blue" />
              <span>Fiber: {data.fiber}g</span>
            </div>
          )}
          {data.sugar && (
            <div className="flex items-center gap-1.5 text-sm text-dark-400">
              <span>Sugar: {data.sugar}g</span>
            </div>
          )}
          {data.servings && (
            <div className="flex items-center gap-1.5 text-sm text-dark-400">
              <span>Servings: {data.servings}</span>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
