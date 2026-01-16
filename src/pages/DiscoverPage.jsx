
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sliders, Heart as HeartIcon, Ghost, Loader2 } from 'lucide-react';
import SwipeCard from '@/components/SwipeCard';
import { useAuth } from '@/contexts/AuthContext';
import { calculateCompatibility } from '@/utils/matchingEngine';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProfiles } from '@/hooks/useProfiles';
import { calculateAge } from '@/utils/dateUtils';

function DiscoverPage() {
  const { user, addLike } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profiles: fetchedProfiles, loading, error, refetch } = useProfiles();
  
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 99,
    location: ''
  });

  useEffect(() => {
    if (fetchedProfiles && fetchedProfiles.length > 0) {
      const mappedProfiles = fetchedProfiles.map(p => ({
        ...p,
        profile: {
           age: calculateAge(p.birth_date), // Pass calculated age to profile object for SwipeCard if it needs it
           assessments: {
             horoscope: { sign: p.zodiac_sign || "Aries" },
             bazi: { element: p.bazi_element || "Wood", animal: p.bazi_animal || "Rat" }
           }
        },
        photos: [p.image_url]
      })).filter(p => {
          // Filter Logic using calculated age
          const age = calculateAge(p.birth_date);
          if (age === null) return false;
          return age >= filters.minAge && age <= filters.maxAge;
      });
      setProfiles(mappedProfiles.sort(() => Math.random() - 0.5));
    }
  }, [fetchedProfiles, filters]); // Re-run when filters change

  const handleSwipe = (direction) => {
    const currentProfile = profiles[currentIndex];
    
    if (direction === 'like') {
      addLike(currentProfile.id);
      toast({
        title: "Match sent! 💜",
        description: `You liked ${currentProfile.name}`,
      });
    }

    setCurrentIndex(prev => prev + 1);
  };

  const currentProfile = profiles[currentIndex];
  
  const compatibility = currentProfile?.profile?.assessments && user?.profile?.assessments
    ? calculateCompatibility(user.profile.assessments, currentProfile.profile.assessments)
    : null;


  if (loading) {
     return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
     );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <p className="text-red-400 mb-4">Error loading profiles</p>
        <Button onClick={refetch}>Try Again</Button>
      </div>
    );
  }

  if (!user?.profile?.assessments) {
    return (
      <>
        <Helmet>
          <title>Discover - Destinique</title>
        </Helmet>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Complete Your Profile First</h2>
            <p className="text-gray-300 mb-6">
              To see compatibility scores and find your cosmic matches, please complete your profile with birth date and assessments.
            </p>
            <Button
              onClick={() => navigate('/profile')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Complete Profile
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (profiles.length === 0) {
    return (
      <>
        <Helmet>
          <title>Discover - Destinique</title>
        </Helmet>
        <div className="min-h-screen bg-slate-900 py-8 px-4 flex flex-col">
           <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
                  Discover
                </h1>
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <HeartIcon className="w-4 h-4 mr-2" />
                    Likes
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10">
                  <Ghost className="w-10 h-10 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No profiles available</h2>
                <p className="text-gray-400 mb-6 max-w-sm">
                  It seems quiet in the cosmos today. There are no profiles available to discover right now.
                </p>
                <Button onClick={() => setFilters({ minAge: 18, maxAge: 99, location: '' })} variant="link">
                   Reset Filters
                </Button>
              </div>
           </div>
        </div>
      </>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <>
        <Helmet>
          <title>Discover - Destinique</title>
        </Helmet>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No More Profiles</h2>
            <p className="text-gray-300 mb-6">
              You've seen all available profiles. Check back later for new matches!
            </p>
            <Button
              onClick={() => {
                setCurrentIndex(0);
                refetch();
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Start Over
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Discover - Destinique</title>
      </Helmet>

      <div className="min-h-screen bg-slate-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
              Discover
            </h1>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <HeartIcon className="w-4 h-4 mr-2" />
                Likes
              </Button>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Sliders className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6 border border-white/20"
            >
              <h3 className="text-white font-semibold mb-3">Filters</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Age Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minAge}
                      onChange={(e) => setFilters({ ...filters, minAge: parseInt(e.target.value) || 18 })}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={filters.maxAge}
                      onChange={(e) => setFilters({ ...filters, maxAge: parseInt(e.target.value) || 99 })}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="relative h-[600px]">
            <AnimatePresence>
              {currentProfile && (
                <SwipeCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  compatibility={compatibility}
                  onSwipe={handleSwipe}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            {profiles.length - currentIndex} profiles remaining
          </div>
        </div>
      </div>
    </>
  );
}

export default DiscoverPage;
