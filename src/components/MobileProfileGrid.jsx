
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '@/utils/imageOptimizer';
import ExpandedProfileCard from '@/components/ExpandedProfileCard';
import { calculateAge } from '@/utils/dateUtils';

const MobileProfileGrid = ({ profiles, onProfileClick }) => {
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(null);

  if (!profiles || !Array.isArray(profiles)) return null;

  const handleProfileTap = (index) => {
    setSelectedProfileIndex(index);
  };

  const handleClose = () => {
    setSelectedProfileIndex(null);
  };

  const handleNext = () => {
    if (selectedProfileIndex !== null && selectedProfileIndex < profiles.length - 1) {
      setSelectedProfileIndex(selectedProfileIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedProfileIndex !== null && selectedProfileIndex > 0) {
      setSelectedProfileIndex(selectedProfileIndex - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-1 w-full px-1 pb-20">
        {profiles.map((profile, index) => {
          const { id, name, image_url, birth_date } = profile;
          const age = calculateAge(birth_date);

          return (
            <div 
              key={id} 
              className="relative aspect-square bg-slate-800 overflow-hidden cursor-pointer"
              onClick={() => handleProfileTap(index)}
            >
               {image_url && (
                 <img
                    src={getOptimizedImageUrl(image_url, 300)}
                    alt={name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
               )}
               {/* Subtle overlay with info */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100 flex items-end p-2">
                 <span className="text-white text-xs font-semibold truncate w-full shadow-black drop-shadow-md">
                   {name}{age ? `, ${age}` : ''}
                 </span>
               </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {selectedProfileIndex !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/80 z-40"
            />
            {/* Expanded Card */}
            <ExpandedProfileCard
              profile={profiles[selectedProfileIndex]}
              onClose={handleClose}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onViewFullProfile={(p) => onProfileClick && onProfileClick(p)}
              isFirst={selectedProfileIndex === 0}
              isLast={selectedProfileIndex === profiles.length - 1}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileProfileGrid;
