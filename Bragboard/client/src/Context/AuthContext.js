import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const defaultUser = {
  name: 'Test & Reports',
  department: 'Analytics Dashboard',
  role: 'employee',
};

const defaultSettings = (theme) => ({
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    shoutoutMentions: true,
    reactionAlerts: true,
    weeklyDigest: false,
  },
  privacy: {
    profileVisibility: 'public',
    showReactions: true,
    allowTagging: true,
  },
  preferences: {
    theme,
    language: 'english',
    timezone: 'UTC-5',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('authUser');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [userSettings, setUserSettings] = useState(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? JSON.parse(saved) : defaultSettings(theme);
  });

  // Persist user
  useEffect(() => {
    localStorage.setItem('authUser', JSON.stringify(user));
  }, [user]);

  // Persist theme and apply to document
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // safer: toggle class instead of overwriting className if you have other classes
    document.documentElement.dataset.theme = theme; // alternative approach
  }, [theme]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
  }, [userSettings]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    setUserSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: newTheme,
      },
    }));
  };

  const updateSettings = (patch) => {
    // patch can be a partial settings object — merge safely
    setUserSettings((prev) => ({ ...prev, ...patch }));
  };

  const value = {
    user,
    setUser,
    theme,
    toggleTheme,
    userSettings,
    setUserSettings: updateSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
