import axios from './httpClient';

const ANNOUNCEMENT_BASE_URL = '/api/announcements';

export const getAnnouncements = () => {
  return axios.get(ANNOUNCEMENT_BASE_URL);
};

export const createAnnouncement = (data) => {
  return axios.post(ANNOUNCEMENT_BASE_URL, data);
};

export const updateAnnouncement = (id, data) => {
  return axios.put(`${ANNOUNCEMENT_BASE_URL}/${id}`, data);
};

export const deleteAnnouncement = (id) => {
  return axios.delete(`${ANNOUNCEMENT_BASE_URL}/${id}`);
};
