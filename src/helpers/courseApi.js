import httpClient from './httpClient'

// Get all courses
export const getAllCourses = async () => {
  try {
    const response = await httpClient.get('/api/admin/courses')
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

export const getCourseCategories = async () => {
  try {
    const response = await httpClient.get('/api/admin/courses/categories')

    if (response.data && response.data.success) {
      return response.data
    } else if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
        total: response.data.length,
      }
    } else {
      return {
        success: true,
        data: response.data || [],
        total: 0,
      }
    }
  } catch (error) {
    console.error('Error fetching course categories:', error)
    console.error('Error details:', error.response?.data)
    throw error
  }
}

export const createCategoryWithSubcategories = async (categoryData) => {
  try {
    console.log('Creating category:', categoryData)
    const response = await httpClient.post('/api/admin/courses/categories', categoryData)
    console.log('Category creation response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error creating category:', error)
    console.error('Error response:', error.response?.data)
    throw error
  }
}

export const addSubcategoriesToCategory = async (categoryId, subcategoriesData) => {
  try {
    console.log('Adding subcategories to category:', categoryId, subcategoriesData)
    const response = await httpClient.post(`/api/admin/courses/categories/${categoryId}/subcategories`, subcategoriesData)
    console.log('Subcategories addition response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error adding subcategories:', error)
    console.error('Error response:', error.response?.data)
    throw error
  }
}

export const deleteCategory = async (categoryId) => {
  try {
    console.log('Deleting category:', categoryId)
    const response = await httpClient.delete(`/api/admin/courses/categories/${categoryId}`)
    console.log('Category deletion response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error deleting category:', error)
    console.error('Error response:', error.response?.data)
    throw error
  }
}

// Create a new course
export const createCourse = async (courseData) => {
  try {
    console.log('Creating course:', courseData)
    const response = await httpClient.post('/api/admin/courses', courseData)
    console.log('Course creation response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}

// Get course by ID
export const getCourseById = async (courseId) => {
  if (!courseId) {
    throw new Error('Course ID is required')
  }

  try {
    const response = await httpClient.get(`/api/admin/courses/${courseId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching course:', error)
    throw error
  }
}

// Update course details
export const updateCourse = async (courseId, courseData) => {
  if (!courseId) {
    throw new Error('Course ID is required')
  }

  try {
    const response = await httpClient.put(`/api/admin/courses/${courseId}`, courseData)
    return response.data
  } catch (error) {
    console.error('Error updating course:', error)
    throw error
  }
}

// 🔥 NEW: Upload course thumbnail
export const uploadCourseThumbnail = async (courseId, thumbnailFile) => {
  try {
    const formData = new FormData();
    formData.append('thumbnail', thumbnailFile);
    formData.append('courseId', courseId);

    console.log('Uploading thumbnail for course:', courseId);
    console.log('Thumbnail file:', thumbnailFile);
    
    const response = await httpClient.post('/api/admin/courses/upload-thumbnail', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    console.log('Thumbnail upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw error;
  }
};

// Update course settings (advanced settings)
export const updateCourseSettings = async (courseId, settingsData) => {
  if (!courseId) {
    throw new Error('Course ID is required')
  }

  try {
    const response = await httpClient.put(`/api/admin/courses/${courseId}/settings`, settingsData)
    return response.data
  } catch (error) {
    console.error('Error updating course settings:', error)
    throw error
  }
}

// Delete course
export const deleteCourse = async (courseId) => {
  if (!courseId) {
    throw new Error('Course ID is required')
  }

  try {
    const response = await httpClient.delete(`/api/admin/courses/${courseId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting course:', error)
    throw error
  }
}

// Get course statistics
export const getCourseStats = async () => {
  try {
    const response = await httpClient.get('/api/admin/courses/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching course stats:', error)
    throw error
  }
}

// Create a new category (legacy function)
export const createCategory = async (categoryData) => {
  try {
    console.log('Creating category (legacy):', categoryData)
    const response = await httpClient.post('/api/admin/courses/categories', categoryData)
    return response.data
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

// Get course modules
export const getCourseModules = async (courseId) => {
  try {
    const response = await httpClient.get(`/api/admin/courses/modules/${courseId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching course modules:', error)
    throw error
  }
}

// Create course module
export const createCourseModule = async (moduleData) => {
  try {
    const response = await httpClient.post('/api/admin/courses/modules', moduleData)
    return response.data
  } catch (error) {
    console.error('Error creating course module:', error)
    throw error
  }
}

export const getCourseEarnings = async => {
  console.log("Tesing");
  
}

export const getCourseReviews = async => {
  console.log("Tesing");
  
}