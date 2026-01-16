
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProfiles } from '@/hooks/useProfiles';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import InterestSelector from '@/components/InterestSelector';

const AddProfileForm = ({ onSuccess }) => {
  const { addProfile } = useProfiles();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    location: '',
    profession: '',
    image_url: '',
    zodiac_sign: 'Aries',
    bazi_element: 'Wood',
    is_sample: false,
    interests: [] // Array of strings
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestsChange = (newInterests) => {
    setFormData(prev => ({ ...prev, interests: newInterests }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.birth_date || !formData.image_url) {
      toast({
        title: "Validation Error",
        description: "Name, Birth Date, and Image URL are required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Pass interests directly to addProfile. 
    // The hook or backend logic should handle storing to both 'interests' column and 'profile_interests' table if needed.
    // Since we updated schema, storing in 'interests' (text[]) or 'interests_json' (jsonb) column is straightforward.
    const result = await addProfile({
      ...formData,
      is_sample: false
    });

    setLoading(false);
    if (result.success) {
      toast({
        title: "Success",
        description: "Profile created successfully!",
        className: "bg-green-600 text-white border-none"
      });
      
      setFormData({
        name: '',
        birth_date: '',
        location: '',
        profession: '',
        image_url: '',
        zodiac_sign: 'Aries',
        bazi_element: 'Wood',
        is_sample: false,
        interests: []
      });
      if (onSuccess) onSuccess();
    } else {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-lg border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-4">Add New Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Profile Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Birth Date</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Profession</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Job Title"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Zodiac Sign</label>
            <select
              name="zodiac_sign"
              value={formData.zodiac_sign}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">BaZi Element</label>
            <select
              name="bazi_element"
              value={formData.bazi_element}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {["Wood", "Fire", "Earth", "Metal", "Water"].map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>

        <InterestSelector 
          selectedInterests={formData.interests}
          onChange={handleInterestsChange}
        />

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Profile...
            </>
          ) : (
            'Add Profile'
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddProfileForm;
