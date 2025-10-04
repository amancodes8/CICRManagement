/**
 * Skeleton Component
 * 
 * Loading placeholder component that mimics the shape of content.
 * Provides visual feedback during data fetching.
 */

import { cn } from '../../lib/utils';

/**
 * Skeleton component for loading states
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted relative overflow-hidden',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };