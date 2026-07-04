import { motion } from 'framer-motion';
import { Dumbbell, Calculator, BookOpen, Target, Utensils, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LiquidEther from '../ui/LiquidEther';
import PixelCard from '../ui/PixelCard';

const SUGGESTED_PROMPTS = [
  { title: 'Create a Push Pull Legs routine', icon: Dumbbell, color: 'green' },
  { title: 'Calculate calories for chicken and rice', icon: Calculator, color: 'blue' },
  { title: 'Explain progressive overload', icon: BookOpen, color: 'green' },
  { title: 'Best chest exercises', icon: Target, color: 'blue' },
  { title: 'Build a fat loss meal plan', icon: Utensils, color: 'green' },
  { title: 'Recovery tips for sore muscles', icon: Heart, color: 'blue' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function WelcomeScreen() {
  const { sendMessage } = useApp();

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center h-full p-4 sm:p-8 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={[ '#5227FF', '#FF9FFC', '#B497CF' ]}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <motion.div
        className="relative z-10 mb-8"
        variants={itemVariants}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent-green/20 to-accent-blue/20 rounded-3xl blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <div className="relative bg-dark-800/80 backdrop-blur-xl rounded-3xl border border-dark-700 p-8 sm:p-12">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 relative"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-green to-accent-blue rounded-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
            Your Personal AI Fitness Coach
          </h1>
          <p className="text-dark-400 text-center max-w-md mb-0">
            Ask anything about <span className="text-accent-green">workouts</span>,{' '}
            <span className="text-accent-blue">nutrition</span>, muscle gain, weight loss, exercise form, supplements, or recovery.
          </p>
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <motion.div
            key={prompt.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <PixelCard
              variant="ether"
              onClick={() => sendMessage(prompt.title)}
              className="group w-full h-full bg-dark-800/50 hover:bg-dark-800/80 border-dark-700 hover:border-dark-600 p-4 text-left transition-all duration-300"
            >
              <div className="relative flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  prompt.color === 'green'
                    ? 'bg-accent-green/20 text-accent-green'
                    : 'bg-accent-blue/20 text-accent-blue'
                }`}>
                  <prompt.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <span className="text-sm font-medium text-white group-hover:text-accent-green transition-colors line-clamp-2">
                    {prompt.title}
                  </span>
                </div>
              </div>
            </PixelCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={itemVariants}
        className="relative z-10 mt-8 flex items-center gap-2 text-dark-500 text-sm"
      >
        <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
        <span>Powered by AI</span>
      </motion.div>
    </motion.div>
  );
}


