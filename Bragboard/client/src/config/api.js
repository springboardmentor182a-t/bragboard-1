// API Configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    ROLES: '/users/roles',
  },
  SHOUTOUTS: {
    BASE: '/shoutouts',
    BY_ID: (id) => `/shoutouts/${id}`,
    LIKE: (id) => `/shoutouts/${id}/like`,
    COMMENTS: (id) => `/shoutouts/${id}/comments`,
  },
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id) => `/departments/${id}`,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
      default:
        return ERROR_MESSAGES.SERVER_ERROR;
    }
  } else if (error.request) {
    // The request was made but no response was received
    return ERROR_MESSAGES.NETWORK_ERROR;
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || ERROR_MESSAGES.SERVER_ERROR;
  }
};
