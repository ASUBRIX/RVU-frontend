import httpClient from '@/helpers/httpClient';

export const getAllFaculties = () => {
  return httpClient.get('/api/faculties');
};

export const createFaculty = (data) => {
  return httpClient.post('/api/faculties', data);
};

export const updateFaculty = (id, data) => {
  return httpClient.put(`/api/faculties/${id}`, data);
};

export const deleteFaculty = (id) => {
  return httpClient.delete(`/api/faculties/${id}`);
};
