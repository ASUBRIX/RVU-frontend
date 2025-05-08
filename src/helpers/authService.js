import httpClient from './httpClient';

/**
 * Authentication service for handling login, registration, and other auth-related API calls
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.first_name - First name
   * @param {string} userData.email - Email address
   * @param {string} userData.password_hash - Password
   * @param {string} userData.phone_number - Phone number
   * @param {string} userData.last_name - Last name
   * @param {string} userData.role - User role (student, admin, instructor)
   * @returns {Promise<Object>} Registration response
   */
  register: async (userData) => {
    try {
      const response = await httpClient.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login with email and password
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Email address
   * @param {string} credentials.password_hash - Password
   * @returns {Promise<Object>} Login response with auth_key and user info
   */
  loginWithEmail: async (credentials) => {
    try {
      const response = await httpClient.post('/api/users/login/email', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Request OTP for phone login
   * @param {string} phone_number - Phone number
   * @returns {Promise<Object>} OTP request response
   */
  requestOTP: async (phone_number) => {
    try {
      const response = await httpClient.post('/api/users/login/otp/request', { phone_number });
      return response.data;
    } catch (error) {
      console.error('OTP request error:', error);
      throw error;
    }
  },

  /**
   * Verify OTP for phone login
   * @param {Object} verificationData - OTP verification data
   * @param {string} verificationData.phone_number - Phone number
   * @param {string} verificationData.otp - One-time password
   * @returns {Promise<Object>} OTP verification response with auth_key and user info
   */
  verifyOTP: async (verificationData) => {
    try {
      const response = await httpClient.post('/api/users/login/otp/verify', verificationData);
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },

  /**
   * Get folder contents including subfolders and tests
   * @param {string} folderId - Folder ID
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Folder contents response
   */
  getFolderContentsPublic: async (folderId, authKey) => {
    try {
      console.log(`Making request to: /api/tests/folders/${folderId}/contents/public`);
      console.log(`Using auth_key: ${authKey.substring(0, 10)}...`);
      
      const response = await httpClient.get(`/api/tests/folders/${folderId}/contents/public`, {
        headers: {
          'auth_key': authKey
        }
      });
      
      console.log('API Response status:', response.status);
      if (response.data) {
        console.log('API Response data structure:', {
          hasFolderProp: !!response.data.folder,
          hasBreadcrumbs: !!response.data.breadcrumbs,
          hasFolders: !!response.data.folders,
          hasTests: !!response.data.tests
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Get folder contents error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Get test for taking a test using the new endpoint
   * @param {string} testId - Test ID
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Test response for taking
   */
  getTestToTake: async (testId, authKey) => {
    try {
      console.log(`Making request to: /api/tests/test/${testId}/take`);
      console.log(`Using auth_key: ${authKey.substring(0, 10)}...`);
      
      const response = await httpClient.get(`/api/tests/test/${testId}/take`, {
        headers: {
          'auth_key': authKey
        }
      });
      
      console.log('API Response status:', response.status);
      console.log('API Response data structure:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Get test to take error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Get test questions details
   * @param {string} testId - Test ID
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Test questions details response
   */
  getTestQuestionsDetails: async (testId, authKey) => {
    try {
      const response = await httpClient.get(`/api/tests/test/${testId}/questions/details`, {
        headers: {
          'auth_key': authKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get test questions details error:', error);
      throw error;
    }
  },

  /**
   * Get free tests available to the user
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Free tests response
   */
  getFreeTests: async (authKey) => {
    try {
      const response = await httpClient.get('/api/tests/free', {
        headers: {
          'auth_key': authKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get free tests error:', error);
      throw error;
    }
  },

  /**
   * Get folder details
   * @param {string} folderId - Folder ID
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Folder details response
   */
  getFolder: async (folderId, authKey) => {
    try {
      const response = await httpClient.get(`/api/tests/folders/${folderId}`, {
        headers: {
          'auth_key': authKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get folder error:', error);
      throw error;
    }
  },

  /**
   * Get tests in a folder
   * @param {string} folderId - Folder ID
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Folder tests response
   */
  getFolderTests: async (folderId, authKey) => {
    try {
      const response = await httpClient.get(`/api/tests/folders/${folderId}/tests`, {
        headers: {
          'auth_key': authKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get folder tests error:', error);
      throw error;
    }
  },

  /**
   * Get test details for taking a test
   * @param {string} testId - Test ID
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Test details response
   */
  getTest: async (testId, authKey) => {
    try {
      const response = await httpClient.get(`/api/tests/tests/${testId}/take`, {
        headers: {
          'auth_key': authKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get test error:', error);
      throw error;
    }
  },

  /**
   * Submit test answers
   * @param {string} testId - Test ID
   * @param {Object} data - Submission data with answers array
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Test submission response
   */
  submitTest: async (testId, data, authKey) => {
    try {
      // Make sure we're sending the exact format required by the API
      const submissionData = {
        answers: Array.isArray(data.answers) ? data.answers : [],
        time_taken_seconds: data.time_taken_seconds || 0
      };
      
      console.log(`Submitting test ${testId} with data:`, submissionData);
      
      const response = await httpClient.post(`/api/tests/test/${testId}/submit`, 
        submissionData,
        {
          headers: {
            'auth_key': authKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Test submission response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Submit test error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Create a new folder
   * @param {Object} folderData - Folder data
   * @param {string} folderData.name - Folder name
   * @param {number|null} folderData.parent_id - Parent folder ID (null for root)
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} New folder response
   */
  createFolder: async (folderData, authKey) => {
    try {
      console.log(`Creating folder with data:`, folderData);
      
      const response = await httpClient.post('/api/tests/folders/create', 
        folderData,
        {
          headers: {
            'auth_key': authKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Create folder response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Create folder error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Delete a folder
   * @param {string} folderId - Folder ID
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Delete response
   */
  deleteFolder: async (folderId, authKey) => {
    try {
      console.log(`Deleting folder ${folderId}`);
      
      const response = await httpClient.delete(`/api/tests/folders/${folderId}`, {
        headers: {
          'auth_key': authKey
        }
      });
      
      console.log('Delete folder response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Delete folder error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Delete a test
   * @param {string} testId - Test ID
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Delete response
   */
  deleteTest: async (testId, authKey) => {
    try {
      console.log(`Deleting test ${testId}`);
      
      const response = await httpClient.delete(`/api/tests/test/${testId}`, {
        headers: {
          'auth_key': authKey
        }
      });
      
      console.log('Delete test response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Delete test error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Get all folders available to the user with pagination
   * @param {string} authKey - Authentication key
   * @param {number} page - Page number (defaults to 1)
   * @returns {Promise<Object>} All folders response with pagination data
   */
  getAllFolders: async (authKey, page = 1) => {
    try {
      const response = await httpClient.get(`/api/tests/free/all?page=${page}`, {
        headers: {
          'auth_key': authKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get all folders error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Create a new test with basic information
   * @param {Object} testData - Basic test information
   * @param {number|null} testData.folder_id - Folder ID where test will be created
   * @param {string} testData.title - Test title
   * @param {string} testData.description - Test description
   * @param {string} testData.category - Test category
   * @param {number} testData.passing_score - Passing score percentage
   * @param {number} testData.duration_hours - Test duration hours
   * @param {number} testData.duration_minutes - Test duration minutes
   * @param {string} testData.instructions - Test instructions
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Created test response
   */
  createTest: async (testData, authKey) => {
    try {
      console.log('Creating test with data:', testData);
      
      const response = await httpClient.post('/api/tests/test/create', 
        testData,
        {
          headers: {
            'auth_key': authKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Create test response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Create test error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Add a question to a test
   * @param {string} testId - Test ID
   * @param {Object} questionData - Question data
   * @param {string} questionData.question_english - Question text in English
   * @param {string} questionData.question_tamil - Question text in Tamil
   * @param {Array} questionData.options - Array of option objects
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Question creation response
   */
  addQuestion: async (testId, questionData, authKey) => {
    try {
      console.log(`Adding question to test ${testId}:`, questionData);
      
      const response = await httpClient.post(`/api/tests/test/${testId}/questions`, 
        questionData,
        {
          headers: {
            'auth_key': authKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Add question response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Add question error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Update test settings
   * @param {string} testId - Test ID
   * @param {Object} settings - Test settings
   * @param {boolean} settings.shuffle_questions - Whether to shuffle questions
   * @param {boolean} settings.show_results_immediately - Whether to show results immediately
   * @param {boolean} settings.allow_answer_review - Whether to allow answer review
   * @param {boolean} settings.enable_time_limit - Whether to enable time limit
   * @param {string} settings.status - Test status (draft/published)
   * @param {boolean} settings.is_free - Whether test is free
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Settings update response
   */
  updateTestSettings: async (testId, settings, authKey) => {
    try {
      console.log(`Updating settings for test ${testId}:`, settings);
      
      const response = await httpClient.put(`/api/tests/test/${testId}/settings`, 
        settings,
        {
          headers: {
            'auth_key': authKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Update settings response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Update settings error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Search for tests with query and sort options
   * @param {string} query - Search query string
   * @param {string} sort - Sort parameter (e.g., 'name', 'date')
   * @param {string} authKey - Authentication key
   * @returns {Promise<Object>} Search results
   */
  searchTests: async (query, sort, authKey) => {
    try {
      const queryParams = [];
      
      if (query) {
        queryParams.push(`query=${encodeURIComponent(query)}`);
      }
      
      if (sort) {
        queryParams.push(`sort=${encodeURIComponent(sort)}`);
        console.log(`Adding sort parameter: ${sort}`);
      }
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      console.log(`Searching tests with query string: ${queryString}`);
      
      const response = await httpClient.get(`/api/tests/search${queryString}`, {
        headers: {
          'auth_key': authKey
        }
      });
      
      console.log('Search results:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Search tests error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - Network issue');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  }
};

export default authService; 