
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Heart, X, Share2, Star, Sparkles, Brain, Zap, Hash, Activity, Lock, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { getOptimizedImageUrl } from '@/utils/imageOptimizer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { calculateAge, formatBirthDate } from '@/utils/dateUtils';
import InterestsPillDisplay from '@/components/InterestsPillDisplay';

function ProfileDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isProfileComplete = user && user.profile?.birthDate && user.profile?.bio;
  const showCompatibility = !!(user && isProfileComplete);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile detail:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleLike = () => {
    toast({
      title: "It's a like!",
      description: `You liked ${profile.name}. Fingers crossed!`,
    });
  };

  const handlePass = () => {
    toast({
      title: "Passed",
      description: "On to the next match...",
    });
    navigate(-1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Profile link copied to clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 pt-24 flex justify-center">
         <div className="w-full max-w-4xl space-y-8">
            <Skeleton className="w-full h-96 rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
         </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-gray-400 mb-6 text-center max-w-md">
           We couldn't locate this profile in our database. It may have been removed or the link is invalid.
        </p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const age = calculateAge(profile.birth_date);
  const formattedBirthDate = formatBirthDate(profile.birth_date);
  const getAssessment = (key) => profile.assessments?.[key] || {};

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 text-white pb-20"
    >
      <div className="relative h-[50vh] w-full">
        <img 
          src={getOptimizedImageUrl(profile.image_url, 1200)} 
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
        
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-white hover:bg-black/30 backdrop-blur-sm z-50 rounded-full p-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {profile.name}, {age !== null ? age : 'N/A'}
              </h1>
              
              <div className="flex items-center text-gray-300 text-sm mb-2 font-medium">
                 <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                 {profile.birth_date ? `Born: ${formattedBirthDate}` : 'Birth date unavailable'}
              </div>

              <div className="flex items-center text-gray-300 text-lg">
                <MapPin className="w-5 h-5 mr-2 text-purple-400" />
                {profile.location}
              </div>
              {profile.profession && (
                <div className="text-gray-400 text-sm mt-1">{profile.profession}</div>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-4 w-full md:w-auto">
              <div className="flex gap-4">
                 <Button onClick={handlePass} variant="outline" className="flex-1 md:flex-none h-14 w-14 rounded-full border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 hover:scale-110 transition-all">
                    <X className="w-6 h-6" />
                 </Button>
                 <Button onClick={handleLike} className="flex-1 md:flex-none h-14 px-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all shadow-lg shadow-purple-900/50">
                    <Heart className="w-6 h-6 mr-2 fill-white" /> Like
                 </Button>
                 <Button onClick={handleShare} variant="ghost" className="h-14 w-14 rounded-full hover:bg-white/10 hover:text-purple-300">
                    <Share2 className="w-5 h-5" />
                 </Button>
              </div>

               {!showCompatibility ? (
                 <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                    <Lock className="w-4 h-4 text-yellow-500" />
                    <Link to={!user ? "/login" : "/profile"} className="text-sm font-medium text-yellow-500 hover:underline">
                      {!user ? "Login to see score" : "Complete profile to unlock score"}
                    </Link>
                 </div>
               ) : (
                 <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-200">{profile.compatibilityScore || 85}% Compatibility</span>
                 </div>
               )}

            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">About</h3>
            <p className="text-gray-300 leading-relaxed text-lg mb-6">
              {profile.bio || "No bio yet, but their stars align with yours!"}
            </p>

            {/* Added Interests Display */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Interests</h3>
                <InterestsPillDisplay interests={profile.interests} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Cosmic Compatibility</h2>
          </div>

          {!showCompatibility && (
            <div className="bg-slate-900/50 border border-yellow-500/20 rounded-2xl p-6 text-center mb-6 relative overflow-hidden">
               <div className="absolute inset-0 bg-yellow-500/5 z-0" />
               <div className="relative z-10">
                 <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                 <h3 className="text-xl font-bold text-white mb-2">Unlock Full Compatibility Report</h3>
                 <p className="text-gray-400 max-w-lg mx-auto mb-4">
                   {!user 
                     ? "Create an account or log in to see deeply analyzed compatibility scores across 7 cosmic dimensions."
                     : "Your profile is missing key details (Bio or Birth Date) needed to calculate your cosmic resonance with this match."}
                 </p>
                 <Link to={!user ? "/signup" : "/profile"}>
                   <Button className="bg-yellow-600 hover:bg-yellow-700 text-white border-none">
                     {!user ? "Sign Up Free" : "Complete My Profile"}
                   </Button>
                 </Link>
               </div>
            </div>
          )}

          <div className={`grid md:grid-cols-2 gap-6 ${!showCompatibility ? 'opacity-50 blur-sm select-none pointer-events-none' : ''}`}>
             <AssessmentCard 
                icon={Star} 
                title="Horoscope" 
                value={getAssessment('horoscope').sign || profile.zodiac_sign || 'Unknown'}
                narrative={getAssessment('horoscope').narrative}
                color="text-yellow-400"
             />
             <AssessmentCard 
                icon={Activity} 
                title="Bazi" 
                value={profile.bazi_element ? `${profile.bazi_element} ${profile.bazi_animal}` : 'Unknown'}
                narrative={getAssessment('bazi').narrative}
                color="text-red-400"
             />
             <AssessmentCard 
                icon={Hash} 
                title="Numerology" 
                value={`Life Path ${getAssessment('numerology').lifePath || '?'}`}
                narrative={getAssessment('numerology').narrative}
                color="text-blue-400"
             />
             <AssessmentCard 
                icon={Brain} 
                title="Enneagram" 
                value={`Type ${getAssessment('enneagram').type || '?'}`}
                narrative={getAssessment('enneagram').narrative}
                color="text-green-400"
             />
             <AssessmentCard 
                icon={Zap} 
                title="Human Design" 
                value={getAssessment('humanDesign').type || 'Unknown'}
                narrative={getAssessment('humanDesign').narrative}
                color="text-purple-400"
             />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const AssessmentCard = ({ icon: Icon, title, value, narrative, color }) => (
  <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl hover:bg-slate-800/50 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
         <h4 className="text-sm text-gray-400 font-medium">{title}</h4>
         <p className="font-bold text-white">{value}</p>
      </div>
    </div>
    <p className="text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
       {narrative || "Complete your profile to unlock full compatibility insights for this dimension."}
    </p>
  </div>
);

export default ProfileDetailView;
