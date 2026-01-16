
import React from 'react';
import { cn } from '@/lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-slate-900 text-slate-50 border border-slate-700',
    secondary: 'bg-slate-800 text-slate-50 border border-slate-600',
    destructive: 'bg-red-900 text-red-50 border border-red-700',
    outline: 'text-slate-950 border border-slate-200 bg-white',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge };
