import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Clock,
  Target,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check,
  Trash2,
  Calendar as CalendarIcon,
  List,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { DifficultyBadge } from '../ui/Badge';
import { MOCK_WORKOUT_PLANS } from '../../constants';
import { useApp } from '../../context/AppContext';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function WorkoutPlansPage() {
  const {
    validatedWorkouts,
    deleteValidatedWorkout,
    workoutSchedule,
    scheduleWorkout,
    unscheduleWorkout,
    setCurrentPage,
    insertRestDay,
  } = useApp();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal states
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Local exercise checkbox state (stores completed sets)
  // Format: { [exerciseName_setIndex]: boolean }
  const [completedSets, setCompletedSets] = useState<{ [key: string]: boolean }>({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayStr = new Date().toISOString().split('T')[0];

  // Map validated workouts to full plan models
  const customPlans = validatedWorkouts.map((workout: any) => ({
    id: workout._id,
    name: workout.title,
    description: `Target Muscles: ${workout.targetMuscles?.join(', ') || ''} | Equipment: ${workout.equipment?.join(', ') || ''}`,
    difficulty: workout.difficulty,
    duration: 4,
    workoutsPerWeek: 1,
    workouts: [
      {
        id: workout._id,
        day: 1,
        name: workout.title,
        exercises: workout.exercises,
        duration: workout.duration,
      },
    ],
    isCustom: true,
  }));

  const allPlans = [...customPlans, ...MOCK_WORKOUT_PLANS];

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Align Sunday (0) to index 6, otherwise index - 1
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarCells: any[] = [];

  // 1. Previous month padding days
  for (let i = startDayOffset - 1; i >= 0; i--) {
    const dayNum = totalDaysInPrevMonth - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const dateString = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;
    calendarCells.push({ dayNum, isCurrentMonth: false, date: prevDate, dateString });
  }

  // 2. Current month days
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const currDate = new Date(year, month, i);
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ dayNum: i, isCurrentMonth: true, date: currDate, dateString });
  }

  // 3. Next month padding days to complete 42 cells (6 rows)
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(year, month + 1, i);
    const dateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
    calendarCells.push({ dayNum: i, isCurrentMonth: false, date: nextDate, dateString });
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const getScheduleForDate = (dateString: string) => {
    return workoutSchedule.find((s) => s.date === dateString);
  };

  const handleCellClick = (cell: typeof calendarCells[0]) => {
    const scheduled = getScheduleForDate(cell.dateString);
    setSelectedDateStr(cell.dateString);
    
    if (scheduled) {
      setSelectedWorkout(scheduled.workoutPlanId);
      setSelectedScheduleId(scheduled._id);
      setSelectedDayIndex(scheduled.dayIndex || 0);
      setCompletedSets({}); // reset checklist on open
      setShowDetailsModal(true);
    } else {
      setShowAssignModal(true);
    }
  };

  const handleAssignWorkout = async (planId: string) => {
    if (!selectedDateStr) return;
    await scheduleWorkout(selectedDateStr, planId);
    setShowAssignModal(false);
  };

  const handleUnschedule = async () => {
    if (!selectedScheduleId) return;
    await unscheduleWorkout(selectedScheduleId);
    setShowDetailsModal(false);
  };

  const toggleSetCompleted = (exerciseName: string, setIndex: number) => {
    const key = `${exerciseName}_${setIndex}`;
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-dark-950 p-4 sm:p-6 lg:p-8 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Workout Schedule</h1>
            <p className="text-dark-400">Schedule your validated routines on a workout calendar</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('calendar')}
              icon={<CalendarIcon className="w-4 h-4" />}
            >
              Calendar View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('list')}
              icon={<List className="w-4 h-4" />}
            >
              List View
            </Button>
          </div>
        </motion.div>

        {/* View Layouts */}
        <AnimatePresence mode="wait">
          {viewMode === 'calendar' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              {/* Draggable Tools */}
              <div className="flex items-center gap-3 p-4 bg-dark-900 border border-dark-800 rounded-2xl mb-4">
                <span className="text-sm font-semibold text-dark-300">Drag to Calendar:</span>
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('type', 'rest_day');
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm font-medium cursor-grab active:cursor-grabbing hover:bg-dark-700 transition-colors shadow-lg flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  Rest Day
                </div>
                <span className="text-xs text-dark-500 ml-auto">Dropping a rest day will push subsequent workouts forward</span>
              </div>

              {/* Calendar Controls */}
              <div className="flex items-center justify-between p-3 bg-dark-900 border border-dark-800 rounded-2xl">
                <h3 className="text-lg font-bold text-white">
                  {MONTHS_NAMES[month]} {year}
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-white rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3.5 py-1 text-xs bg-dark-800 hover:bg-dark-700 border border-dark-700 text-dark-300 hover:text-white rounded-xl transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-white rounded-xl transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Table Grid */}
              <GlassCard padding="none" className="overflow-hidden border-white/5 shadow-glass">
                {/* Weekdays Header */}
                <div className="grid grid-cols-7 border-b border-dark-800 text-center">
                  {WEEKDAYS.map((day) => (
                    <div key={day} className="py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 auto-rows-fr bg-dark-900/40">
                  {calendarCells.map((cell, idx) => {
                    const scheduled = getScheduleForDate(cell.dateString);
                    const isToday = cell.dateString === todayStr;

                    return (
                      <div
                        key={idx}
                        onClick={() => handleCellClick(cell)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={async (e) => {
                          e.preventDefault();
                          const type = e.dataTransfer.getData('type');
                          if (type === 'rest_day') {
                            await insertRestDay(cell.dateString);
                          }
                        }}
                        className={`min-h-[85px] sm:min-h-[110px] p-2 border-r border-b border-dark-800/80 flex flex-col justify-between group transition-all duration-200 cursor-pointer hover:bg-white/2 ${
                          cell.isCurrentMonth ? '' : 'opacity-35 bg-dark-950/20'
                        } ${isToday ? 'bg-accent-green/5 border border-accent-green/30' : ''}`}
                      >
                        {/* Day number */}
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-xs font-bold ${
                              isToday
                                ? 'bg-accent-green text-white px-2 py-0.5 rounded-full'
                                : cell.isCurrentMonth
                                ? 'text-dark-200'
                                : 'text-dark-600'
                            }`}
                          >
                            {cell.dayNum}
                          </span>
                        </div>

                        {/* Scheduled Workout Tag */}
                        {scheduled ? (
                          <motion.div
                            className="bg-gradient-to-r from-accent-green/10 to-accent-blue/15 hover:from-accent-green/20 hover:to-accent-blue/25 border border-accent-green/20 text-accent-green rounded-xl p-1.5 text-left transition-colors flex flex-col justify-center gap-1.5"
                            whileHover={{ scale: 1.02 }}
                          >
                            <span className="text-[10px] sm:text-xs font-semibold truncate leading-tight block text-white" title={scheduled.workoutPlanId?.title}>
                              {scheduled.workoutPlanId?.days && scheduled.workoutPlanId.days.length > 0 && scheduled.workoutPlanId.days[scheduled.dayIndex || 0]
                                ? scheduled.workoutPlanId.days[scheduled.dayIndex || 0].dayName
                                : scheduled.workoutPlanId?.title || 'Workout'}
                            </span>
                            <span className="text-[9px] text-dark-400 hidden sm:flex items-center gap-1">
                              <Clock className="w-3 h-3 text-accent-blue" />
                              {scheduled.workoutPlanId?.duration || 0} min
                            </span>
                          </motion.div>
                        ) : (
                          <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center py-2 transition-opacity">
                            <Plus className="w-4 h-4 text-dark-500 hover:text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            /* List View */
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:gap-6">
                {allPlans.map((plan) => (
                  <GlassCard
                    key={plan.id}
                    variant="elevated"
                    padding="none"
                    className="overflow-hidden hover:border-accent-green/30 transition-colors"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{plan.name}</h3>
                          <p className="text-dark-400 text-sm">{plan.description}</p>
                        </div>
                        <DifficultyBadge difficulty={plan.difficulty} />
                      </div>

                      <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-dark-400">
                          <Clock className="w-4 h-4 text-accent-green" />
                          <span>{plan.duration} weeks</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-dark-400">
                          <Target className="w-4 h-4 text-accent-blue" />
                          <span>{plan.workoutsPerWeek} days/week</span>
                        </div>
                      </div>

                      <div className="bg-dark-800/50 rounded-xl p-3 sm:p-4">
                        <h4 className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3">
                          Weekly Schedule
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                          {plan.workouts.map((workout) => (
                            <div
                              key={workout.id}
                              className="p-2 sm:p-3 bg-dark-800 rounded-lg text-center hover:bg-dark-700 transition-colors cursor-pointer"
                            >
                              <div className="text-xs text-dark-500 mb-1">Day {workout.day}</div>
                              <div className="text-xs text-white font-medium truncate">
                                {workout.name.split(' - ')[0]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-green/20 to-accent-blue/20" />
                          <span className="text-xs text-dark-400">
                            {(plan as any).isCustom ? 'AI Plan Active' : 'Default Plan'}
                          </span>
                        </div>
                        {(plan as any).isCustom && (
                          <motion.button
                            onClick={() => deleteValidatedWorkout(plan.id)}
                            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove Plan
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Modals */}
        <AnimatePresence>
          {/* 1. Assign Workout Modal */}
          {showAssignModal && selectedDateStr && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-dark-900 border border-dark-800 rounded-2xl p-6 overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-dark-800">
                  <h3 className="text-lg font-bold text-white">Schedule Workout</h3>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="p-1.5 text-dark-400 hover:text-white rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {validatedWorkouts.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-dark-400 text-sm mb-4">
                        You don't have any validated routines yet. Ask the AI coach to design a workout, then click "Validate" to save it.
                      </p>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setShowAssignModal(false);
                          setCurrentPage('chat');
                        }}
                      >
                        Start Chat
                      </Button>
                    </div>
                  ) : (
                    validatedWorkouts.map((workout) => (
                      <div
                        key={workout._id}
                        onClick={() => handleAssignWorkout(workout._id)}
                        className="p-3 bg-dark-800 hover:bg-dark-700 border border-dark-700/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white truncate group-hover:text-accent-green transition-colors">{workout.title}</h4>
                          <span className="text-xs text-dark-400">
                            {workout.duration} min | {workout.exercises.length} exercises
                          </span>
                        </div>
                        <Plus className="w-5 h-5 text-accent-green group-hover:scale-110 transition-transform" />
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* 2. Workout Details Modal */}
          {showDetailsModal && selectedWorkout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-xl bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
              >
                {/* Header */}
                <div className="p-6 pb-4 border-b border-dark-800 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {selectedWorkout.days && selectedWorkout.days.length > 0 && selectedWorkout.days[selectedDayIndex]
                        ? `${selectedWorkout.title} - ${selectedWorkout.days[selectedDayIndex].dayName}`
                        : selectedWorkout.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <DifficultyBadge difficulty={selectedWorkout.difficulty} />
                      <span className="flex items-center gap-1 text-xs text-dark-400">
                        <Clock className="w-3.5 h-3.5 text-accent-blue" />
                        {selectedWorkout.duration} min
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-1.5 text-dark-400 hover:text-white rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Exercises list with interactive sets checklist */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <h4 className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
                    Exercises Checklist
                  </h4>

                  {(selectedWorkout.days && selectedWorkout.days.length > 0 && selectedWorkout.days[selectedDayIndex]
                    ? selectedWorkout.days[selectedDayIndex].exercises
                    : selectedWorkout.exercises
                  ).map((exercise: any) => (
                    <div key={exercise.name} className="bg-dark-800/50 border border-dark-800/80 rounded-xl p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-semibold text-white text-sm">{exercise.name}</h5>
                          <span className="text-xs text-accent-green">Rest: {exercise.rest}</span>
                        </div>
                      </div>

                      {/* Render Set Checklist */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[...Array(exercise.sets)].map((_, setIdx) => {
                          const key = `${exercise.name}_${setIdx}`;
                          const isDone = !!completedSets[key];

                          return (
                            <div
                              key={setIdx}
                              onClick={() => toggleSetCompleted(exercise.name, setIdx)}
                              className={`p-2 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
                                isDone
                                  ? 'bg-accent-green/10 border-accent-green/40 text-accent-green'
                                  : 'bg-dark-900 border-dark-700/60 text-dark-400 hover:text-white hover:border-dark-600'
                              }`}
                            >
                              <span className="text-xs font-medium">Set {setIdx + 1} ({exercise.reps})</span>
                              {isDone ? (
                                <Check className="w-4 h-4 text-accent-green" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-dark-600" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {exercise.notes && (
                        <p className="text-xs text-dark-500 italic bg-dark-900/40 p-2 rounded-lg">
                          Note: {exercise.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer action buttons */}
                <div className="p-6 border-t border-dark-800 bg-dark-900/60 flex items-center justify-between">
                  <button
                    onClick={handleUnschedule}
                    className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Unschedule Day
                  </button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
