import httpClient from '../httpClient';

// Get website settings (Admin)
export const getWebsiteSettingsAdmin = async () => {
  const response = await httpClient.get('/api/admin/settings');
  return response.data;
};

// Update website settings (Admin)
export const updateWebsiteSettingsAdmin = async (formData) => {
  const response = await httpClient.put('/api/admin/settings', formData);
  return response.data;
};
