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
  const [user, setUser] = useState({
    name: "Jane Doe",
    department: "Software Engineering",
    role: "employee"
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [userSettings, setUserSettings] = useState(() => {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      notifications: {
        allNotifications: true,
        doNotDisturb: false,
        autoDND: false,
        focusMode: false,
        shippingTool: true,
        outlook: true,
        slack: true,
        emailNotifications: true,
        pushNotifications: true,
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
      },
      profile: {
        name: "Jane Doe",
        email: "jane.doe@company.com",
        department: "Software Engineering",
        jobTitle: "Senior Software Engineer",
        bio: "Passionate about building great software and helping teammates succeed!"
      }
    };
  });

  // Persist user
  useEffect(() => {
    localStorage.setItem('authUser', JSON.stringify(user));
  }, [user]);

  // Persist theme and apply to document
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
  }, [userSettings]);

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
    updateSettings
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
