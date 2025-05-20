import httpClient from './httpClient'

// Get all students
export const getAllStudents = async () => {
  return await httpClient.get('/api/student-management');
};

// Add new student
export const addStudent = async (studentData) => {
  return await httpClient.post('/api/student-management', studentData);
};

// Update student by ID
export const updateStudent = async (id, studentData) => {
  return await httpClient.put(`/api/student-management/${id}`, studentData);
};

// Delete student by ID
export const deleteStudent = async (id) => {
  return await httpClient.delete(`/api/student-management/${id}`);
};
