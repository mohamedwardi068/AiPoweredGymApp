import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Calendar, X, Check, Clock, CalendarDays, Dumbbell } from 'lucide-react';
import { Button } from './Button';

interface PlanValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (startDate: string, durationWeeks: number, trainDays: number, restDays: number) => void;
  title?: string;
}

export function PlanValidationModal({ isOpen, onClose, onSelect, title = "Schedule Workout Plan" }: PlanValidationModalProps) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [trainDays, setTrainDays] = useState(3);
  const [restDays, setRestDays] = useState(1);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="p-4 border-b border-dark-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-green" />
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-dark-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent-green/50"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent-blue" />
                Plan Duration (Weeks)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(parseInt(e.target.value))}
                  className="flex-1 accent-accent-blue"
                />
                <span className="text-white font-bold w-12 text-center bg-dark-800 py-1 rounded-lg">
                  {durationWeeks}
                </span>
              </div>
            </div>

            {/* Training Frequency */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-yellow-500" />
                Training Frequency
              </label>
              <div className="bg-dark-800 p-3 rounded-xl border border-dark-700/60">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-dark-400 mb-1">Train Days</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        max="7"
                        value={trainDays}
                        onChange={(e) => setTrainDays(parseInt(e.target.value))}
                        className="w-full px-3 py-1.5 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-dark-400 mb-1">Rest Days</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={restDays}
                        onChange={(e) => setRestDays(parseInt(e.target.value))}
                        className="w-full px-3 py-1.5 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none text-center"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-dark-400 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-accent-green" />
                  Pattern: Train {trainDays} days, then rest {restDays} {restDays === 1 ? 'day' : 'days'}.
                </div>
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-dark-800 bg-dark-900/60 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => onSelect(date, durationWeeks, trainDays, restDays)}
              icon={<Check className="w-4 h-4" />}
            >
              Confirm Schedule
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
