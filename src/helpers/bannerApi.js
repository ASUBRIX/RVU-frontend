import httpClient from './httpClient';

// Fetch all banners with optional search/sort params
export const fetchBanners = (params) => {
  return httpClient.get('/api/admin/banners', { params });
};

// Get a single banner by ID
export const getBannerById = (id) => {
  return httpClient.get(`/api/admin/banners/${id}`);
};

// Create a new banner
export const createBanner = (formData) => {
  return httpClient.post('/api/admin/banners', formData);
};

// Update an existing banner
export const updateBanner = (id, formData) => {
  return httpClient.put(`/api/admin/banners/${id}`, formData);
};

// Delete a banner
export const deleteBanner = (id) => {
  return httpClient.delete(`/api/admin/banners/${id}`);
};