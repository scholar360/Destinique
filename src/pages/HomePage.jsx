
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Star, Moon, Compass, Zap, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileList from '@/components/ProfileList';

function HomePage() {
  const features = [
    {
      icon: Star,
      title: 'Bazi Chinese Astrology',
      description: 'Ancient five-element system revealing your cosmic blueprint and elemental compatibility with potential matches.'
    },
    {
      icon: Moon,
      title: 'Vedic Astrology',
      description: 'Sacred nakshatra analysis calculating nerve force alignment and karmic connections between souls.'
    },
    {
      icon: Compass,
      title: 'Numerology',
      description: 'Mathematical vibration analysis of life path, destiny, and soul numbers for perfect synchronization.'
    },
    {
      icon: Heart,
      title: 'Enneagram Personality',
      description: 'Deep personality type assessment identifying complementary patterns and growth-oriented partnerships.'
    },
    {
      icon: Sparkles,
      title: 'Tarot Archetypes',
      description: 'Mystical card readings revealing archetypal resonance and spiritual connection patterns.'
    },
    {
      icon: Zap,
      title: 'Human Design',
      description: 'Energetic blueprint analysis matching aura types, strategies, and authority for optimal flow.'
    },
    {
      icon: Users,
      title: 'Greek Gear Matching',
      description: 'Precision compatibility mechanics using geometric patterns for perfectly synchronized relationships.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Destinique - Find Your Cosmic Match Through Ancient Wisdom</title>
        <meta name="description" content="Discover meaningful connections through multidimensional compatibility matching using Bazi, Vedic astrology, numerology, and more." />
      </Helmet>

      <div className="min-h-screen bg-slate-900">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1643639779508-4c60952c058c"
              alt="Cosmic connection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-slate-900/90 to-slate-900" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-bounce-slow">
                <Sparkles className="w-8 h-8 text-purple-300" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Cosmic Match</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                Discover deep, meaningful connections through our revolutionary 7-Dimension Matching System.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/destinique-swipe">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-8 text-xl rounded-2xl shadow-xl shadow-purple-900/50 transform hover:scale-105 transition-all duration-300 group">
                    Start Cosmic Matching
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                 <Link to="/discover">
                  <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white px-10 py-8 text-xl rounded-2xl backdrop-blur-sm">
                    Browse Profiles
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Profile Showcase Section */}
        <section className="py-20 px-4 bg-slate-900 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Latest Cosmic Connections</h2>
                <p className="text-slate-400">Real profiles from your area waiting to connect.</p>
             </div>
             
             {/* Integrated Profile List */}
             <div className="min-h-[400px]">
                 <ProfileList />
             </div>
             
             <div className="mt-12 text-center">
                <Link to="/discover">
                   <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-900/20">
                     View All Profiles
                   </Button>
                </Link>
             </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-slate-800">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                The 7 Dimensions of Compatibility
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We go beyond surface-level interests to match you on a soul level.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 bg-slate-950 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
               <Star className="w-5 h-5 text-purple-500" />
               <span className="text-xl font-bold text-white">Destinique</span>
            </div>
            <p className="text-gray-500">© 2026 Destinique. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default HomePage;
