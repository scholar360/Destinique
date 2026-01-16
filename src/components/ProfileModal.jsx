
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MapPin, ArrowRight, Lock, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOptimizedImageUrl } from '@/utils/imageOptimizer';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { calculateAge } from '@/utils/dateUtils';

const ProfileModal = ({ profile, isOpen, onClose, onLike, onPass, onViewDetails }) => {
  const { user } = useAuth();
  
  if (!isOpen || !profile) return null;

  const isProfileComplete = user && user.profile?.birthDate && user.profile?.bio;
  const showCompatibility = !!(user && isProfileComplete);
  const age = calculateAge(profile.birth_date);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative h-96 shrink-0">
            <img
              src={getOptimizedImageUrl(profile.photo || profile.photos?.[0] || profile.image_url, 600)}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-white shadow-black drop-shadow-md">
                    {profile.name}, {age !== null ? age : 'N/A'}
                  </h2>
                  <div className="flex items-center text-gray-200 text-sm mt-1 font-medium">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.location}
                  </div>
                </div>
                
                {showCompatibility ? (
                   <div className="bg-purple-600/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-purple-400/30 shadow-lg text-center">
                    <span className="block text-xl font-bold text-white">{profile.compatibilityScore}%</span>
                    <span className="text-[10px] uppercase tracking-wider text-purple-100">Match</span>
                  </div>
                ) : (
                   <div className="bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg text-center flex flex-col items-center">
                    <span className="block text-sm font-bold text-purple-200">{profile.zodiac_sign}</span>
                    <Lock className="w-3 h-3 text-white/50 mt-1" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-2 flex-grow overflow-y-auto">
            {!showCompatibility && (
              <div className="mb-4 p-3 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-start gap-3">
                 <div className="p-2 bg-purple-500/20 rounded-full shrink-0">
                    <UserCog className="w-4 h-4 text-purple-300" />
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold text-white">Unlock Cosmic Compatibility</h4>
                    <p className="text-xs text-gray-300 mt-0.5">
                       {!user 
                         ? "Log in to see how well your stars align." 
                         : "Complete your Bio and Birth Date to reveal your match score."}
                    </p>
                    <Link to={!user ? "/login" : "/profile"}>
                       <Button variant="link" className="p-0 h-auto text-purple-400 text-xs mt-1 hover:text-purple-300">
                         {!user ? "Log In Now" : "Update Profile"} &rarr;
                       </Button>
                    </Link>
                 </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
               {profile.profession && (
                 <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-medium border border-white/10">
                   {profile.profession}
                 </span>
               )}
               {profile.zodiac_sign && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs font-medium border border-purple-500/20">
                  {profile.zodiac_sign}
                </span>
              )}
              {profile.interests?.slice(0, 3).map((interest, i) => (
                <span key={i} className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-xs border border-white/10">
                  {interest}
                </span>
              ))}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
              {profile.bio || "Seeking a cosmic connection that transcends the ordinary..."}
            </p>

            <Button 
              variant="outline" 
              className="w-full mb-6 border-white/10 hover:bg-white/5 text-purple-300 hover:text-purple-200"
              onClick={() => onViewDetails(profile.id)}
            >
              View Full Profile & Compatibility <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="p-6 pt-0 flex gap-4 mt-auto bg-slate-900">
            <Button
              onClick={onPass}
              variant="outline"
              className="flex-1 py-6 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl"
            >
              <X className="w-5 h-5 mr-2" /> Pass
            </Button>
            <Button
              onClick={onLike}
              className="flex-1 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-900/40 rounded-xl border-0"
            >
              <Heart className="w-5 h-5 mr-2 fill-white" /> Like
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;
