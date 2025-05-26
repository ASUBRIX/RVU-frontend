import httpClient from './httpClient';

export const getCurrentAffairs = () => httpClient.get('/api/admin/current-affairs');
export const createCurrentAffair = (data) => httpClient.post('/api/admin/current-affairs', data);
export const updateCurrentAffair = (id, data) => httpClient.put(`/api/admin/current-affairs/${id}`, data);
export const deleteCurrentAffair = (id) => httpClient.delete(`/api/admin/current-affairs/${id}`);
