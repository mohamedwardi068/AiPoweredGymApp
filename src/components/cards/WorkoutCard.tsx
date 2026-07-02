import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Clock, Flame, ChevronDown, Target, Zap, Edit3, Wand2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { DifficultyBadge } from '../ui/Badge';
import { WorkoutCard as WorkoutCardType, WorkoutExercise } from '../../types';
import { ExerciseEditModal } from '../ui/ExerciseEditModal';

interface WorkoutCardProps {
  data: WorkoutCardType;
  onUpdate?: (newData: WorkoutCardType) => void;
  onEditWithAI?: () => void;
}

export function WorkoutCard({ data, onUpdate, onEditWithAI }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<{
    dayIndex?: number;
    exerciseIndex: number;
    exercise: WorkoutExercise;
  } | null>(null);

  const handleEditExercise = (dayIndex: number | undefined, exerciseIndex: number, exercise: WorkoutExercise) => {
    setEditingExercise({ dayIndex, exerciseIndex, exercise });
    setEditModalOpen(true);
  };

  const handleSaveExercise = (updatedExercise: WorkoutExercise) => {
    if (!onUpdate || !editingExercise) return;

    const newData = { ...data };
    
    if (editingExercise.dayIndex !== undefined && newData.days) {
      newData.days[editingExercise.dayIndex].exercises[editingExercise.exerciseIndex] = updatedExercise;
    } else if (newData.exercises) {
      newData.exercises[editingExercise.exerciseIndex] = updatedExercise;
    }

    onUpdate(newData);
    setEditModalOpen(false);
    setEditingExercise(null);
  };

  return (
    <GlassCard variant="elevated" padding="none" className="overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{data.title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={data.difficulty} />
              <span className="flex items-center gap-1.5 text-sm text-dark-400">
                <Clock className="w-4 h-4 text-accent-blue" />
                {data.duration} min
              </span>
              {data.calories && (
                <span className="flex items-center gap-1.5 text-sm text-dark-400">
                  <Flame className="w-4 h-4 text-orange-500" />
                  {data.calories} cal
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {data.equipment.map((eq) => (
            <motion.span
              key={eq}
              className="px-2 py-1 text-xs bg-dark-700/50 text-dark-300 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {eq}
            </motion.span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-accent-green hover:text-accent-green-light transition-colors"
            whileHover={{ x: 4 }}
          >
            <span>{expanded ? 'Hide' : 'View'} exercises</span>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.button>

          {onEditWithAI && (
            <button
              onClick={onEditWithAI}
              className="flex items-center gap-1.5 text-xs text-accent-blue bg-accent-blue/10 hover:bg-accent-blue/20 px-3 py-1.5 rounded-lg font-medium transition-colors border border-accent-blue/20"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Edit with AI
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-dark-700"
          >
            <div className="p-4 sm:p-5 space-y-6">
              {data.days && data.days.length > 0 ? (
                data.days.map((day, dayIndex) => (
                  <div key={day.dayName} className="space-y-3">
                    <h4 className="text-accent-green font-semibold border-b border-dark-700 pb-2 mb-3">{day.dayName}</h4>
                    {day.exercises.map((exercise, index) => (
                      <motion.button
                        key={`${day.dayName}-${exercise.name}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (dayIndex * 0.1) + (index * 0.05) }}
                        onClick={() => handleEditExercise(dayIndex, index, exercise)}
                        className="w-full text-left flex items-center gap-4 p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors group"
                      >
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate flex items-center justify-between">
                            {exercise.name}
                            {onUpdate && <Edit3 className="w-3.5 h-3.5 text-dark-500 group-hover:text-accent-green transition-colors opacity-0 group-hover:opacity-100" />}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-dark-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-yellow-500/70" />
                              {exercise.sets}x{exercise.reps}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-accent-green/70" />
                              {exercise.rest}
                            </span>
                          </div>
                        </div>
                        {exercise.notes && (
                          <div className="text-xs text-dark-500 hidden sm:block max-w-[150px] truncate">
                            {exercise.notes}
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                ))
              ) : (
                <div className="space-y-3">
                  {data.exercises?.map((exercise, index) => (
                    <motion.button
                      key={exercise.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleEditExercise(undefined, index, exercise)}
                      className="w-full text-left flex items-center gap-4 p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors group"
                    >
                      <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate flex items-center justify-between">
                          {exercise.name}
                          {onUpdate && <Edit3 className="w-3.5 h-3.5 text-dark-500 group-hover:text-accent-green transition-colors opacity-0 group-hover:opacity-100" />}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-dark-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500/70" />
                            {exercise.sets}x{exercise.reps}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-accent-green/70" />
                            {exercise.rest}
                          </span>
                        </div>
                      </div>
                      {exercise.notes && (
                        <div className="text-xs text-dark-500 hidden sm:block max-w-[150px] truncate">
                          {exercise.notes}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {data.targetMuscles && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="flex items-center gap-2 text-sm text-dark-400">
                  <Target className="w-4 h-4 text-accent-green" />
                  <span>Target muscles:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.targetMuscles.map((muscle) => (
                      <span key={muscle} className="text-accent-green-light font-medium">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ExerciseEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveExercise}
        initialExercise={editingExercise?.exercise || null}
      />
    </GlassCard>
  );
}
