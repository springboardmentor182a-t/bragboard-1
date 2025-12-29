import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [error, setError] = useState(null);

  // API Base URL - should be in .env in production
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

  // Load user from localStorage on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // If you have a token verification endpoint
          // const response = await fetch(`${API_BASE}/auth/verify-token`, {
          //   headers: { 'Authorization': `Bearer ${token}` }
          // });
          // if (response.ok) {
          //   const userData = await response.json();
          //   setUser(userData);
          // } else {
          //   localStorage.removeItem('token');
          // }

          // For now, just get user from localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [API_BASE]);

  // Apply theme when component mounts or theme changes
  // Apply theme when component mounts or theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Optional: Keep data-theme for other libraries if needed
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const login = async (email, password) => {
    setError(null);
    try {
      // Mock login - replace with actual API call
      // const response = await fetch(`${API_BASE}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Login failed');
      // }

      // const { user: userData, token } = await response.json();

      // Mock response - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock user data
      const isAdmin = email === 'admin@bragboard.com';
      const mockUser = {
        id: isAdmin ? 1 : 2,
        email,
        name: isAdmin ? 'Admin User' : 'Employee User',
        role: isAdmin ? 'admin' : 'employee',
        department: isAdmin ? 'Administration' : 'Engineering',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`
      };

      const token = `mock-jwt-token-${isAdmin ? 'admin' : 'user'}`;

      // Store user data and token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);

      // Return the user data including role for redirection
      return mockUser;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // We'll handle the navigation in the component that calls logout
    return Promise.resolve();
  };

  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const toggleTheme = useCallback((newTheme) => {
    setTheme(newTheme);
  }, []);

  // Default settings
  const defaultSettings = {
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      shoutoutMentions: true,
      reactionAlerts: true,
      weeklyDigest: true
    },
    privacy: {
      profileVisibility: 'public',
      showReactions: true,
      allowTagging: true
    },
    preferences: {
      theme: 'light',
      language: 'english',
      timezone: 'UTC-5'
    }
  };

  const [userSettings, setUserSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge with defaults to ensure all keys exist
        return {
          ...defaultSettings,
          ...parsed,
          notifications: { ...defaultSettings.notifications, ...(parsed.notifications || {}) },
          privacy: { ...defaultSettings.privacy, ...(parsed.privacy || {}) },
          preferences: { ...defaultSettings.preferences, ...(parsed.preferences || {}) },
          profile: { ...parsed.profile } // Profile can be whatever is saved
        };
      }
      return defaultSettings;
    } catch (e) {
      console.warn('Failed to parse user settings from local storage', e);
      return defaultSettings;
    }
  });

  const updateSettings = useCallback((newSettings) => {
    setUserSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    theme,
    toggleTheme,
    userSettings,
    updateSettings,
    API_BASE // Export API_BASE for use in other components
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};