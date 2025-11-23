
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Jane Doe",
    department: "Software Engineering",
    role: "employee"
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Load settings from localStorage
  const [userSettings, setUserSettings] = useState(() => {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        shoutoutMentions: true,
        reactionAlerts: true,
        weeklyDigest: false
      },
      privacy: {
        profileVisibility: 'public',
        showReactions: true,
        allowTagging: true
      },
      preferences: {
        theme: theme,
        language: 'english',
        timezone: 'UTC-5'
      }
    };
  });

  // Apply theme when component mounts or theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
  }, [userSettings]);

  // Define toggleTheme function
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    // Update theme in settings as well
    setUserSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: newTheme
      }
    }));
  };

  // Function to update settings
  const updateSettings = (newSettings) => {
    setUserSettings(newSettings);
  };

  const value = {
    user,
    setUser,
    theme,
    toggleTheme,
    userSettings,
    updateSettings
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};