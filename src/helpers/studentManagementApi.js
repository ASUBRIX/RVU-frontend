import httpClient from './httpClient'

// Get all students
export const getAllStudents = async () => {
  return await httpClient.get('/api/admin/students');
};

// Add new student
export const addStudent = async (studentData) => {
  return await httpClient.post('/api/admin/student-management', studentData);
};

// Update student by ID
export const updateStudent = async (id, studentData) => {
  return await httpClient.put(`/api/admin/student-management/${id}`, studentData);
};

// Delete student by ID
export const deleteStudent = async (id) => {
  return await httpClient.delete(`/api/admin/student-management/${id}`);
};
