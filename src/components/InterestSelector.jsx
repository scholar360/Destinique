
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const INTEREST_CATEGORIES = {
  "Creativity": ["Art", "Design", "Photography", "Writing", "Music", "Dancing", "Crafts", "DIY"],
  "Fan Favorites": ["Anime", "K-Pop", "Marvel", "DC", "Harry Potter", "Star Wars", "Gaming", "Cosplay"],
  "Social and Content": ["Instagram", "TikTok", "Youtube", "Podcasts", "Blogging", "Streaming", "Memes"],
  "Sports and Fitness": ["Gym", "Running", "Yoga", "Hiking", "Swimming", "Basketball", "Soccer", "Tennis"],
  "Staying In": ["Cooking", "Baking", "Reading", "Board Games", "Gardening", "Meditation", "Pets"],
  "TV and Movies": ["Comedy", "Horror", "Sci-Fi", "Romance", "Action", "Documentaries", "Drama", "Thriller"],
  "Values and Causes": ["Environment", "Human Rights", "Animal Welfare", "Politics", "Volunteering", "Sustainability"]
};

const MAX_INTERESTS = 10;

const InterestSelector = ({ selectedInterests = [], onChange }) => {
  const { toast } = useToast();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      onChange(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= MAX_INTERESTS) {
        toast({
          title: "Limit Reached",
          description: `You can only select up to ${MAX_INTERESTS} interests.`,
          variant: "destructive"
        });
        return;
      }
      onChange([...selectedInterests, interest]);
    }
  };

  const clearCategory = (category) => {
    const categoryInterests = INTEREST_CATEGORIES[category];
    onChange(selectedInterests.filter(i => !categoryInterests.includes(i)));
  };

  const selectAllCategory = (category) => {
    const categoryInterests = INTEREST_CATEGORIES[category];
    const newInterests = [...selectedInterests];
    
    // Only add items that fit within the limit
    let addedCount = 0;
    categoryInterests.forEach(item => {
      if (!newInterests.includes(item)) {
        if (newInterests.length < MAX_INTERESTS) {
          newInterests.push(item);
          addedCount++;
        }
      }
    });

    if (addedCount === 0 && newInterests.length >= MAX_INTERESTS) {
       toast({
          title: "Limit Reached",
          description: "Cannot add more interests.",
          variant: "destructive"
        });
    }

    onChange(newInterests);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-300">
          Interests ({selectedInterests.length}/{MAX_INTERESTS})
        </label>
        {selectedInterests.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onChange([])}
            className="h-6 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {Object.entries(INTEREST_CATEGORIES).map(([category, items]) => {
          const isExpanded = expandedCategory === category;
          const selectedInCategory = items.filter(i => selectedInterests.includes(i));
          const count = selectedInCategory.length;

          return (
            <div key={category} className="bg-slate-800/50 rounded-lg border border-white/5 overflow-hidden">
              <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-800 transition-colors"
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{category}</span>
                  {count > 0 && (
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 text-[10px] px-1.5 py-0">
                      {count}
                    </Badge>
                  )}
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>

              {isExpanded && (
                <div className="p-3 pt-0 border-t border-white/5 bg-slate-900/30">
                  <div className="flex justify-end gap-2 mb-3 mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[10px] px-2 text-gray-400"
                      onClick={(e) => { e.stopPropagation(); clearCategory(category); }}
                    >
                      Clear Category
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[10px] px-2 text-purple-400"
                      onClick={(e) => { e.stopPropagation(); selectAllCategory(category); }}
                    >
                      Select All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => {
                      const isSelected = selectedInterests.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleInterest(item)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 border",
                            isSelected 
                              ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/20" 
                              : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {item}
                          {isSelected && <Check className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterestSelector;
