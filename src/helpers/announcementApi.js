import httpClient from "./httpClient";


const ANNOUNCEMENT_BASE_URL = '/api/admin/announcements';

export const getAnnouncements = () => {
  return httpClient.get(ANNOUNCEMENT_BASE_URL);
};

export const createAnnouncement = (data) => {
  return httpClient.post(ANNOUNCEMENT_BASE_URL, data);
};

export const updateAnnouncement = (id, data) => {
  return httpClient.put(`${ANNOUNCEMENT_BASE_URL}/${id}`, data);
};

export const deleteAnnouncement = (id) => {
  return httpClient.delete(`${ANNOUNCEMENT_BASE_URL}/${id}`);
};

