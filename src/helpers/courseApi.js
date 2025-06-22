// helpers/courseApi.js

// Mock implementation - replace with real httpClient when ready
const mockHttpClient = {
  get: async (url) => {
    console.log('Mock GET:', url);
    if (url.includes('/categories')) {
      return []; // Empty categories for now
    }
    return []; // Empty courses for now
  },
  post: async (url, data) => {
    console.log('Mock POST:', url, data);
    return {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString(),
      visibility_status: 'draft'
    };
  },
  put: async (url, data) => {
    console.log('Mock PUT:', url, data);
    return { id: 1, ...data };
  },
  delete: async (url) => {
    console.log('Mock DELETE:', url);
    return { message: 'Deleted' };
  }
};

// Create a new course
const createCourse = async (courseData) => {
  try {
    const response = await mockHttpClient.post('/api/admin/courses', courseData);
    return response;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Get course by ID
const getCourseById = async (courseId) => {
  if (!courseId) {
    throw new Error('Course ID is required');
  }
  
  try {
    const response = await mockHttpClient.get(`/api/admin/courses/${courseId}`);
    return response;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

// Update course details
const updateCourse = async (courseId, courseData) => {
  if (!courseId) {
    throw new Error('Course ID is required');
  }
  
  try {
    const response = await mockHttpClient.put(`/api/admin/courses/${courseId}`, courseData);
    return response;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

// Update course settings (advanced settings)
const updateCourseSettings = async (courseId, settingsData) => {
  if (!courseId) {
    throw new Error('Course ID is required');
  }
  
  try {
    const response = await mockHttpClient.put(`/api/admin/courses/${courseId}/settings`, settingsData);
    return response;
  } catch (error) {
    console.error('Error updating course settings:', error);
    throw error;
  }
};

// Get all courses
const getAllCourses = async () => {
  try {
    const response = await mockHttpClient.get('/api/admin/courses');
    return response;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Delete course
const deleteCourse = async (courseId) => {
  if (!courseId) {
    throw new Error('Course ID is required');
  }
  
  try {
    const response = await mockHttpClient.delete(`/api/admin/courses/${courseId}`);
    return response;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Get course statistics
const getCourseStats = async () => {
  try {
    const response = await mockHttpClient.get('/api/admin/courses/stats');
    return response;
  } catch (error) {
    console.error('Error fetching course stats:', error);
    throw error;
  }
};

// Get course categories
const getCourseCategories = async () => {
  try {
    const response = await mockHttpClient.get('/api/admin/courses/categories');
    return response;
  } catch (error) {
    console.error('Error fetching course categories:', error);
    throw error;
  }
};

// Create a new course category with subcategories
const createCategoryWithSubcategories = async (categoryData) => {
  try {
    console.log('Mock: Creating category with subcategories', categoryData);
    return {
      id: Date.now(),
      ...categoryData,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Create a new category
const createCategory = async (categoryData) => {
  try {
    console.log('Mock: Creating category', categoryData);
    return {
      id: Date.now(),
      ...categoryData,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Get course modules
const getCourseModules = async (courseId) => {
  try {
    console.log('Mock: Getting course modules for', courseId);
    return [];
  } catch (error) {
    console.error('Error fetching course modules:', error);
    throw error;
  }
};

// Create course module
const createCourseModule = async (moduleData) => {
  try {
    console.log('Mock: Creating course module', moduleData);
    return {
      id: Date.now(),
      ...moduleData,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating course module:', error);
    throw error;
  }
};

export {
  createCourse,
  getCourseById,
  updateCourse,
  updateCourseSettings,
  getAllCourses,
  deleteCourse,
  getCourseStats,
  getCourseCategories,
  createCategoryWithSubcategories,
  createCategory,
  getCourseModules,
  createCourseModule
};