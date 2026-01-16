
import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight, MapPin, Briefcase, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOptimizedImageUrl } from '@/utils/imageOptimizer';
import { useSwipeGesture } from '@/utils/touchHandlers';
import { calculateAge } from '@/utils/dateUtils';

const MobileProfileCard = ({ 
  profile, 
  onClose, 
  onNext, 
  onPrevious, 
  onViewFullProfile,
  isFirst,
  isLast 
}) => {
  const handleSwipeLeft = () => {
    if (!isLast) {
      onNext();
    } else {
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  const handleSwipeRight = () => {
    if (!isFirst) {
      onPrevious();
    } else {
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  const handleSwipeDown = () => {
    onClose();
  };

  const { handlers, delta, isSwiping } = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipeDown: handleSwipeDown
  });

  if (!profile) return null;

  const age = calculateAge(profile.birth_date);
  const xOffset = isSwiping ? delta.x : 0;
  const yOffset = isSwiping && delta.y > 0 ? delta.y : 0; 

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ 
        y: isSwiping ? yOffset : 0, 
        x: isSwiping ? xOffset : 0,
        opacity: 1 
      }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-slate-900 rounded-t-3xl shadow-2xl border-t border-white/10 flex flex-col overflow-hidden touch-none"
      {...handlers}
    >
      <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing" onClick={onClose}>
        <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
      </div>

      <div className="relative w-full aspect-square max-h-[45vh] bg-slate-800 shrink-0">
         <img
            src={getOptimizedImageUrl(profile.image_url, 600)}
            alt={profile.name}
            className="w-full h-full object-cover"
            onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
         />
         <div className="hidden absolute inset-0 flex-col items-center justify-center text-slate-500">
             <User className="w-16 h-16 mb-2 opacity-50" />
             <span className="text-sm">Image unavailable</span>
         </div>
         
         <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />
         
         <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 bg-black/40 text-white hover:bg-black/60 rounded-full"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
         >
            <X className="w-5 h-5" />
         </Button>
      </div>

      <div className="flex-1 p-6 flex flex-col bg-slate-900 overflow-y-auto">
        <div className="mb-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">
                  {profile.name}, {age !== null ? age : 'N/A'}
                </h2>
                {profile.zodiac_sign && (
                     <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/20">
                         <span className="text-xs font-bold text-purple-200 uppercase flex items-center gap-1">
                             <Star className="w-3 h-3" />
                             {profile.zodiac_sign}
                         </span>
                     </div>
                )}
            </div>
            
            <div className="mt-2 space-y-1">
                {profile.location && (
                    <div className="flex items-center text-slate-300">
                        <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                        {profile.location}
                    </div>
                )}
                {profile.profession && (
                    <div className="flex items-center text-slate-400">
                        <Briefcase className="w-4 h-4 mr-2 text-slate-600" />
                        {profile.profession}
                    </div>
                )}
            </div>
        </div>

        {profile.bio && (
            <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                {profile.bio}
            </p>
        )}

        <div className="mt-auto pt-4">
            <Button 
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-900/20 group"
                onClick={() => onViewFullProfile(profile)}
            >
                View Full Profile
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileProfileCard;
