import httpClient from './httpClient';

// Get profile
export const getProfile = async () => {
  const res = await httpClient.get('/api/user-profile');
  return res.data;
};

// Update profile
export const updateProfile = async (profileData) => {
  const res = await httpClient.put('/api/user-profile', profileData);
  return res.data;
};

// Change email
export const changeEmail = async (email) => {
  const res = await httpClient.put('/api/user-profile', { email });
  return res.data;
};

// Change password
export const changePassword = async (payload) => {
  const res = await httpClient.put('/api/user-profile', payload);
  return res.data;
};
