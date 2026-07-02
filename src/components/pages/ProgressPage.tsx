import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Flame, Check, Trophy, ChevronRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MOCK_ACHIEVEMENTS, MOCK_USER } from '../../constants';

const STATS = [
  { label: 'Total Workouts', value: 48, change: '+5 this week', icon: Flame },
  { label: 'Current Streak', value: 12, change: 'days', icon: Calendar },
  { label: 'Weight Lifted', value: '125k', change: 'lbs', icon: TrendingUp },
  { label: 'Goals Met', value: '23', change: 'of 30', icon: Target },
];

const PROGRESS_DATA = [
  { label: 'Bench Press', current: 185, target: 225, unit: 'lbs' },
  { label: 'Squat', current: 245, target: 315, unit: 'lbs' },
  { label: 'Deadlift', current: 315, target: 405, unit: 'lbs' },
  { label: 'Body Weight', current: 175, target: 180, unit: 'lbs' },
];

const WEEK_ACTIVITY = [
  { day: 'Mon', active: true },
  { day: 'Tue', active: true },
  { day: 'Wed', active: false },
  { day: 'Thu', active: true },
  { day: 'Fri', active: true },
  { day: 'Sat', active: true },
  { day: 'Sun', active: false },
];

export function ProgressPage() {
  return (
    <div className="min-h-screen bg-dark-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Progress</h1>
              <p className="text-dark-400">Track your fitness journey</p>
            </div>
            <Button variant="secondary">View All Stats</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard variant="elevated" className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-dark-400">{stat.label}</div>
                  <div className="text-xs text-accent-green mt-1">{stat.change}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard>
                <h2 className="text-lg font-semibold text-white mb-4">Weekly Activity</h2>
                <div className="flex items-center justify-between mb-6">
                  {WEEK_ACTIVITY.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                          day.active
                            ? 'bg-gradient-to-br from-accent-green to-accent-green-dark'
                            : 'bg-dark-700'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {day.active ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-dark-600" />
                        )}
                      </motion.div>
                      <span className={`text-xs ${day.active ? 'text-white' : 'text-dark-500'}`}>
                        {day.day}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="h-32 bg-dark-800/50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-dark-600 mx-auto mb-2" />
                    <p className="text-sm text-dark-500">Activity chart coming soon</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard>
                <h2 className="text-lg font-semibold text-white mb-4">Strength Progress</h2>
                <div className="space-y-4">
                  {PROGRESS_DATA.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-dark-300">{item.label}</span>
                        <span className="text-sm">
                          <span className="text-white font-medium">{item.current}</span>
                          <span className="text-dark-500">/{item.target} {item.unit}</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-accent-green to-accent-blue rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.current / item.target) * 100}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Achievements</h2>
                  <span className="text-xs text-dark-400">{MOCK_ACHIEVEMENTS.filter(a => a.unlockedAt).length} unlocked</span>
                </div>
                <div className="space-y-3">
                  {MOCK_ACHIEVEMENTS.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`p-3 rounded-xl ${
                        achievement.unlockedAt
                          ? 'bg-gradient-to-br from-accent-green/10 to-accent-blue/10 border border-accent-green/20'
                          : 'bg-dark-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          achievement.unlockedAt
                            ? 'bg-gradient-to-br from-accent-green to-accent-blue'
                            : 'bg-dark-700'
                        }`}>
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate">{achievement.name}</div>
                          <div className="text-xs text-dark-400 truncate">{achievement.description}</div>
                        </div>
                      </div>
                      {!achievement.unlockedAt && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-dark-400 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.total}</span>
                          </div>
                          <div className="w-full h-1 bg-dark-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-dark-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-accent-green hover:text-accent-green-light transition-colors"
                  whileHover={{ x: 4 }}
                >
                  View All Achievements
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlassCard>
                <h2 className="text-lg font-semibold text-white mb-4">Fitness Goals</h2>
                <div className="space-y-3">
                  {MOCK_USER.goals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="p-3 bg-dark-800/50 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white capitalize">
                          {goal.type.replace('_', ' ')}
                        </span>
                        <Badge variant="gray">In Progress</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-accent-green to-accent-green-light rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((goal.current || 0) / (goal.target || 100)) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-sm text-dark-300">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button variant="secondary" className="w-full mt-4" icon={<Target className="w-4 h-4" />}>
                  Add New Goal
                </Button>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
