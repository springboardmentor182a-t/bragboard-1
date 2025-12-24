import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Define types for our context
interface UserSettings {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    contentAlerts: boolean;
    moderationAlerts: boolean;
    weeklyDigest: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private";
    showActivity: boolean;
    allowAnalytics: boolean;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    timezone: string;
    itemsPerPage: number;
  };
}

interface AppContextType {
  // Authentication
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  
  // Theme
  theme: "light" | "dark" | "system";
  toggleTheme: (newTheme: "light" | "dark" | "system") => void;
  
  // User Settings
  userSettings: UserSettings;
  updateSettings: (newSettings: UserSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the AppContext
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// AppProvider component
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as "light" | "dark" | "system") || "system";
  });

  // User settings state
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem("userSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          notifications: {
            emailNotifications: true,
            pushNotifications: false,
            contentAlerts: true,
            moderationAlerts: true,
            weeklyDigest: false,
          },
          privacy: {
            profileVisibility: "public",
            showActivity: true,
            allowAnalytics: true,
          },
          preferences: {
            theme: theme,
            language: "english",
            timezone: "UTC",
            itemsPerPage: 10,
          },
        };
  });

  // Initialize authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Apply theme when component mounts or theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    // Apply theme to document
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      document.documentElement.classList.toggle("dark", systemTheme === "dark");
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  }, [userSettings]);

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // Toggle theme function
  const toggleTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    // Update theme in settings as well
    setUserSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: newTheme,
      },
    }));
  };

  // Function to update settings
  const updateSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
  };

  const value: AppContextType = {
    user,
    session,
    loading,
    signOut,
    theme,
    toggleTheme,
    userSettings,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
