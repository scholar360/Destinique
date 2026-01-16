
import React, { useState, useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ArrowUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import ProfileGrid from '@/components/ProfileGrid';
import ProfileModal from '@/components/ProfileModal';
import { supabase } from '@/lib/customSupabaseClient';

const MembershipValueSection = React.lazy(() => import('@/components/MembershipValueSection'));

function LandingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [passedProfiles, setPassedProfiles] = useState([]);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('destinique_likes') || '[]');
    const savedPasses = JSON.parse(localStorage.getItem('destinique_passes') || '[]');
    setLikedProfiles(savedLikes);
    setPassedProfiles(savedPasses);

    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      // Fetch birth_date instead of age
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, birth_date, location, profession, image_url, zodiac_sign')
        .limit(8);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Failed to load profiles", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };

  const handleCloseModal = () => {
    setSelectedProfile(null);
  };

  const handleLike = () => {
    if (!selectedProfile) return;
    
    const newLikes = [...likedProfiles, selectedProfile.id];
    setLikedProfiles(newLikes);
    localStorage.setItem('destinique_likes', JSON.stringify(newLikes));
    
    toast({
      title: "It's a Match! (Maybe)",
      description: `You liked ${selectedProfile.name}.`,
      variant: "default",
      className: "bg-purple-600 border-purple-500 text-white"
    });
    
    handleCloseModal();
  };

  const handlePass = () => {
    if (!selectedProfile) return;
    
    const newPasses = [...passedProfiles, selectedProfile.id];
    setPassedProfiles(newPasses);
    localStorage.setItem('destinique_passes', JSON.stringify(newPasses));
    
    toast({
       title: "Passed",
       description: "Maybe next time.",
    });

    handleCloseModal();
  };

  const handleViewDetails = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>Destinique - Discover Cosmic Connections</title>
        <meta name="description" content="Browse profiles and find your cosmic match on Destinique." />
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500 selection:text-white">
        
        <nav className="fixed top-0 left-0 w-full z-40 p-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5 transition-all">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <Star className="w-6 h-6 text-purple-400 fill-purple-400" />
              <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Destinique</span>
            </div>
            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-sm text-gray-300 hover:text-white">Log In</Button>
              </Link>
              <Link to="/pricing">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5 shadow-lg shadow-purple-900/20">Join</Button>
              </Link>
            </div>
          </div>
        </nav>

        <header className="relative pt-32 pb-16 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1657533472082-1c19df4d4b98" 
               alt="Cosmic background" 
               className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            >
              Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Cosmic Soulmate</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto mb-8"
            >
              Explore profiles matched by 7 dimensions of compatibility. Tap on a profile to see your cosmic connection.
            </motion.p>
          </div>
        </header>

        <main className="px-4 pb-20 min-h-[60vh]">
           {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
               {[...Array(4)].map((_, i) => (
                 <Skeleton key={i} className="aspect-[3/4] rounded-xl bg-slate-900/50" />
               ))}
             </div>
           ) : profiles.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="bg-slate-900/50 p-6 rounded-full mb-6 ring-1 ring-white/10">
                 <Users className="w-16 h-16 text-gray-500" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">No profiles available</h3>
               <p className="text-gray-400 max-w-md">
                 We're currently updating our cosmic database. Please check back later for new connections written in the stars.
               </p>
             </div>
           ) : (
             <ProfileGrid 
               profiles={profiles} 
               onProfileClick={handleProfileClick} 
               likedProfiles={likedProfiles}
             />
           )}
        </main>

        <Suspense fallback={<div className="h-20" />}>
          <MembershipValueSection />
        </Suspense>

        <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm bg-black/40 mt-12">
          <p>© 2026 Destinique. All rights reserved.</p>
        </footer>

        <ProfileModal 
           profile={selectedProfile}
           isOpen={!!selectedProfile}
           onClose={handleCloseModal}
           onLike={handleLike}
           onPass={handlePass}
           onViewDetails={handleViewDetails}
        />

        <motion.button
           initial={{ opacity: 0 }}
           animate={{ opacity: window.scrollY > 500 ? 1 : 0 }}
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           className="fixed bottom-8 right-8 p-3 bg-purple-600 text-white rounded-full shadow-lg z-30 hover:bg-purple-700 transition-colors"
           style={{ pointerEvents: window.scrollY > 500 ? 'auto' : 'none' }}
        >
           <ArrowUp className="w-5 h-5" />
        </motion.button>
      </div>
    </>
  );
}

export default React.memo(LandingPage);
