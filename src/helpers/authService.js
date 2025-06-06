import httpClient from './httpClient';


const authService = {

  register: async (userData) => {
    
    try {
      const response = await httpClient.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },


  adminLogin: async (credentials) => {
    try {
      const response = await httpClient.post('/api/admin/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },


  requestOTP: async (phone_number) => {
    try {
      const response = await httpClient.post('/api/users/login/otp/request', { phone_number });
      return response.data;
    } catch (error) {
      console.error('OTP request error:', error);
      throw error;
    }
  },

 
  verifyOTP: async (verificationData) => {
    try {
      const response = await httpClient.post('/api/users/login/otp/verify', verificationData);
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },


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



  submitTest: async (testId, data, authKey) => {
    try {
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