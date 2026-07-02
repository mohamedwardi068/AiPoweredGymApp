import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Search, X, Check, Dumbbell, Clock, Zap, Target } from 'lucide-react';
import { Button } from './Button';
import { WorkoutExercise } from '../../types';
import exercisesData from '../../data/exercises.json';

interface ExerciseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedExercise: WorkoutExercise) => void;
  initialExercise: WorkoutExercise | null;
}

export function ExerciseEditModal({ isOpen, onClose, onSave, initialExercise }: ExerciseEditModalProps) {
  const [name, setName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState('');
  const [rest, setRest] = useState('');
  const [notes, setNotes] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (initialExercise && isOpen) {
      setName(initialExercise.name);
      setSets(initialExercise.sets);
      setReps(initialExercise.reps);
      setRest(initialExercise.rest);
      setNotes(initialExercise.notes || '');
      setSearchQuery('');
      setShowResults(false);
    }
  }, [initialExercise, isOpen]);

  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return exercisesData.filter((ex) => 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 10); // Limit to 10 results
  }, [searchQuery]);

  const handleSelectExercise = (exerciseName: string) => {
    setName(exerciseName);
    setSearchQuery('');
    setShowResults(false);
  };

  if (!isOpen || !initialExercise) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="p-4 border-b border-dark-800 flex items-center justify-between flex-shrink-0">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-accent-green" />
              Edit Exercise
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-dark-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Exercise Name & Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Exercise Name
              </label>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white font-semibold">
                  {name}
                </div>
              </div>
              
              <div className="relative mt-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-dark-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search to replace exercise..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700 rounded-xl text-sm text-white focus:outline-none focus:border-accent-green/50 placeholder-dark-500 transition-colors"
                />
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchQuery.trim() !== '' && (
                <div className="absolute z-10 w-full mt-1 bg-dark-800 border border-dark-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => handleSelectExercise(ex.name)}
                        className="w-full text-left px-4 py-2 hover:bg-dark-700 transition-colors flex flex-col gap-1 border-b border-dark-700/50 last:border-0"
                      >
                        <span className="text-sm font-medium text-white">{ex.name}</span>
                        <span className="text-xs text-dark-400">
                          {ex.targetMuscles.join(', ')} • {ex.equipment.join(', ')}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-dark-400 text-center">
                      No exercises found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sets & Reps */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Sets
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={sets}
                  onChange={(e) => setSets(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent-green/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-accent-blue" />
                  Reps
                </label>
                <input
                  type="text"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="e.g. 8-12"
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent-green/50"
                />
              </div>
            </div>

            {/* Rest */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent-green" />
                Rest Time
              </label>
              <input
                type="text"
                value={rest}
                onChange={(e) => setRest(e.target.value)}
                placeholder="e.g. 60s"
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent-green/50"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Focus on mind-muscle connection"
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent-green/50"
              />
            </div>
          </div>

          <div className="p-4 border-t border-dark-800 bg-dark-900/60 flex items-center justify-end gap-3 flex-shrink-0">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onSave({
                  name,
                  sets,
                  reps,
                  rest,
                  notes: notes.trim() !== '' ? notes : undefined
                });
              }}
              icon={<Check className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
