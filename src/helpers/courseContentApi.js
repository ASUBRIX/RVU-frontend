// helpers/courseContentApi.js

// Mock implementation - replace with real httpClient when ready
const mockHttpClient = {
  get: async (url) => {
    console.log('Mock GET:', url);
    return { contents: [], videoModules: [] };
  },
  post: async (url, data) => {
    console.log('Mock POST:', url, data);
    return { message: 'Course content saved successfully' };
  }
};

// Get course content by course ID
const getCourseContentById = async (courseId) => {
  try {
    if (!courseId) {
      throw new Error('Course ID is required');
    }
    
    const response = await mockHttpClient.get(`/api/admin/course-content/${courseId}`);
    return response;
  } catch (error) {
    console.error('Error fetching course content:', error);
    
    // If course content doesn't exist yet, return empty structure
    if (error.response?.status === 404 || error.response?.data?.contents) {
      return { contents: [], videoModules: [] };
    }
    
    throw error;
  }
};

// Create or update course content
const upsertCourseContent = async (courseId, courseData) => {
  try {
    if (!courseId) {
      throw new Error('Course ID is required');
    }
    
    const response = await mockHttpClient.post(`/api/admin/course-content/${courseId}`, courseData);
    return response;
  } catch (error) {
    console.error('Error saving course content:', error);
    throw error;
  }
};

// Get empty course content structure for new courses
const getEmptyCourseContent = () => {
  return {
    contents: [],
    videoModules: []
  };
};

export {
  getCourseContentById,
  upsertCourseContent,
  getEmptyCourseContent
};