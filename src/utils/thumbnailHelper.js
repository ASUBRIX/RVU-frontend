// src/utils/thumbnailHelper.js

/**
 * Get the base API URL for the application
 * Uses Vite environment variables
 */
export const getApiBaseUrl = () => {
  // For browser environment
  if (typeof window !== 'undefined') {
    // Use Vite environment variable if available
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    
    // Fallback: In development, use current origin with different port
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `${window.location.protocol}//${window.location.hostname}:5000`;
    }
    // In production, use current origin
    return window.location.origin;
  }
  
  // For Node.js environment (SSR) - fallback
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
};

/**
 * Get full thumbnail URL from relative path
 */
export const getThumbnailUrl = (thumbnailPath) => {
  if (!thumbnailPath) {
    return '/assets/default-course-thumbnail.jpg';
  }
  
  // If it's already a full URL, return as is
  if (thumbnailPath.startsWith('http')) {
    return thumbnailPath;
  }
  
  // If it's a relative path starting with /, construct full URL
  if (thumbnailPath.startsWith('/')) {
    return `${getApiBaseUrl()}${thumbnailPath}`;
  }
  
  // If it's a relative path without /, add / and construct full URL
  return `${getApiBaseUrl()}/${thumbnailPath}`;
};