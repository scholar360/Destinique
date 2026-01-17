import React, { useEffect, useState } from 'react';

const SimpleTest = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        console.log('🚀 Starting SimpleTest fetch...');
        
        const response = await fetch(
          'https://cpysowyucsepvxnsgucw.supabase.co/rest/v1/profiles?select=*',
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNweXNvd3l1Y3NlcHZ4bnNndWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NjQ0MzEsImV4cCI6MjA4MzU0MDQzMX0.ENsInAVQtFF4Uc2C1WwQDZKrttxeOKNEnDUawpo7_u8',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNweXNvd3l1Y3NlcHZ4bnNndWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NjQ0MzEsImV4cCI6MjA4MzU0MDQzMX0.ENsInAVQtFF4Uc2C1WwQDZKrttxeOKNEnDUawpo7_u8'
            }
          }
        );
        
        const data = await response.json();
        console.log('✅ SIMPLE TEST SUCCESS!');
        console.log('Total profiles:', data.length);
        console.log('All names:', data.map(p => p.name));
        console.log('All IDs:', data.map(p => p.id));
        
        setProfiles(data);
      } catch (error) {
        console.error('❌ SIMPLE TEST ERROR:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading test data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-white/10">
          <h1 className="text-4xl font-bold mb-2">SIMPLE DATABASE TEST</h1>
          <p className="text-gray-300">
            Direct API fetch bypassing all React components
          </p>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-lg">
              <span className="text-2xl font-bold text-green-400">{profiles.length}</span>
              <span className="ml-2 text-green-300">profiles fetched</span>
            </div>
            
            <div className="px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-lg">
              <span className="text-2xl font-bold text-blue-400">26</span>
              <span className="ml-2 text-blue-300">expected in DB</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Test Results:</h2>
          {profiles.length === 26 ? (
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-lg">
                ✅ SUCCESS! All 26 profiles loaded correctly.
              </p>
              <p className="text-gray-400 mt-2">
                This means your database API is working. The 8-profile limit is in your React code.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-lg">
                ⚠️ ISSUE! Only {profiles.length} of 26 profiles loaded.
              </p>
              <p className="text-gray-400 mt-2">
                This means the limit is at the database/API level.
              </p>
            </div>
          )}
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {profiles.map((profile, index) => (
            <div key={profile.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-purple-500/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                    <h3 className="text-lg font-bold text-white">{profile.name}</h3>
                  </div>
                  <span className="text-purple-400 font-medium">{profile.age}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${profile.is_sample ? 'bg-yellow-900/30 text-yellow-400' : 'bg-green-900/30 text-green-400'}`}>
                  {profile.is_sample ? 'Sample' : 'Real'}
                </span>
              </div>
              
              <div className="space-y-1 text-sm">
                {profile.location && (
                  <p className="text-gray-300">📍 {profile.location}</p>
                )}
                {profile.profession && (
                  <p className="text-gray-400">💼 {profile.profession}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">ID: {profile.id}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>Check browser console (F12) for detailed logs</p>
          <p className="mt-1">Expected: 26 profiles • Actual: {profiles.length} profiles</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;
