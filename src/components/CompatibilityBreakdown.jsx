
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Heart, Zap, Star, Compass, Hash } from 'lucide-react';
import AssessmentNarrative from './AssessmentNarrative';

function CompatibilityBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const dimensions = [
    { key: 'physical', label: 'Physical', icon: Activity, color: 'text-red-400' },
    { key: 'metaphysical', label: 'Metaphysical', icon: Star, color: 'text-indigo-400' },
    { key: 'psychological', label: 'Psychological', icon: Brain, color: 'text-blue-400' },
    { key: 'sync', label: 'Sync', icon: Zap, color: 'text-yellow-400' },
    { key: 'horoscope', label: 'Horoscope', icon: Star, color: 'text-purple-400' },
    { key: 'numerology', label: 'Numerology', icon: Hash, color: 'text-green-400' },
    { key: 'humanDesign', label: 'Human Design', icon: Compass, color: 'text-pink-400' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">7-Dimension Compatibility Report</h3>
      
      <div className="grid gap-4">
        {dimensions.map((dim) => {
          const data = breakdown[dim.key];
          if (!data) return null;

          return (
            <div key={dim.key} className="space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-300 mb-1">
                <span className="flex items-center gap-2">
                  <dim.icon className={`w-4 h-4 ${dim.color}`} />
                  {dim.label}
                </span>
                <span className="font-bold text-white">{data.score}%</span>
              </div>
              
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r from-purple-600 to-pink-600`}
                />
              </div>

              <AssessmentNarrative
                title={dim.label}
                narrative={data.narrative}
                icon={dim.icon}
                color={dim.color}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CompatibilityBreakdown;
