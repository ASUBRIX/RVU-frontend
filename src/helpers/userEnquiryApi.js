import httpClient from './httpClient';

export const getEnquiryPrefill = async () => {
  const res = await httpClient.get('/api/contact-enquiry/prefill');
  return res.data;
};

export const submitEnquiry = async (formData) => {
  const res = await httpClient.post('/api/contact-enquiry', formData);
  return res.data;
};
