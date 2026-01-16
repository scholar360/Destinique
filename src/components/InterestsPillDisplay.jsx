
import React from 'react';
import { cn } from '@/lib/utils';

const InterestsPillDisplay = ({ interests, limit = 0, className }) => {
  if (!interests || !Array.isArray(interests) || interests.length === 0) {
    return null;
  }

  // Use the interests array directly. 
  // If it's objects (from profile_interests), map to strings, otherwise assume strings.
  const displayInterests = interests.map(i => typeof i === 'object' ? i.interest_key : i);
  
  const showAll = limit === 0 || displayInterests.length <= limit;
  const visibleInterests = showAll ? displayInterests : displayInterests.slice(0, limit);
  const remainingCount = displayInterests.length - limit;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visibleInterests.map((interest, idx) => (
        <span 
          key={`${interest}-${idx}`}
          className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-gray-200 border border-white/10 whitespace-nowrap"
        >
          {interest}
        </span>
      ))}
      {!showAll && remainingCount > 0 && (
        <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-gray-400 border border-white/5">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

export default InterestsPillDisplay;
