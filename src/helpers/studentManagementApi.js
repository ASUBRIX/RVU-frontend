import httpClient from './httpClient'

export const getAllStudents = async () => {
  return await httpClient.get('/api/admin/students');
};

export const addStudent = async (studentData) => {
  return await httpClient.post('/api/admin/students', studentData);
};

export const updateStudent = async (id, studentData) => {
  return await httpClient.put(`/api/admin/students/${id}`, studentData);
};

export const deleteStudent = async (id) => {
  return await httpClient.delete(`/api/admin/students/${id}`);
};




