
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_sample', true);

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addProfile = async (newProfile) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select();

      if (error) throw error;
      
      setProfiles(prev => [...prev, ...data]);
      toast({
        title: "Success",
        description: "Profile added successfully!",
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error adding profile:', err);
      toast({
        title: "Error",
        description: "Failed to add profile.",
        variant: "destructive",
      });
      return { success: false, error: err };
    }
  };

  const deleteProfile = async (id) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProfiles(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Profile deleted successfully.",
      });
    } catch (err) {
      console.error('Error deleting profile:', err);
      toast({
        title: "Error",
        description: "Failed to delete profile.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return {
    profiles,
    loading,
    error,
    addProfile,
    deleteProfile,
    refetch: fetchProfiles
  };
}
