import axios from 'axios';

function HttpClient() {
  // Create an axios instance with proper configuration
  const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 15000
    // Remove default Content-Type header
  });
  
  // Add a request interceptor to set Content-Type only for non-FormData requests
  instance.interceptors.request.use(
    (config) => {
      // If the request data is FormData, don't set Content-Type (browser will set it)
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
      
      console.log('HttpClient Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        isFormData: config.data instanceof FormData
      });
      
      return config;
    },
    (error) => {
      console.error('HttpClient Request Error:', error);
      return Promise.reject(error);
    }
  );
  
  instance.interceptors.response.use(
    (response) => {
      console.log('HttpClient Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url
      });
      return response;
    },
    (error) => {
      console.error('HttpClient Response Error:', error.message);
      if (error.response) {
        console.error('Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error.request) {
        console.error('No Response Received:', {
          url: error.config?.url,
          method: error.config?.method
        });
      }
      return Promise.reject(error);
    }
  );
  
  return {
    get: instance.get,
    post: instance.post,
    patch: instance.patch,
    put: instance.put,
    delete: instance.delete
  };
}

const httpClient = HttpClient();
export default httpClient;