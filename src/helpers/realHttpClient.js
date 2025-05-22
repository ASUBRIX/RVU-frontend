import axios from 'axios';


const realAxios = axios.create({
  baseURL: 'http://localhost:3000', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for debugging
realAxios.interceptors.request.use(
  (config) => {
    console.log('🚀 Outgoing request:', {
      method: config.method.toUpperCase(),
      url: config.baseURL + config.url,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
realAxios.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.message);
    if (error.response) {
      console.error('Response details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

// Export the HTTP methods we need
const httpClient = {
  get: realAxios.get,
  post: realAxios.post,
  put: realAxios.put,
  patch: realAxios.patch,
  delete: realAxios.delete
};

// Simple test to ensure the client is configured
console.log('⚙️ Real HTTP client initialized with baseURL:', realAxios.defaults.baseURL);

export default httpClient; 