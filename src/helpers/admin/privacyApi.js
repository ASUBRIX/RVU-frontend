import httpClient from '@/helpers/httpClient';

const API_BASE = '/api/admin/privacy';

export const fetchPrivacyPolicy = () => {
  return httpClient.get(`${API_BASE}`);
};

export const updatePrivacyPolicy = (content) => {
  return httpClient.put(`${API_BASE}`, { content });
};
