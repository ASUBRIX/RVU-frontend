import httpClient from '../httpClient';


export const getFreeFolders = () => httpClient.get('/api/tests/free');
export const getAllFreeFolders = (page = 1, limit = 12) => httpClient.get(`/api/tests/free/all?page=${page}&limit=${limit}`);
export const getPublicFolderContents = (folderId) => httpClient.get(`/api/tests/folders/${folderId}/contents/public`);
export const getTestDetails = (testId) => httpClient.get(`/api/tests/test/${testId}/take`);
export const submitTestAnswers = (testId, data) => httpClient.post(`/api/tests/test/${testId}/submit`, data);
export const getTestQuestionsForClient = (testId) => httpClient.get(`/api/tests/test/${testId}/questions/details`);
export const getTestHistory = (page = 1, sort = 'date_desc') => httpClient.get(`/api/tests/history?page=${page}&sort=${sort}`);
