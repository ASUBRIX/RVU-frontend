import httpClient from './httpClient';

export const getSeoSettings = () => httpClient.get('/seo-settings');
export const saveSeoSettings = (data) => httpClient.post('/seo-settings', data);
