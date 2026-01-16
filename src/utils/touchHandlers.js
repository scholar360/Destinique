
import { useState, useRef, useEffect } from 'react';

// Constants for swipe detection
const SWIPE_THRESHOLD = 50; // Minimum distance to be considered a swipe
const SWIPE_TIMEOUT = 500; // Maximum time for a swipe gesture

/**
 * Calculates the direction and distance of a swipe based on start and end touch events.
 * @param {Touch} startTouch - The starting touch object
 * @param {Touch} endTouch - The ending touch object
 * @returns {Object|null} - { direction: 'UP'|'DOWN'|'LEFT'|'RIGHT', distanceX, distanceY } or null if invalid
 */
export const detectSwipe = (startTouch, endTouch) => {
  if (!startTouch || !endTouch) return null;

  const distanceX = endTouch.clientX - startTouch.clientX;
  const distanceY = endTouch.clientY - startTouch.clientY;
  const absX = Math.abs(distanceX);
  const absY = Math.abs(distanceY);

  if (Math.max(absX, absY) < SWIPE_THRESHOLD) return null;

  // Determine dominant direction
  if (absX > absY) {
    return {
      direction: distanceX > 0 ? 'RIGHT' : 'LEFT',
      distanceX,
      distanceY
    };
  } else {
    return {
      direction: distanceY > 0 ? 'DOWN' : 'UP',
      distanceX,
      distanceY
    };
  }
};

/**
 * Hook to handle swipe gestures on a component.
 * @param {Object} handlers - Callbacks for swipe directions: { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }
 * @returns {Object} - Props to spread onto the target element: { onTouchStart, onTouchMove, onTouchEnd }
 */
export const useSwipeGesture = (handlers = {}) => {
  const touchStartRef = useRef(null);
  const touchStartTimeRef = useRef(0);
  
  // State to track current drag for animations if needed (optional usage)
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  const onTouchStart = (e) => {
    touchStartRef.current = e.touches[0];
    touchStartTimeRef.current = Date.now();
    setIsSwiping(true);
    setDelta({ x: 0, y: 0 });
  };

  const onTouchMove = (e) => {
    if (!touchStartRef.current) return;
    const currentTouch = e.touches[0];
    const dx = currentTouch.clientX - touchStartRef.current.clientX;
    const dy = currentTouch.clientY - touchStartRef.current.clientY;
    setDelta({ x: dx, y: dy });
  };

  const onTouchEnd = (e) => {
    if (!touchStartRef.current) return;

    const touchEndTime = Date.now();
    const duration = touchEndTime - touchStartTimeRef.current;
    
    // Only process as swipe if it was quick enough
    if (duration <= SWIPE_TIMEOUT) {
        const endTouch = e.changedTouches[0];
        const result = detectSwipe(touchStartRef.current, endTouch);

        if (result) {
            const { direction } = result;
            if (direction === 'LEFT' && handlers.onSwipeLeft) handlers.onSwipeLeft();
            if (direction === 'RIGHT' && handlers.onSwipeRight) handlers.onSwipeRight();
            if (direction === 'UP' && handlers.onSwipeUp) handlers.onSwipeUp();
            if (direction === 'DOWN' && handlers.onSwipeDown) handlers.onSwipeDown();
        }
    }

    // Reset
    touchStartRef.current = null;
    setIsSwiping(false);
    setDelta({ x: 0, y: 0 });
  };

  return {
    handlers: {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    },
    delta,
    isSwiping
  };
};
