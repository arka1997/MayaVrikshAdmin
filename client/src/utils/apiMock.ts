import axios from 'axios';
import { logger } from './logger';

// Setup axios interceptors for retry mechanism
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status >= 500 && !originalRequest._retry) {
      originalRequest._retry = true;
      logger.warn('Retrying failed request', { url: originalRequest.url });
      
      // Wait 1 second before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return axios(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Setup request interceptor for JWT (when authentication is added)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axios };
