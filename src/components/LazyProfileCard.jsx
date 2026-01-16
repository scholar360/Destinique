
import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getOptimizedImageUrl, getBlurryPlaceholderUrl } from '@/utils/imageOptimizer';
import { calculateAge } from '@/utils/dateUtils';

const LazyProfileCard = React.memo(({ profile, priority = false }) => {
  const [imageState, setImageState] = useState({
    src: '',
    blurSrc: '',
    loaded: false,
    error: false
  });
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  const profileImage = profile?.image_url || profile?.photo;
  const age = calculateAge(profile?.birth_date);

  useEffect(() => {
    if (!profileImage) return;

    const fullSrc = getOptimizedImageUrl(profileImage, 600, 85, 'webp');
    const blurSrc = getBlurryPlaceholderUrl(profileImage);

    if (priority) {
      setImageState(prev => ({ ...prev, src: fullSrc, blurSrc }));
    } else {
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setImageState(prev => ({ ...prev, src: fullSrc, blurSrc }));
          observerRef.current.disconnect();
        }
      });

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [profileImage, priority]);

  const handleImageLoad = () => {
    setImageState(prev => ({ ...prev, loaded: true }));
  };

  const handleImageError = () => {
    setImageState(prev => ({ ...prev, error: true }));
  };

  if (!profile) return <Skeleton className="w-full h-full rounded-3xl" />;

  return (
    <div 
      ref={imgRef}
      className="w-full h-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/10 relative group transform-gpu"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{ 
          backgroundImage: `url(${imageState.blurSrc})`,
          opacity: imageState.loaded ? 0 : 1
        }} 
      />

      {imageState.src && (
        <img 
          src={imageState.src}
          srcSet={`${getOptimizedImageUrl(profileImage, 400)} 400w, ${getOptimizedImageUrl(profileImage, 800)} 800w`}
          sizes="(max-width: 640px) 100vw, 400px"
          alt={profile.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-all duration-700 ease-out will-change-transform group-hover:scale-105 ${
            imageState.loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? "eager" : "lazy"}
        />
      )}

      {!imageState.loaded && !imageState.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm z-10">
          <Skeleton className="w-full h-full bg-white/5" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-20 pointer-events-none" />
      
      <div className="absolute bottom-0 left-0 w-full p-6 pb-24 z-30">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-3xl font-bold text-white shadow-black drop-shadow-md">
              {profile.name}, {age !== null ? age : 'N/A'}
            </h2>
            <div className="flex items-center text-gray-200 text-sm mt-1 font-medium">
              <MapPin className="w-4 h-4 mr-1" />
              {profile.location}
            </div>
          </div>
          <div className="flex flex-col items-center bg-purple-600/90 backdrop-blur-md p-2 rounded-lg border border-purple-400/30 shadow-lg">
            <span className="text-2xl font-bold text-white">{profile.compatibilityScore || 85}%</span>
            <span className="text-[10px] uppercase tracking-wider text-purple-100 opacity-90">Match</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {profile.zodiac_sign && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/20">
              {profile.zodiac_sign}
            </span>
          )}
          {profile.interests && profile.interests.slice(0, 2).map((interest, idx) => (
            <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-gray-100 border border-white/10">
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute top-8 left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40">
        <div className="bg-red-500/80 text-white px-4 py-2 rounded-lg transform -rotate-12 font-bold border-2 border-white/50 shadow-xl backdrop-blur-md">
          NOPE
        </div>
      </div>
      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40">
        <div className="bg-green-500/80 text-white px-4 py-2 rounded-lg transform rotate-12 font-bold border-2 border-white/50 shadow-xl backdrop-blur-md">
          LIKE
        </div>
      </div>
    </div>
  );
});

LazyProfileCard.displayName = 'LazyProfileCard';

export default LazyProfileCard;
