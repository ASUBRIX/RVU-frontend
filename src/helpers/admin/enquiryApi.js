import httpClient from '@/helpers/httpClient';

const ENQUIRY_BASE = '/api/admin/enquiries';

const enquiryApi = {
  getAll: () => httpClient.get(ENQUIRY_BASE),

  getById: (id) => httpClient.get(`${ENQUIRY_BASE}/${id}`),

  markAsRead: (id) => httpClient.patch(`${ENQUIRY_BASE}/${id}/read`),

  delete: (id) => httpClient.delete(`${ENQUIRY_BASE}/${id}`),
};

export default enquiryApi;
