import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;


function HttpClient() {
  const instance = axios.create({
    baseURL:baseURL,
    timeout: 15000,
  });

instance.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
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
        url: response.config.url,
      });
      return response;
    },
    (error) => {
      console.error('HttpClient Response Error:', error.message);
      if (error.response) {
        console.error('Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error('No Response Received:', {
          url: error.config?.url,
          method: error.config?.method,
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
    delete: instance.delete,
  };
}

const httpClient = HttpClient();
export default httpClient;


