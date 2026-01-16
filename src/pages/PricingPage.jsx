
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

function PricingPage() {
  const { user, updateSubscription } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = (tier, price) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    if (tier === 'starter') {
      updateSubscription('starter');
      toast({
        title: "Subscription updated",
        description: "You're now on the Starter plan",
      });
      return;
    }

    toast({
      title: "🚧 Payment processing not implemented yet",
      description: "Stripe integration will be added in the next update. For now, enjoy premium features!",
    });
    
    updateSubscription(tier);
  };

  const tiers = [
    {
      name: 'Starter',
      price: 1.00,
      originalPriceDisplay: 'Free',
      priceDisplay: '$1.00',
      description: 'Essential cosmic connection tools',
      icon: Sparkles,
      features: [
        '5 swipes per day',
        'Basic compatibility scores',
        'View profile assessments',
        'Standard matching algorithm',
        'Limited filters'
      ],
      cta: 'Current Plan',
      tier: 'starter'
    },
    {
      name: 'Premium',
      price: 1.99,
      originalPriceDisplay: '$19.99',
      priceDisplay: '$1.99',
      savings: 'Save 90%',
      description: 'Unlock full compatibility insights',
      icon: Zap,
      popular: true,
      features: [
        'Unlimited swipes',
        'Advanced compatibility breakdown',
        'See who liked you',
        'Enhanced matching algorithm',
        'Advanced filters',
        'Rewind last swipe',
        'Boost your profile weekly'
      ],
      cta: 'Upgrade to Premium',
      tier: 'premium'
    },
    {
      name: 'Elite',
      price: 2.99,
      originalPriceDisplay: '$39.99',
      priceDisplay: '$2.99',
      savings: 'Save 92%',
      description: 'The ultimate VIP experience',
      icon: Crown,
      features: [
        'Everything in Premium',
        'Priority matching',
        'Exclusive cosmic insights',
        'Personal astrology consultation',
        'Read receipts',
        'Unlimited boosts',
        'VIP support',
        'Early access to new features'
      ],
      cta: 'Go Elite',
      tier: 'elite'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - Destinique | Choose Your Plan</title>
        <meta name="description" content="Choose the perfect Destinique plan for your cosmic journey. Limited time promotion on all plans." />
      </Helmet>

      <div className="min-h-screen bg-slate-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            {/* LIMITED TIME PROMOTION Banner */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg mb-10 inline-flex items-center justify-center gap-3 animate-pulse"
            >
              <Clock className="w-6 h-6" />
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                <span className="text-xl uppercase tracking-wider">Limited Time Promotion!</span>
                <span className="text-base font-normal opacity-90">Lock in these cosmic prices now!</span>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Cosmic Journey
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Unlock deeper connections and enhanced compatibility insights with our premium plans
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              const isCurrentPlan = user?.subscription === tier.tier;
              
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 transition-transform duration-300 hover:scale-[1.02] ${
                    tier.popular ? 'border-purple-500 shadow-2xl shadow-purple-900/20' : 'border-white/10'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  )}

                  {/* Savings Badge */}
                  {tier.savings && (
                    <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 border border-green-500/50 px-3 py-1 rounded-full text-xs font-bold">
                      {tier.savings}
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <Icon className={`w-12 h-12 mx-auto mb-4 ${
                      tier.popular ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    
                    {/* Price Display Block */}
                    <div className="flex flex-col items-center justify-center my-4 space-y-1">
                      <span className="text-sm text-gray-500 line-through font-medium">
                        {tier.originalPriceDisplay}
                        {tier.originalPriceDisplay !== 'Free' && '/mo'}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-purple-400">
                          {tier.priceDisplay}
                        </span>
                        <span className="text-lg text-gray-400">/month</span>
                      </div>
                    </div>
                    
                    {tier.description && (
                       <p className="text-sm text-gray-400 mt-2 h-10 flex items-center justify-center">{tier.description}</p>
                    )}
                  </div>

                  <div className="flex-grow">
                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-gray-300">
                          <Check className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                            tier.popular ? 'text-purple-400' : 'text-green-400'
                          }`} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleSubscribe(tier.tier, tier.price)}
                    disabled={isCurrentPlan}
                    className={`w-full py-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                      tier.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-900/40'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    {isCurrentPlan ? 'Current Plan' : tier.cta}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-400 mb-4">All plans include our core cosmic compatibility features</p>
            <p className="text-sm text-gray-500">Cancel anytime. No hidden fees. Prices in USD.</p>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default PricingPage;
