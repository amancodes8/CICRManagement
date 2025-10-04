/**
 * Badge Component
 * 
 * Small count and labeling component with various styles.
 * Used for status indicators, tags, and counts.
 */

import { cn } from '../../lib/utils';

const badgeVariants = {
  default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
  outline: 'text-foreground border-border',
  success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
  warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
};

/**
 * Badge component
 * @param {Object} props - Component props
 * @param {string} props.variant - Badge variant
 * @param {string} props.className - Additional CSS classes
 */
function Badge({ className, variant = 'default', ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };