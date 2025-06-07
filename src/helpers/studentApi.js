import httpClient from './httpClient';

// Get profile
export const getProfile = async () => {
  const res = await httpClient.get('/api/student/profile');
  return res.data;
};

// Update profile
export const updateProfile = async (profileData) => {
  const res = await httpClient.put('/api/student/profile', profileData);
  return res.data;
};
