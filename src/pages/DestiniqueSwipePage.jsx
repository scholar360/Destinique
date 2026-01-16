
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Sliders, ArrowLeft, Star, Ghost, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DestiniqueSwipeCard from '@/components/DestiniqueSwipeCard';
import { calculateCompatibility } from '@/utils/matchingEngine';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { useProfiles } from '@/hooks/useProfiles';

function DestiniqueSwipePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  // Using useProfiles hook as requested, ensuring no hardcoded data is used
  const { profiles: fetchedProfiles, loading: profilesLoading, error: profilesError, refetch } = useProfiles();
  
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [minScore, setMinScore] = useState(60);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ likes: 0, passes: 0 });

  // Filter and map profiles once fetched
  useEffect(() => {
    if (!user?.profile?.assessments) {
      if (!profilesLoading && fetchedProfiles && fetchedProfiles.length > 0) {
          toast({
            title: "Profile Incomplete",
            description: "Please complete your assessments to unlock cosmic matching.",
            variant: "destructive"
          });
          navigate('/profile');
      }
      return;
    }

    if (fetchedProfiles && fetchedProfiles.length > 0) {
      const profilesWithScores = fetchedProfiles.map(profile => {
        // Construct basic assessment object from DB fields if necessary
        const syntheticAssessments = {
           horoscope: { sign: profile.zodiac_sign || "Aries" },
           bazi: { element: profile.bazi_element || "Wood", animal: profile.bazi_animal || "Rat" }
        };

        return {
          ...profile,
          assessments: syntheticAssessments, 
          photo: profile.image_url, 
          compatibility: calculateCompatibility(user.profile.assessments, syntheticAssessments)
        };
      }).filter(p => p.compatibility.overall >= minScore);

      setProfiles(profilesWithScores);
      setCurrentIndex(0);
    }
  }, [user, fetchedProfiles, minScore, profilesLoading, navigate, toast]);

  const handleSwipe = (direction) => {
    const currentProfile = profiles[currentIndex];
    setHistory(prev => [...prev, { profile: currentProfile, action: direction }]);

    if (direction === 'like') {
      setStats(prev => ({ ...prev, likes: prev.likes + 1 }));
      toast({
        title: "Cosmic Connection! ✨",
        description: `You sent a like to ${currentProfile.name}.`,
      });
    } else {
      setStats(prev => ({ ...prev, passes: prev.passes + 1 }));
    }

    setCurrentIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const lastAction = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(prev => Math.max(0, prev - 1));
    
    if (lastAction.action === 'like') {
      setStats(prev => ({ ...prev, likes: prev.likes - 1 }));
    } else {
      setStats(prev => ({ ...prev, passes: prev.passes - 1 }));
    }
  };

  if (profilesLoading) {
    return (
       <div className="min-h-screen bg-slate-900 flex items-center justify-center">
         <div className="text-center">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-white">Consulting the stars...</p>
         </div>
       </div>
    );
  }

  if (profilesError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
         <div className="text-center">
            <h2 className="text-xl text-red-400 mb-2">Error loading profiles</h2>
            <Button onClick={refetch} variant="outline" className="text-white">Retry</Button>
         </div>
       </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cosmic Swipe - Destinique</title>
        <meta name="description" content="Find your perfect match through 7 dimensions of compatibility." />
      </Helmet>

      <div className="min-h-screen bg-slate-900 overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-6 flex flex-col h-screen max-w-md md:max-w-2xl">
          
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-purple-400 fill-current animate-pulse" />
              <h1 className="text-xl font-bold text-white tracking-wide">Destinique</h1>
            </div>
            <Button 
              variant="ghost" 
              className={`text-white hover:bg-white/10 ${showFilters ? 'bg-white/10' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Sliders className="w-5 h-5" />
            </Button>
          </header>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/20 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-200">Min Compatibility Score</span>
                  <span className="text-sm font-bold text-purple-400">{minScore}%</span>
                </div>
                <Slider
                  value={[minScore]}
                  min={0}
                  max={95}
                  step={5}
                  onValueChange={(val) => setMinScore(val[0])}
                  className="py-4"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe Area */}
          <div className="flex-1 relative mb-6">
            <AnimatePresence>
              {profiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-white">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <Ghost className="w-10 h-10 text-gray-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">No profiles available</h2>
                  <p className="text-gray-400 mb-6 max-w-xs mx-auto">
                    Try adjusting your filters or come back later for new cosmic matches.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setMinScore(50)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Lower Minimum Score
                  </Button>
                </div>
              ) : currentIndex < profiles.length ? (
                <DestiniqueSwipeCard
                  key={profiles[currentIndex].id}
                  profile={profiles[currentIndex]}
                  compatibility={profiles[currentIndex].compatibility}
                  onSwipe={handleSwipe}
                  onUndo={handleUndo}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-white">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <RefreshCcw className="w-10 h-10 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">That's everyone for now!</h2>
                  <p className="text-gray-400 mb-6">Adjust your filters to see more cosmic matches.</p>
                  <Button 
                    onClick={() => {
                      setCurrentIndex(0);
                      setMinScore(50);
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Reset & Review
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Stats */}
          <div className="flex justify-between px-8 py-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/5">
             <div className="text-center">
               <span className="block text-2xl font-bold text-white">{stats.likes}</span>
               <span className="text-xs text-gray-400 uppercase tracking-wider">Likes</span>
             </div>
             <div className="text-center">
               <span className="block text-2xl font-bold text-purple-400">{currentIndex}</span>
               <span className="text-xs text-gray-400 uppercase tracking-wider">Seen</span>
             </div>
             <div className="text-center">
               <span className="block text-2xl font-bold text-gray-500">{stats.passes}</span>
               <span className="text-xs text-gray-400 uppercase tracking-wider">Passes</span>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default DestiniqueSwipePage;
