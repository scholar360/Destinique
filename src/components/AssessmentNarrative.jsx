
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Star, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

function AssessmentNarrative({ title, narrative, icon: Icon, color = "text-purple-400", score }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
    >
      <div 
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex gap-3">
          <div className={`mt-1 p-2 rounded-full bg-white/5 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">{title}</h4>
            <p className="text-gray-300 text-sm mt-1 leading-relaxed">
              {narrative}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {score && (
            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-purple-300">
              {score}%
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-white/10 text-sm text-gray-400">
              <div className="flex items-center gap-2 mb-2 text-purple-300">
                <Info className="w-4 h-4" />
                <span className="font-medium">Deep Dive</span>
              </div>
              <p>
                This assessment analyzes the vibrational frequency of your {title.toLowerCase()} profile.
                The narrative above captures the core essence of this dimension, revealing how your unique energetic signature interacts with the cosmos.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AssessmentNarrative;
