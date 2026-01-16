
import React from 'react';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(({ className, min = 0, max = 100, step = 1, value = [0], onValueChange, ...props }, ref) => {
  const val = value && value.length > 0 ? value[0] : min;
  
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  const percentage = ((val - min) / (max - min)) * 100;

  return (
    <div 
      ref={ref} 
      className={cn("relative flex w-full touch-none select-none items-center h-6", className)} 
      {...props}
    >
      {/* Track */}
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 bg-secondary/50">
        {/* Range */}
        <div 
          className="absolute h-full bg-purple-600 dark:bg-purple-400" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
      
      {/* Input (Invisible but interactive) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      {/* Thumb (Visual only) */}
      <div 
        className="pointer-events-none absolute h-5 w-5 rounded-full border-2 border-purple-600 dark:border-purple-400 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 z-20 shadow-sm"
        style={{ left: `calc(${percentage}% - 10px)` }}
      />
    </div>
  );
});

Slider.displayName = "Slider";

export { Slider };
