/**
 * Avatar Component
 * 
 * User avatar component with fallback to initials.
 * Supports images and automatic initial generation.
 */

import { forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { getInitials } from '../../lib/utils';

/**
 * Avatar Root component
 */
const Avatar = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));
Avatar.displayName = 'Avatar';

/**
 * Avatar Image component with fallback handling
 */
const AvatarImage = forwardRef(({ className, src, alt, ...props }, ref) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return null;
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn('aspect-square h-full w-full object-cover', className)}
      onError={() => setHasError(true)}
      {...props}
    />
  );
});
AvatarImage.displayName = 'AvatarImage';

/**
 * Avatar Fallback component (displays initials)
 */
const AvatarFallback = forwardRef(({ className, name, ...props }, ref) => {
  const initials = name ? getInitials(name) : '??';
  
  return (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium',
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
});
AvatarFallback.displayName = 'AvatarFallback';

/**
 * Combined Avatar component with image and fallback
 */
function UserAvatar({ src, name, className }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback name={name} />
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar };