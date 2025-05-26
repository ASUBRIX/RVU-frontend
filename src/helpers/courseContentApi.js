import axios from './httpClient';

const COURSE_CONTENT_BASE_URL = '/api/admin/course-content';

export const getCourseContentById = (courseId) => {
  return axios.get(`${COURSE_CONTENT_BASE_URL}/${courseId}`);
};
