import httpClient from './httpClient';

// Fetch all banners with optional search/sort params
export const fetchBanners = (params) => {
  return httpClient.get('/api/banners', { params });
};

// Get a single banner by ID
export const getBannerById = (id) => {
  return httpClient.get(`/api/banners/${id}`);
};

// Create a new banner
export const createBanner = (formData) => {
  return httpClient.post('/api/banners', formData);
};

// Update an existing banner
export const updateBanner = (id, formData) => {
  return httpClient.put(`/api/banners/${id}`, formData);
};

// Delete a banner
export const deleteBanner = (id) => {
  return httpClient.delete(`/api/banners/${id}`);
};