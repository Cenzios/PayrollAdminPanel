import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://payrolladminbackend.cenzios.com/api';

console.log('🔌 API BASE URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = `${config.baseURL ?? ''}${config.url ?? ''}`;
    console.log('➡️ API REQUEST:', config.method?.toUpperCase(), fullUrl);

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
