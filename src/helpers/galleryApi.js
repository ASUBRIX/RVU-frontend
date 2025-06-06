import httpClient from './httpClient';


// Get all gallery images
export const getGalleryImages = async () => {
  const response = await httpClient.get('/api/admin/gallery');
  return response.data; 
};


// Upload images
export const uploadGalleryImages = (formData) => {
  return httpClient.post('/api/admin/gallery/upload', formData);
};

// Delete a single gallery image by ID
export const deleteGalleryImage = (id) => {
  return httpClient.delete(`/api/admin/gallery/${id}`);
};
