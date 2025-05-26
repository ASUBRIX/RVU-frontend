import httpClient from './httpClient';

export const getAllFaculties = () => httpClient.get('/api/admin/faculties');
export const createFaculty = (data) => httpClient.post('/api/admin/faculties', data);
export const updateFaculty = (id, data) => httpClient.put(`/api/admin/faculties/${id}`, data);
export const deleteFaculty = (id) => httpClient.delete(`/api/admin/faculties/${id}`);
