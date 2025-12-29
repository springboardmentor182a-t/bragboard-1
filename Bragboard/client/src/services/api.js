import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
};

export const shoutouts = {
  getAll: () => api.get('/shoutouts'),
  create: (data) => api.post('/shoutouts', data),
  like: (id) => api.post(`/shoutouts/${id}/like`),
  delete: (id) => api.delete(`/shoutouts/${id}`),
};

export const users = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
};

export const analytics = {
  getOverview: () => api.get('/analytics/overview'),
  getTopContributors: (limit = 5) => api.get(`/analytics/top-contributors?limit=${limit}`),
  getDepartmentStats: () => api.get('/analytics/department-stats'),
  getEngagementTrend: (days = 30) => api.get(`/analytics/engagement-trend?days=${days}`),
};

export default api;
