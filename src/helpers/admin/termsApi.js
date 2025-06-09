import httpClient from '@/helpers/httpClient';

const API_BASE = '/api/admin/terms';

export const fetchTerms = () => {
  return httpClient.get(`${API_BASE}`);
};

export const updateTerms = (content) => {
  return httpClient.put(`${API_BASE}`, { content });
};
