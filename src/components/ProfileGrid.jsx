
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Briefcase, User } from 'lucide-react';
import { getOptimizedImageUrl } from '@/utils/imageOptimizer';
import { calculateAge } from '@/utils/dateUtils';
import MobileProfileGrid from '@/components/MobileProfileGrid';
import InterestsPillDisplay from '@/components/InterestsPillDisplay';

const ProfileGrid = ({ profiles, onProfileClick }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Log rendered profile IDs as requested
    if (profiles && profiles.length > 0) {
      console.log(`Rendered profile IDs: ${profiles.map(p => p.id).join(', ')}`);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [profiles]);

  if (!profiles || !Array.isArray(profiles)) return null;

  if (isMobile) {
    // Pass ALL profiles to MobileProfileGrid
    return <MobileProfileGrid profiles={profiles} onProfileClick={onProfileClick} />;
  }

  // Desktop/Tablet View
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full h-full max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
      <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4 pb-12"
      >
        {profiles.map((profile) => {
          const { id, name, location, profession, image_url, zodiac_sign, birth_date, interests } = profile;
          const age = calculateAge(birth_date);

          return (
            <motion.div
              key={id}
              variants={item}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 bg-slate-900 border border-white/5"
              onClick={() => onProfileClick && onProfileClick(profile)}
            >
              {/* Image Layer */}
              <div className="absolute inset-0 bg-slate-800">
                  {image_url ? (
                     <img
                      src={getOptimizedImageUrl(image_url, 400)}
                      alt={name || 'Profile'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                      onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback */}
                  <div 
                    className={`absolute inset-0 flex-col items-center justify-center text-slate-500 bg-slate-800 p-4 text-center ${image_url ? 'hidden' : 'flex'}`}
                  >
                      <User className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-xs">No Image</span>
                  </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content Layer */}
              <div className="absolute bottom-0 left-0 w-full p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white truncate shadow-black drop-shadow-sm">
                    {name || "Unknown"}
                  </h3>
                  <span className="text-purple-300 text-lg font-medium">
                    {age !== null ? age : 'N/A'}
                  </span>
                </div>
                
                <div className="space-y-1.5">
                    {location && (
                      <div className="flex items-center text-gray-300 text-xs font-medium">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-purple-400 shrink-0" />
                          <span className="truncate">{location}</span>
                      </div>
                    )}
                    
                    {profession && (
                      <div className="flex items-center text-gray-400 text-xs">
                          <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" />
                          <span className="truncate">{profession}</span>
                      </div>
                    )}

                    <div className="flex items-center mt-2 flex-wrap gap-1">
                      {zodiac_sign && (
                         <span className="px-2.5 py-0.5 bg-purple-500/20 backdrop-blur-md rounded-full text-[10px] uppercase tracking-wide text-purple-200 border border-purple-500/20 flex items-center font-bold">
                           <Star className="w-3 h-3 mr-1" />
                           {zodiac_sign}
                         </span>
                       )}
                       <InterestsPillDisplay interests={interests} limit={2} />
                     </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ProfileGrid;
