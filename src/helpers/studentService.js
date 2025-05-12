
import httpClient from './httpClient';

export const addStudent = async (studentData, token) => {
  console.log("add student");
  const response = await httpClient.post('/api/students', studentData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};