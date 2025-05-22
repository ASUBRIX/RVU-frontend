import axios from 'axios';


function HttpClient() {
  const instance = axios.create({
    // baseURL:'https://server.pudhuyugamacademy.com',
    baseURL:"http://localhost:5000",
    timeout: 15000,
  });

  instance.interceptors.request.use(
    (config) => {
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }

      console.log('HttpClient Requests:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        isFormData: config.data instanceof FormData,
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


