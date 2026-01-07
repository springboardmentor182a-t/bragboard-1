import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add CORS headers
api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
api.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token ? 'Token exists' : 'No token found');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set for:', config.url);
    } else {
      console.warn('No authentication token found for request to:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    const { config, response } = error;
    const errorDetails = {
      url: config?.url,
      method: config?.method,
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data
    };

    console.error('API Error:', errorDetails);

    if (response?.status === 401) {
      console.warn('Authentication required - redirecting to login');
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
  getAll: async (view = 'all') => {
    try {
      const response = await api.get(`/shoutouts?view=${view}`);
      console.log('Shoutouts API Response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching shoutouts:', error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/shoutouts', data);
      return response;
    } catch (error) {
      console.error('Error creating shoutout:', error);
      throw error;
    }
  },
  toggleReaction: (id, type) => api.post(`/shoutouts/${id}/react?reaction_type=${type}`),
  delete: (id) => api.delete(`/shoutouts/${id}`),
  addComment: (id, data) => api.post(`/shoutouts/${id}/comments`, data),
  updateComment: (shoutoutId, commentId, data) => api.put(`/shoutouts/comments/${commentId}`, data),
  deleteComment: (shoutoutId, commentId) => api.delete(`/shoutouts/comments/${commentId}`),
};

// Export all services
export const users = {
  getAll: (skip = 0, limit = 100) => api.get(`/users?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const settings = {
  changePassword: (data) => api.put('/settings/password', data),
  updateProfile: (data) => api.put('/settings/profile', data),
};

export { reports } from './reports';
export { exportData } from './export';

export const analytics = {
  getOverview: () => api.get('/analytics/overview'),
  getTopContributors: (limit = 5) => api.get(`/analytics/top-contributors?limit=${limit}`),
  getMostTagged: (limit = 5) => api.get(`/analytics/most-tagged?limit=${limit}`),
  getDepartmentStats: () => api.get('/analytics/department-stats'),
  getEngagementTrend: (days = 30) => api.get(`/analytics/engagement-trend?days=${days}`),
};

export default api;
