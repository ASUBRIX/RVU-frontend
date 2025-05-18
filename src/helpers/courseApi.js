import httpClient from './httpClient';

const COURSE_BASE_URL = '/api/courses';

export const getAllCourses = (params = {}) => {
  return httpClient.get(COURSE_BASE_URL, { params });
};

export const getCourseById = (id) => {
  return httpClient.get(`${COURSE_BASE_URL}/${id}`);
};

export const createCourse = (data) => {
  return httpClient.post(COURSE_BASE_URL, data);
};



export const updateCourse = (id, data) => {
  return httpClient.put(`${COURSE_BASE_URL}/${id}`, data);
};

export const deleteCourse = (id) => {
  return httpClient.delete(`${COURSE_BASE_URL}/${id}`);
};

export const getCourseStats = () => {
  return httpClient.get(`${COURSE_BASE_URL}/stats`);
};

export const getCourseReviews = (courseId) => {
  return httpClient.get(`${COURSE_BASE_URL}/${courseId}/reviews`);
};

export const approveCourse = (id) => {
  return httpClient.patch(`${COURSE_BASE_URL}/${id}/approve`);
};

export const rejectCourse = (id) => {
  return httpClient.patch(`${COURSE_BASE_URL}/${id}/reject`);
};

export const getCourseCategories = () => {
  return httpClient.get(`${COURSE_BASE_URL}/categories`);
};

export const createCategoryWithSubcategories = (data) => {
  
  return httpClient.post(`${COURSE_BASE_URL}/categories`, data);
};

export const getCourseEarnings = (data) => {
  
  return httpClient.post(`${COURSE_BASE_URL}/earnings`, data);
};

