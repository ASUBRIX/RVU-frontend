// // helpers/courseApi.js
// import httpClient from './httpClient'; // Adjust import path as needed

// // Create a new course
// const createCourse = async (courseData) => {
//   const response = await httpClient.post('/api/admin/courses', courseData);
//   return response.data;
// };

// // Get course by ID
// const getCourseById = async (courseId) => {
//   if (!courseId) {
//     throw new Error('Course ID is required');
//   }
  
//   const response = await httpClient.get(`/api/admin/courses/${courseId}`);
//   return response.data;
// };

// // Update course details
// const updateCourse = async (courseId, courseData) => {
//   if (!courseId) {
//     throw new Error('Course ID is required');
//   }
  
//   const response = await httpClient.put(`/api/admin/courses/${courseId}`, courseData);
//   return response.data;
// };

// // Get all courses
// const getAllCourses = async () => {
//   const response = await httpClient.get('/api/admin/courses');
//   return response.data;
// };

// // Delete course
// const deleteCourse = async (courseId) => {
//   if (!courseId) {
//     throw new Error('Course ID is required');
//   }
  
//   const response = await httpClient.delete(`/api/admin/courses/${courseId}`);
//   return response.data;
// };

// export {
//   createCourse,
//   getCourseById,
//   updateCourse,
//   getAllCourses,
//   deleteCourse
// };


// helpers/courseContentApi.js
// Note: Replace with your actual httpClient import path
// import httpClient from './httpClient';

// Temporary implementation without httpClient dependency
// Replace this with actual API calls once your backend is ready

// Get course content by course ID
const getCourseContentById = async (courseId) => {
  try {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // TODO: Replace with actual API call
    // const response = await httpClient.get(`/api/admin/course-content/${courseId}`);
    // return response.data;
    
    // Temporary mock implementation
    console.log(`Mock: Fetching course content for ID: ${courseId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return {
      contents: [
        {
          id: 1,
          title: 'Introduction',
          description: 'Course introduction',
          type: 'text',
          order: 1,
          content: 'Welcome to the course...'
        }
      ],
      videoModules: [
        {
          id: 1,
          title: 'Getting Started',
          description: 'Overview video',
          videoUrl: 'https://example.com/video1',
          duration: '10:30',
          order: 1,
          thumbnail: ''
        }
      ]
    };
    
  } catch (error) {
    console.error('Error fetching course content:', error);
    throw error;
  }
};

// Create or update course content
const upsertCourseContent = async (courseId, courseData) => {
  try {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // TODO: Replace with actual API call
    // const response = await httpClient.post(`/api/admin/course-content/${courseId}`, courseData);
    // return response.data;
    
    // Temporary mock implementation
    console.log(`Mock: Saving course content for ID: ${courseId}`, courseData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return success response
    return {
      message: 'Course content saved successfully',
      courseId: courseId
    };
    
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

// Export functions
export {
  getCourseContentById,
  upsertCourseContent,
  getEmptyCourseContent
};