
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, X, RotateCcw, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CompatibilityBreakdown from './CompatibilityBreakdown';

function DestiniqueSwipeCard({ profile, onSwipe, onUndo, compatibility }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipe('like');
    } else if (info.offset.x < -100) {
      onSwipe('pass');
    }
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag={!isExpanded ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute w-full ${isExpanded ? 'h-full z-50' : 'h-[600px]'} cursor-grab active:cursor-grabbing`}
    >
      <motion.div 
        layout
        className="relative w-full h-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Swipe Indicators */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 right-8 z-30 pointer-events-none">
          <div className="border-4 border-green-400 text-green-400 font-bold text-4xl px-4 py-2 rounded-lg transform rotate-12 bg-black/20 backdrop-blur-sm">
            LIKE
          </div>
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 left-8 z-30 pointer-events-none">
          <div className="border-4 border-red-500 text-red-500 font-bold text-4xl px-4 py-2 rounded-lg transform -rotate-12 bg-black/20 backdrop-blur-sm">
            PASS
          </div>
        </motion.div>

        {/* Photo Section */}
        <motion.div layout className={`relative ${isExpanded ? 'h-[40%]' : 'h-[75%]'}`}>
          <img
            src={profile.photos[currentPhotoIndex]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-slate-900" />
          
          {/* Photo Navigation */}
          {profile.photos.length > 1 && (
            <>
              <button onClick={prevPhoto} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextPhoto} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {profile.photos.map((_, idx) => (
                  <div key={idx} className={`h-1 rounded-full transition-all ${idx === currentPhotoIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`} />
                ))}
              </div>
            </>
          )}

          {/* Compatibility Badge */}
          <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg">
            <span className="text-purple-300 font-bold text-xl">{compatibility?.overall}%</span>
            <span className="text-white text-xs ml-1 uppercase tracking-wide">Match</span>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div 
          layout
          className={`relative bg-slate-900 p-6 flex flex-col ${isExpanded ? 'h-[60%] overflow-y-auto' : 'h-[25%]'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                {profile.name}, {profile.age}
              </h2>
              <div className="flex items-center text-gray-400 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {profile.location}
              </div>
            </div>
            <Button
              onClick={toggleExpand}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Info className="w-6 h-6" />
            </Button>
          </div>

          <p className="text-gray-300 line-clamp-2 mb-4">{profile.bio}</p>

          <AnimatePresence>
            {!isExpanded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-2 mt-auto overflow-x-auto pb-2"
              >
                {['Physical', 'Metaphysical', 'Sync'].map((dim, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-gray-300 whitespace-nowrap">
                    {dim}: <span className="text-purple-400 font-bold">{compatibility?.breakdown?.[dim.toLowerCase()]?.score || 0}%</span>
                  </div>
                ))}
              </motion.div>
            )}

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-6 pb-20"
              >
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                  <h3 className="text-purple-300 font-semibold mb-2">Cosmic Summary</h3>
                  <p className="text-gray-200 text-sm italic">"{compatibility?.narrative}"</p>
                </div>
                
                <CompatibilityBreakdown breakdown={compatibility?.breakdown} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons Overlay */}
          <div className={`absolute bottom-6 left-0 right-0 flex justify-center gap-6 ${isExpanded ? 'bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-12 pb-6' : ''}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSwipe('pass')}
              className="w-14 h-14 bg-slate-800 border border-red-500/50 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-950/30 transition-colors"
            >
              <X className="w-7 h-7" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onUndo}
              className="w-10 h-10 bg-slate-800 border border-yellow-500/50 text-yellow-500 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-950/30 transition-colors mt-2"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSwipe('like')}
              className="w-14 h-14 bg-slate-800 border border-green-500/50 text-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-950/30 transition-colors"
            >
              <Heart className="w-7 h-7 fill-current" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default DestiniqueSwipeCard;
