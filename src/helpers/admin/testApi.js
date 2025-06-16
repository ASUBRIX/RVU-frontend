import httpClient from '../httpClient';

export const createFolder = (data) => httpClient.post('/api/admin/test/folders', data);
export const getFolderContents = (folderId) => httpClient.get(`/api/admin/test/folders/${folderId}/contents`);
export const deleteFolder = (folderId) => httpClient.delete(`/api/admin/test/folders/${folderId}`);

export const createTest = (data) => httpClient.post('/api/admin/test', data);
export const updateTestSettings = (testId, data) => httpClient.put(`/api/admin/test/${testId}/settings`, data);

export const addQuestion = (testId, data) => httpClient.post(`/api/admin/test/${testId}/questions`, data);
export const updateQuestion = (testId, questionId, data) => httpClient.put(`/api/admin/test/${testId}/questions/${questionId}`, data);
export const deleteQuestion = (testId, questionId) => httpClient.delete(`/api/admin/test/${testId}/questions/${questionId}`);
export const getAllQuestions = (testId) => httpClient.get(`/api/admin/test/${testId}/questions`);

export const searchTests = (queryStr, sortBy) => httpClient.get(`/api/admin/test/search?query=${queryStr}&sort=${sortBy}`);


