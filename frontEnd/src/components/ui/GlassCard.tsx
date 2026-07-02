import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function GlassCard({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}: GlassCardProps) {
  const baseStyles = 'bg-glass-gradient backdrop-blur-xl rounded-2xl';

  const variants = {
    default: 'border border-white/5 shadow-glass',
    elevated: 'border border-white/10 shadow-glass shadow-glow-green/5',
    bordered: 'border border-accent-green/20',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  };

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
