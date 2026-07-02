import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Calculator, Scale, Dumbbell, Activity } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const CALCULATORS = [
  { id: 'bmi', name: 'BMI Calculator', icon: Scale, description: 'Calculate your Body Mass Index' },
  { id: 'macro', name: 'Macro Calculator', icon: Calculator, description: 'Find your daily macro targets' },
  { id: 'one-rep-max', name: '1-Rep Max', icon: Dumbbell, description: 'Estimate your max lifts' },
  { id: 'calories', name: 'Calorie Burn', icon: Activity, description: 'Calculate calories burned' },
];

export function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<string>('bmi');
  const [bmiValues, setBmiValues] = useState({ weight: '', height: '', unit: 'metric' });
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [macroValues, setMacroValues] = useState({ weight: '', activity: 'moderate', goal: 'maintain' });
  const [macroResult, setMacroResult] = useState<{ calories: number; protein: number; carbs: number; fat: number } | null>(null);

  const calculateBMI = () => {
    const weight = parseFloat(bmiValues.weight);
    const height = parseFloat(bmiValues.height);

    if (!weight || !height) return;

    let bmi: number;
    if (bmiValues.unit === 'metric') {
      bmi = weight / ((height / 100) ** 2);
    } else {
      bmi = (weight / (height ** 2)) * 703;
    }

    setBmiResult(Math.round(bmi * 10) / 10);
  };

  const calculateMacros = () => {
    const weight = parseFloat(macroValues.weight);
    if (!weight) return;

    let tdee = weight * 24;
    const activityMultipliers = { sedentary: 1.2, moderate: 1.55, active: 1.9 };
    tdee *= activityMultipliers[macroValues.activity as keyof typeof activityMultipliers] || 1.55;

    const goalAdjustments = { lose: 0.8, maintain: 1, gain: 1.15 };
    tdee *= goalAdjustments[macroValues.goal as keyof typeof goalAdjustments] || 1;

    setMacroResult({
      calories: Math.round(tdee),
      protein: Math.round(weight * 2),
      carbs: Math.round((tdee * 0.4) / 4),
      fat: Math.round((tdee * 0.25) / 9),
    });
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'blue' };
    if (bmi < 25) return { label: 'Normal', color: 'green' };
    if (bmi < 30) return { label: 'Overweight', color: 'yellow' };
    return { label: 'Obese', color: 'red' };
  };

  return (
    <div className="min-h-screen bg-dark-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Fitness Calculators</h1>
          <p className="text-dark-400">Tools to help you plan your fitness journey</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-2">
            {CALCULATORS.map((calc, index) => (
              <motion.button
                key={calc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveCalculator(calc.id)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  activeCalculator === calc.id
                    ? 'bg-dark-800 border border-accent-green/30'
                    : 'hover:bg-dark-800/50 text-dark-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    activeCalculator === calc.id
                      ? 'bg-gradient-to-br from-accent-green to-accent-blue'
                      : 'bg-dark-700'
                  }`}>
                    <calc.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{calc.name}</div>
                    <div className="text-xs text-dark-500">{calc.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeCalculator === 'bmi' && (
                <motion.div
                  key="bmi"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GlassCard variant="elevated">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center">
                        <Scale className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">BMI Calculator</h2>
                        <p className="text-sm text-dark-400">Body Mass Index is a simple measure of body fat based on height and weight</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-3 p-1 bg-dark-800 rounded-xl w-fit">
                        {['metric', 'imperial'].map((unit) => (
                          <button
                            key={unit}
                            onClick={() => setBmiValues({ ...bmiValues, unit })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              bmiValues.unit === unit
                                ? 'bg-dark-700 text-white'
                                : 'text-dark-400 hover:text-white'
                            }`}
                          >
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-dark-300 mb-2">
                            Weight ({bmiValues.unit === 'metric' ? 'kg' : 'lbs'})
                          </label>
                          <input
                            type="number"
                            value={bmiValues.weight}
                            onChange={(e) => setBmiValues({ ...bmiValues, weight: e.target.value })}
                            className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent-green/50"
                            placeholder={bmiValues.unit === 'metric' ? '70' : '154'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-dark-300 mb-2">
                            Height ({bmiValues.unit === 'metric' ? 'cm' : 'inches'})
                          </label>
                          <input
                            type="number"
                            value={bmiValues.height}
                            onChange={(e) => setBmiValues({ ...bmiValues, height: e.target.value })}
                            className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent-green/50"
                            placeholder={bmiValues.unit === 'metric' ? '175' : '69'}
                          />
                        </div>
                      </div>

                      <Button variant="primary" onClick={calculateBMI} className="w-full">
                        Calculate BMI
                      </Button>

                      {bmiResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-6 p-6 bg-dark-800/50 rounded-xl text-center"
                        >
                          <div className="text-5xl font-bold text-white mb-2">{bmiResult}</div>
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <Badge variant={getBMICategory(bmiResult).color as 'green' | 'blue' | 'yellow' | 'red'}>
                              {getBMICategory(bmiResult).label}
                            </Badge>
                          </div>
                          <p className="text-sm text-dark-400">
                            BMI Range: 18.5 - 24.9 is considered normal weight
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {activeCalculator === 'macro' && (
                <motion.div
                  key="macro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GlassCard variant="elevated">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center">
                        <Calculator className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">Macro Calculator</h2>
                        <p className="text-sm text-dark-400">Calculate your daily calorie and macro targets</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                          Body Weight (kg)
                        </label>
                        <input
                          type="number"
                          value={macroValues.weight}
                          onChange={(e) => setMacroValues({ ...macroValues, weight: e.target.value })}
                          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent-green/50"
                          placeholder="70"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Activity Level</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ id: 'sedentary', label: 'Sedentary' }, { id: 'moderate', label: 'Moderate' }, { id: 'active', label: 'Active' }].map((level) => (
                            <button
                              key={level.id}
                              onClick={() => setMacroValues({ ...macroValues, activity: level.id })}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                macroValues.activity === level.id
                                  ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                                  : 'bg-dark-800 text-dark-400 hover:text-white border border-transparent'
                              }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Goal</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ id: 'lose', label: 'Lose Weight' }, { id: 'maintain', label: 'Maintain' }, { id: 'gain', label: 'Build Muscle' }].map((g) => (
                            <button
                              key={g.id}
                              onClick={() => setMacroValues({ ...macroValues, goal: g.id })}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                macroValues.goal === g.id
                                  ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                                  : 'bg-dark-800 text-dark-400 hover:text-white border border-transparent'
                              }`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button variant="primary" onClick={calculateMacros} className="w-full">
                        Calculate Macros
                      </Button>

                      {macroResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-6 p-6 bg-dark-800/50 rounded-xl"
                        >
                          <div className="text-center mb-6">
                            <div className="text-4xl font-bold text-white">{macroResult.calories}</div>
                            <div className="text-sm text-dark-400">Daily Calories</div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-dark-800 rounded-xl">
                              <div className="text-2xl font-bold text-accent-green">{macroResult.protein}g</div>
                              <div className="text-xs text-dark-400">Protein</div>
                            </div>
                            <div className="text-center p-4 bg-dark-800 rounded-xl">
                              <div className="text-2xl font-bold text-yellow-400">{macroResult.carbs}g</div>
                              <div className="text-xs text-dark-400">Carbs</div>
                            </div>
                            <div className="text-center p-4 bg-dark-800 rounded-xl">
                              <div className="text-2xl font-bold text-red-400">{macroResult.fat}g</div>
                              <div className="text-xs text-dark-400">Fat</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {activeCalculator === 'one-rep-max' && (
                <motion.div
                  key="one-rep-max"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GlassCard variant="elevated" className="text-center py-12">
                    <Dumbbell className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">1-Rep Max Calculator</h3>
                    <p className="text-dark-400 text-sm">Coming soon</p>
                  </GlassCard>
                </motion.div>
              )}

              {activeCalculator === 'calories' && (
                <motion.div
                  key="calories"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GlassCard variant="elevated" className="text-center py-12">
                    <Activity className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Calorie Burn Calculator</h3>
                    <p className="text-dark-400 text-sm">Coming soon</p>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
