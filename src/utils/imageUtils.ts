// Utility functions for handling product images consistently across the app

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Resolves the correct image URL for a product image
 * Handles different image path formats and provides fallbacks
 */
export const resolveImageUrl = (imagePath: string | null | undefined): string => {
  // Return placeholder if no image path provided
  if (!imagePath || imagePath.trim() === '') {
    return '/placeholder.svg';
  }

  // If it's already a full URL (starts with http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it starts with /uploads, prepend the base URL without /api
  if (imagePath.startsWith('/uploads')) {
    return `${API_BASE_URL.replace('/api', '')}${imagePath}`;
  }

  // If it starts with /lovable-uploads (static assets), return as is
  if (imagePath.startsWith('/lovable-uploads')) {
    return imagePath;
  }

  // If it's a relative path, assume it's from uploads
  if (!imagePath.startsWith('/')) {
    return `${API_BASE_URL.replace('/api', '')}/uploads/${imagePath}`;
  }

  // Default case - return the path as is
  return imagePath;
};

/**
 * Creates an error handler for image loading failures
 * Provides consistent fallback behavior
 */
export const createImageErrorHandler = (fallbackSrc: string = '/placeholder.svg') => {
  return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== fallbackSrc) {
      target.src = fallbackSrc;
    }
  };
};

/**
 * Validates if an image file is acceptable for upload
 */
export const isValidImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
};

/**
 * Gets a human-readable error message for invalid image files
 */
export const getImageValidationError = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.';
  }
  
  if (file.size > maxSize) {
    return 'File size too large. Please upload an image smaller than 5MB.';
  }
  
  return null;
};
