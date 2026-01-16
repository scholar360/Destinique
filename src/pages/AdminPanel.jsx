
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { runMigration } from '@/utils/migration';
import { updateThaiProfiles } from '@/utils/updateThaiProfiles';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trash2, Database, Eye, RefreshCw, Sprout } from 'lucide-react';
import AddProfileForm from '@/components/AddProfileForm';
import { Helmet } from 'react-helmet';

const AdminPanel = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCount = async () => {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching count:', error);
    } else {
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    fetchCount();
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMigration = async () => {
    setMigrating(true);
    toast({
       title: "Migration Started",
       description: "Inserting 30 authentic Chinese profiles...",
    });

    const result = await runMigration();
    setMigrating(false);

    if (result.success) {
      toast({
        title: "Migration Successful",
        description: result.message, // Uses detailed message from utils
        className: "bg-green-600 text-white"
      });
      fetchCount();
    } else {
      toast({
        title: "Migration Failed",
        description: result.message || "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSeedOrUpdate = async () => {
    setSeeding(true);
    toast({
       title: "Update Process Started",
       description: "Analyzing existing profiles and applying Thai updates...",
    });

    const result = await updateThaiProfiles();
    setSeeding(false);

    if (result.success) {
      toast({
        title: "Update Successful",
        description: result.message,
        className: "bg-green-600 text-white"
      });
      fetchCount();
    } else {
      toast({
        title: "Update Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveAllSamples = async () => {
    if (!window.confirm("Are you sure you want to delete ALL sample profiles? This cannot be undone.")) {
      return;
    }

    setLoading(true);
    // Delete where is_sample is true, or create a policy to delete all
    const { error, count } = await supabase
      .from('profiles')
      .delete({ count: 'exact' })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything
    
    setLoading(false);

    if (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error Deleting",
        description: `Failed to delete profiles: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Database Reset",
        description: `Successfully removed all profiles.`,
      });
      fetchCount();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <Helmet>
        <title>Admin Panel - Destinique</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stats Card */}
        <div className="bg-white/10 p-6 rounded-lg border border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Total Profiles</h2>
            <p className="text-slate-400">Current record count in database</p>
          </div>
          <div className="text-4xl font-bold text-purple-400">
            {totalCount}
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 p-6 rounded-lg border border-white/10 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              Data Management
            </h3>
            
            <Button 
              onClick={handleMigration} 
              disabled={migrating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {migrating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Database className="mr-2 h-4 w-4" />}
              Seed Chinese Profiles (Create New)
            </Button>
            
            <Button 
              onClick={handleSeedOrUpdate} 
              disabled={seeding}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {seeding ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sprout className="mr-2 h-4 w-4" />}
              Seed / Update Thai Profiles (Smart)
            </Button>
            <p className="text-xs text-gray-400 text-center mb-4">
              "Smart" will create 30 profiles if DB is empty, or update existing ones.
            </p>

            <Button 
              onClick={handleRemoveAllSamples} 
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete ALL Profiles (Reset DB)
            </Button>
          </div>

          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-green-400" />
              Quick Actions
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Use these tools to manage the database state during development.
            </p>
             <Button 
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={() => fetchCount()}
            >
              Refresh Count
            </Button>
          </div>
        </div>

        {/* Add Profile Form */}
        <AddProfileForm onSuccess={fetchCount} />

      </div>
    </div>
  );
};

export default AdminPanel;
