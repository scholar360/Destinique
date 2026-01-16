
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Crown, Users, TrendingUp, Sparkles, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

function Dashboard() {
  const { user, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const stats = [
    {
      icon: Heart,
      label: 'Total Likes',
      value: 0, // Placeholder
      color: 'text-pink-400'
    },
    {
      icon: Users,
      label: 'Profile Views',
      value: Math.floor(Math.random() * 50) + 10, // Simulated
      color: 'text-purple-400'
    },
    {
      icon: TrendingUp,
      label: 'Match Rate',
      value: `${Math.floor(Math.random() * 30) + 60}%`,
      color: 'text-green-400'
    },
    {
      icon: Crown,
      label: 'Subscription',
      value: 'FREE',
      color: 'text-yellow-400'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Destinique</title>
        <meta name="description" content="View your Destinique stats and manage your account." />
      </Helmet>

      <div className="min-h-screen bg-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {currentUser?.full_name || user?.email}! ✨
                </h1>
                <p className="text-gray-400">Here's your cosmic journey overview</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2"/>
                Logout
              </Button>
            </div>

            {/* User Profile Summary Card */}
             <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8"
              >
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-purple-600/20 rounded-full">
                     <User className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-2">My Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400 block">Email</span>
                        <span className="text-white">{currentUser?.email}</span>
                      </div>
                      <div>
                         <span className="text-gray-400 block">Psychological Score</span>
                         <span className="text-white font-bold text-lg">{currentUser?.psychological_score || 'N/A'}</span>
                      </div>
                      <div>
                         <span className="text-gray-400 block">Systemic Score</span>
                         <span className="text-white font-bold text-lg">{currentUser?.systemic_score || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>


            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                  >
                    <Icon className={`w-8 h-8 ${stat.color} mb-3`} />
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/discover')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Browse Matches
                  </Button>
                  <Button
                    onClick={() => navigate('/profile')}
                    className="w-full bg-white/20 hover:bg-white/30 text-white"
                  >
                    Edit Profile Details
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <h2 className="text-xl font-bold text-white mb-4">Cosmic Status</h2>
                 <p className="text-gray-400">
                    Your cosmic profile is initialized. Check your detail view to see deep compatibility insights.
                 </p>
                 <div className="mt-4">
                    <Button variant="link" className="text-purple-400 pl-0" onClick={() => navigate('/profile')}>
                       Update Birth Chart &rarr;
                    </Button>
                 </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
