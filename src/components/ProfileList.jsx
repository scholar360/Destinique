
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import ProfileGrid from './ProfileGrid';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfileList = ({ onProfileClick }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
  setLoading(true);
  setError(null);

  try {
    // Fetch ALL profiles without limits
    const { data, error: supabaseError } = await supabase
      .from('profiles')
      .select('*');

    if (supabaseError) {
      console.error("❌ [ProfileList] Supabase Error:", supabaseError);
      throw supabaseError;
    }

    console.log(`Total profiles fetched: ${data?.length || 0}`);
    setProfiles(data || []);
  } catch (err) {
    // ... error handling
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Error loading profiles</h3>
        <p className="text-slate-400 text-sm mb-4">
          Please try again later.
        </p>
        <Button onClick={fetchProfiles} variant="outline" className="border-white/20 text-white hover:bg-white/10">
          Retry
        </Button>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8 border border-white/10 rounded-xl bg-white/5">
        <h3 className="text-xl font-bold text-white mb-2">No profiles found</h3>
        <p className="text-slate-400 text-sm text-center">
           We couldn't find any profiles at the moment.
        </p>
        <Button onClick={fetchProfiles} variant="ghost" className="mt-4 text-purple-400 hover:text-purple-300">
           Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ProfileGrid 
        profiles={profiles} 
        onProfileClick={onProfileClick} 
      />
    </div>
  );
};

export default ProfileList;
