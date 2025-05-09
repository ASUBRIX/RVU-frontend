// helpers/galleryApi.js
import httpClient from './httpClient';

// Get all gallery images
export const getGalleryImages = () => {
  return httpClient.get('/api/gallery');
};

// Upload images (expects FormData with key 'images')
export const uploadGalleryImages = (formData) => {
  return httpClient.post('/api/gallery/upload', formData);
};

// Delete a single gallery image by ID
export const deleteGalleryImage = (id) => {
  return httpClient.delete(`/api/gallery/${id}`);
};
