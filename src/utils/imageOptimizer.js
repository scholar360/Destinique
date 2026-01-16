
/**
 * Optimizes image URLs for performance
 * Currently configured for Unsplash URLs which support dynamic resizing
 */
export const getOptimizedImageUrl = (url, width = 600, quality = 80, format = 'webp') => {
  if (!url) return '';
  
  // Check if it's an Unsplash URL
  if (url.includes('images.unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format&fit=crop&w=${width}&q=${quality}&fm=${format}`;
  }
  
  return url;
};

export const getBlurryPlaceholderUrl = (url) => {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format&fit=crop&w=20&blur=10&q=10`;
  }
  return url;
};

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = reject;
  });
};
