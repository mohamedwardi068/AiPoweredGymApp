import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'green', size = 'md' }: BadgeProps) {
  const variants = {
    green: 'bg-accent-green/20 text-accent-green border-accent-green/30',
    blue: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    gray: 'bg-dark-600 text-dark-300 border-dark-500',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
  };

  return (
    <motion.span
      className={`inline-flex items-center font-medium rounded-lg border ${variants[variant]} ${sizes[size]}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: 'beginner' | 'intermediate' | 'advanced' }) {
  const colors = {
    beginner: 'green',
    intermediate: 'yellow',
    advanced: 'red',
  } as const;

  return <Badge variant={colors[difficulty]}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Badge>;
}
