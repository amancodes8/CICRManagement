/**
 * Page Animator Component
 * 
 * Wraps pages with smooth enter/exit animations.
 * Provides consistent page transitions throughout the application.
 */

import { motion } from 'framer-motion';

/**
 * Page animation variants
 */
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * PageAnimator component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.className - Additional CSS classes
 */
export function PageAnimator({ children, className = '' }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered children animation for lists
 */
const containerVariants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Staggered container for animating lists
 */
export function StaggerContainer({ children, className = '' }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered item (use inside StaggerContainer)
 */
export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}