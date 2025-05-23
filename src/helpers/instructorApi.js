import httpClient from './httpClient';

export const fetchInstructors = async () => {
  const res = await httpClient.get('/api/instructors');
  return res.data;
};
