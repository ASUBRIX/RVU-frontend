import httpClient from '@/helpers/httpClient';

// Fetch latest active Terms & Conditions
export const fetchTerms = () => {
  return httpClient.get('/api/legal/terms');
};

// Fetch latest active Privacy Policy
export const fetchPrivacyPolicy = () => {
  return httpClient.get('/api/legal/privacy');
};
