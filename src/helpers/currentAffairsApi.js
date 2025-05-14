import httpClient from './httpClient';

export const getCurrentAffairs = () => httpClient.get('/api/current-affairs');
export const createCurrentAffair = (data) => httpClient.post('/api/current-affairs', data);
export const updateCurrentAffair = (id, data) => httpClient.put(`/api/current-affairs/${id}`, data);
export const deleteCurrentAffair = (id) => httpClient.delete(`/api/current-affairs/${id}`);
