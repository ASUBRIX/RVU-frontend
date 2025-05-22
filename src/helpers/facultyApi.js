import httpClient from './httpClient';

export const getAllFaculties = () => httpClient.get('/api/faculty');
export const createFaculty = (data) => httpClient.post('/api/faculty', data);
export const updateFaculty = (id, data) => httpClient.put(`/api/faculty/${id}`, data);
export const deleteFaculty = (id) => httpClient.delete(`/api/faculty/${id}`);
