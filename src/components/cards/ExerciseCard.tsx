import { motion } from 'framer-motion';
import { useState } from 'react';
import { Target, AlertTriangle, Lightbulb, ChevronDown } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { DifficultyBadge } from '../ui/Badge';
import { ExerciseCard as ExerciseCardType } from '../../types';

interface ExerciseCardProps {
  data: ExerciseCardType;
}

export function ExerciseCard({ data }: ExerciseCardProps) {
  const [showMistakes, setShowMistakes] = useState(true);
  const [showTips, setShowTips] = useState(true);

  return (
    <GlassCard variant="elevated" className="overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-green/10 to-accent-blue/10 rounded-t-2xl" />
        <div className="relative p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-dark-800 flex items-center justify-center flex-shrink-0 overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-accent-green/30 to-accent-blue/30 flex items-center justify-center">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-50" />
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-2">{data.name}</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <DifficultyBadge difficulty={data.difficulty} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.targetMuscles.map((muscle) => (
                  <motion.span
                    key={muscle}
                    className="px-2 py-0.5 text-xs bg-accent-green/10 text-accent-green rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {muscle}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 border-t border-dark-700 space-y-4">
        <div className="flex flex-wrap gap-2">
          {data.equipment.map((eq) => (
            <span
              key={eq}
              className="px-2 py-1 text-xs bg-dark-700/50 text-dark-300 rounded-lg"
            >
              {eq}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <motion.button
            onClick={() => setShowMistakes(!showMistakes)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors"
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Common Mistakes</span>
            </div>
            <motion.div animate={{ rotate: showMistakes ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4 text-red-400" />
            </motion.div>
          </motion.button>

          <motion.div
            initial={false}
            animate={{
              height: showMistakes ? 'auto' : 0,
              opacity: showMistakes ? 1 : 0,
            }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 px-3">
              {data.commonMistakes.map((mistake, index) => (
                <motion.li
                  key={mistake}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 text-sm text-dark-300"
                >
                  <span className="text-red-400 mt-0.5">•</span>
                  {mistake}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.button
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-accent-green/10 border border-accent-green/20 hover:bg-accent-green/15 transition-colors"
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent-green" />
              <span className="text-sm font-medium text-accent-green">Pro Tips</span>
            </div>
            <motion.div animate={{ rotate: showTips ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4 text-accent-green" />
            </motion.div>
          </motion.button>

          <motion.div
            initial={false}
            animate={{
              height: showTips ? 'auto' : 0,
              opacity: showTips ? 1 : 0,
            }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 px-3">
              {data.tips.map((tip, index) => (
                <motion.li
                  key={tip}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 text-sm text-dark-300"
                >
                  <span className="text-accent-green mt-0.5">•</span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
}
