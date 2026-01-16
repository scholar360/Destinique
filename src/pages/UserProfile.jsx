
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Activity, Brain, Zap, Save, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { generateAssessments } from '@/utils/assessmentCalculator';
import { calculateCosmicScores } from '@/utils/calculateCosmicScores';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import CosmicScoreDisplay from '@/components/CosmicScoreDisplay';
import { supabase } from '@/lib/customSupabaseClient';

function UserProfile() {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: '',
    birthDate: '',
    location: '',
    bioAge: 25,
    stamina: 5,
    enneagramType: 1,
    tarotCard: 'The Magician',
    humanDesignType: 'Generator',
    greekGear: 'Alpha'
  });

  const [cosmicScores, setCosmicScores] = useState({
    psychologicalScore: null,
    systemicScore: null,
    breakdown: null
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        bio: user.profile.bio || '',
        birthDate: user.profile.birthDate || '',
        location: user.profile.location || '',
        bioAge: user.profile.bioAge || 25,
        stamina: user.profile.stamina || 5,
        enneagramType: user.profile.assessments?.enneagram?.type || 1,
        tarotCard: user.profile.assessments?.tarot?.card || 'The Magician',
        humanDesignType: user.profile.assessments?.humanDesign?.type || 'Generator',
        greekGear: user.profile.assessments?.greekGear?.gear || 'Alpha'
      });

      // Initialize scores if user has birthdate
      if (user.profile.birthDate) {
        // Option 1: Load from DB if they exist (assuming user object has these fields from AuthContext or previous fetch)
        // If not, calculate fresh.
        // For this task, we will calculate fresh on load if not present to show UI immediately
        const scores = calculateCosmicScores(user.profile.birthDate, user.name || "User");
        if (scores) {
          setCosmicScores(scores);
        }
      }
    }
    
    // Fetch scores from Supabase if they exist there to ensure we have the persisted values
    const fetchSavedScores = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('users')
          .select('psychological_dimension_score, systemic_dimension_score')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
           // We prioritize calculated display, but we can verify logic here if needed.
           // For now, let's trust the onBlur calculation for the UI experience.
        }
      }
    };
    fetchSavedScores();

  }, [user]);

  const handleBirthDateBlur = () => {
    if (formData.birthDate) {
      const scores = calculateCosmicScores(formData.birthDate, user?.name || "User");
      if (scores) {
        setCosmicScores(scores);
        toast({
          title: "Cosmic Dimensions Calculated ✨",
          description: "Your birth date has revealed your cosmic dimensional scores.",
        });
      }
    }
  };

  const handleSave = async () => {
    if (!formData.birthDate) {
      toast({
        title: "Missing Birth Date",
        description: "Your birth date is required for calculation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // 1. Generate full detailed assessments (existing logic)
    const baseAssessments = generateAssessments(formData.birthDate, user.name);
    
    const fullAssessments = {
      ...baseAssessments,
      bioAge: formData.bioAge,
      stamina: formData.stamina,
      enneagram: { ...baseAssessments.enneagram, type: formData.enneagramType }, 
      tarot: { ...baseAssessments.tarot, card: formData.tarotCard },
      humanDesign: { ...baseAssessments.humanDesign, type: formData.humanDesignType },
      greekGear: { ...baseAssessments.greekGear, gear: formData.greekGear }
    };

    const profileData = {
      ...user.profile,
      bio: formData.bio,
      birthDate: formData.birthDate,
      location: formData.location,
      bioAge: formData.bioAge,
      stamina: formData.stamina,
      assessments: fullAssessments,
      completionPercentage: 100
    };

    // 2. Update Context/Standard Profile
    await updateUserProfile(profileData);
    
    // 3. Persist Cosmic Scores to Supabase Users Table specifically
    try {
      if (cosmicScores.psychologicalScore !== null && cosmicScores.systemicScore !== null) {
        const { error } = await supabase
          .from('users')
          .update({
            psychological_dimension_score: cosmicScores.psychologicalScore,
            systemic_dimension_score: cosmicScores.systemicScore
          })
          .eq('id', user.id);

        if (error) throw error;
      }
    } catch (err) {
      console.error("Failed to save cosmic scores:", err);
      toast({
        title: "Warning",
        description: "Profile saved, but cosmic scores could not be synced to the mainframe.",
        variant: "destructive"
      });
    }

    setLoading(false);
    toast({
      title: "Cosmic Profile Updated! 🌟",
      description: "Your compatibility engine has been recalibrated.",
    });
    
    // Short delay before redirect
    setTimeout(() => {
      navigate('/destinique-swipe');
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Cosmic Profile - Destinique</title>
      </Helmet>

      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white">Your Cosmic Blueprint</h1>
              <div className="text-sm font-medium text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full">
                {user?.profile?.completionPercentage || 0}% Complete
              </div>
            </div>

            <div className="space-y-8">
              {/* Basic Info */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center"><User className="w-5 h-5 mr-2 text-purple-400"/> Basic Info</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      onBlur={handleBirthDateBlur}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Updates cosmic scores automatically.</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div>
                   <label className="text-sm text-gray-300 block mb-1">Bio</label>
                   <textarea
                     value={formData.bio}
                     onChange={(e) => setFormData({...formData, bio: e.target.value})}
                     className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none h-24"
                     placeholder="Share your cosmic journey..."
                   />
                </div>
              </section>

              {/* Cosmic Score Display Component */}
              <CosmicScoreDisplay 
                psychologicalScore={cosmicScores.psychologicalScore}
                systemicScore={cosmicScores.systemicScore}
                breakdown={cosmicScores.breakdown}
              />

              {/* Physical Dimension */}
              <section className="space-y-4 pt-4 border-t border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center"><Activity className="w-5 h-5 mr-2 text-red-400"/> Physical Dimension</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Bio-Age</span>
                      <span className="text-purple-400 font-bold">{formData.bioAge}</span>
                    </label>
                    <Slider
                      value={[formData.bioAge]}
                      min={18}
                      max={80}
                      step={1}
                      onValueChange={(val) => setFormData({...formData, bioAge: val[0]})}
                    />
                    <p className="text-xs text-gray-500 mt-2">Your biological vitality age.</p>
                  </div>
                  <div>
                    <label className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Stamina Level</span>
                      <span className="text-purple-400 font-bold">{formData.stamina}/10</span>
                    </label>
                    <Slider
                      value={[formData.stamina]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(val) => setFormData({...formData, stamina: val[0]})}
                    />
                    <p className="text-xs text-gray-500 mt-2">Your energetic endurance.</p>
                  </div>
                </div>
              </section>

              {/* Psychological Dimension */}
              <section className="space-y-4 pt-4 border-t border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center"><Brain className="w-5 h-5 mr-2 text-blue-400"/> Psychological Dimension</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Enneagram Type</label>
                    <select 
                      value={formData.enneagramType}
                      onChange={(e) => setFormData({...formData, enneagramType: parseInt(e.target.value)})}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"
                    >
                      {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n} className="text-black">Type {n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Tarot Archetype</label>
                    <select 
                      value={formData.tarotCard}
                      onChange={(e) => setFormData({...formData, tarotCard: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"
                    >
                      {['The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers'].map(c => 
                        <option key={c} value={c} className="text-black">{c}</option>
                      )}
                    </select>
                  </div>
                </div>
              </section>

              {/* Systemic Dimension */}
              <section className="space-y-4 pt-4 border-t border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center"><Zap className="w-5 h-5 mr-2 text-yellow-400"/> Systemic Dimension</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Human Design Type</label>
                    <select 
                      value={formData.humanDesignType}
                      onChange={(e) => setFormData({...formData, humanDesignType: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"
                    >
                      {['Manifestor', 'Generator', 'Manifesting Generator', 'Projector', 'Reflector'].map(t => 
                        <option key={t} value={t} className="text-black">{t}</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Greek Gear Profile</label>
                    <select 
                      value={formData.greekGear}
                      onChange={(e) => setFormData({...formData, greekGear: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"
                    >
                      {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map(g => 
                        <option key={g} value={g} className="text-black">{g}</option>
                      )}
                    </select>
                  </div>
                </div>
              </section>

              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 rounded-xl font-bold text-lg mt-8"
              >
                {loading ? <Loader className="animate-spin mr-2" /> : <Save className="mr-2" />}
                Save & Update Cosmic Profile
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
