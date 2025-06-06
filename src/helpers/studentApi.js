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


// Change email
export const changeEmail = async (email) => {
  const res = await httpClient.put('/api/student/profile', { email });
  return res.data;
};

// Change password
export const changePassword = async (payload) => {
  const res = await httpClient.put('/api/student/profile', payload);
  return res.data;
};
