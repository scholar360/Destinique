
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, CheckCircle, Brain, Zap, Lock, Star } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: "Serious Intentions Only",
    description: "Our membership model filters out fake profiles, bots, and scammers, ensuring you meet only real people looking for genuine connections.",
    color: "text-blue-400"
  },
  {
    icon: Sparkles,
    title: "7-Dimension Matching",
    description: "Unlock our proprietary algorithm that analyzes compatibility across Physical, Metaphysical, Psychological, and Cosmic dimensions.",
    color: "text-purple-400"
  },
  {
    icon: CheckCircle,
    title: "Verified Community",
    description: "Join a curated community of verified members who value authenticity, safety, and meaningful relationships.",
    color: "text-green-400"
  },
  {
    icon: Brain,
    title: "Deep Insights",
    description: "Gain access to detailed compatibility narratives and assessment breakdowns that go far beyond surface-level swiping.",
    color: "text-pink-400"
  },
  {
    icon: Zap,
    title: "Smart Algorithm",
    description: "Our matching engine learns from your preferences and cosmic blueprint to suggest highly compatible partners.",
    color: "text-yellow-400"
  },
  {
    icon: Lock,
    title: "Safe & Secure",
    description: "Enjoy a dating environment prioritized for safety, with end-to-end encryption and proactive security measures.",
    color: "text-red-400"
  },
  {
    icon: Star,
    title: "Quality Over Quantity",
    description: "Stop wasting time on endless swipes. Focus on quality matches that have real long-term potential.",
    color: "text-orange-400"
  }
];

function MembershipValueSection() {
  return (
    <section className="py-20 px-4 bg-slate-900/50 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">Premium Exclusive Community</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Why We Charge for Membership
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Destinique is designed for people who are serious about finding their cosmic match. Our membership ensures a high-quality, safe, and intentional dating experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-900/20"
              >
                <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${benefit.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MembershipValueSection;
