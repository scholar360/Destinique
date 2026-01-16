
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Info } from 'lucide-react';

const ScoreGauge = ({ score, label, description, icon: Icon, colorClass }) => {
  // Determine color based on score
  let barColor = 'bg-red-500';
  let textColor = 'text-red-400';
  
  if (score > 33) {
    barColor = 'bg-yellow-500';
    textColor = 'text-yellow-400';
  }
  if (score > 66) {
    barColor = 'bg-green-500';
    textColor = 'text-green-400';
  }

  return (
    <div className="bg-black/30 rounded-xl p-5 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/5 ${textColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{label}</h3>
            <p className="text-gray-400 text-xs max-w-[180px]">{description}</p>
          </div>
        </div>
        <div className={`text-2xl font-bold ${textColor}`}>
          {score}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${barColor} rounded-full`}
        />
      </div>

      {/* Tooltip-ish Info */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <Info className="w-4 h-4 text-gray-500 cursor-help" />
      </div>
    </div>
  );
};

const CosmicScoreDisplay = ({ psychologicalScore, systemicScore, breakdown }) => {
  if (psychologicalScore === null || systemicScore === null) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-8"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1" />
        <h2 className="text-xl font-bold text-white uppercase tracking-widest text-center mx-4">Cosmic Dimensions</h2>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ScoreGauge 
          score={psychologicalScore}
          label="Psychological"
          description="Your inner self, emotional resilience, and compatibility traits."
          icon={Brain}
          colorClass="blue"
        />
        <ScoreGauge 
          score={systemicScore}
          label="Systemic"
          description="Your harmony with cosmic cycles, adaptability, and outer alignment."
          icon={Zap}
          colorClass="purple"
        />
      </div>

      {breakdown && (
        <div className="text-center text-sm text-gray-500 flex justify-center gap-4 flex-wrap">
          <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5">
             Element: <span className="text-gray-300">{breakdown.baziElement}</span>
          </span>
           <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5">
             Zodiac: <span className="text-gray-300">{breakdown.zodiacSign}</span>
          </span>
           <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5">
             Life Path: <span className="text-gray-300">{breakdown.lifePathNumber}</span>
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default CosmicScoreDisplay;
