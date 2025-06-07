import httpClient from '../httpClient';

// Get website settings (Public)
export const getWebsiteSettingsPublic = async () => {
  const response = await httpClient.get('/api/settings');
  return response.data;
};
