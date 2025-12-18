# AppContext Usage Guide

## Overview
The `AppContext` provides centralized state management for the Bragboard Admin Dashboard, including authentication, theme management, and user settings.

## Basic Usage

### Importing the Hook
```tsx
import { useApp } from "@/context/AppContext";
```

### Using in Components

#### Example 1: Accessing User Information
```tsx
import { useApp } from "@/context/AppContext";

function UserProfile() {
  const { user, loading } = useApp();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {user?.email}</h2>
      <p>User ID: {user?.id}</p>
    </div>
  );
}
```

#### Example 2: Theme Toggler
```tsx
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <Button onClick={() => toggleTheme("light")}>Light</Button>
      <Button onClick={() => toggleTheme("dark")}>Dark</Button>
      <Button onClick={() => toggleTheme("system")}>System</Button>
    </div>
  );
}
```

#### Example 3: Sign Out Button
```tsx
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function SignOutButton() {
  const { signOut } = useApp();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
```

#### Example 4: User Settings Management
```tsx
import { useApp } from "@/context/AppContext";
import { Switch } from "@/components/ui/switch";

function NotificationSettings() {
  const { userSettings, updateSettings } = useApp();

  const toggleEmailNotifications = () => {
    updateSettings({
      ...userSettings,
      notifications: {
        ...userSettings.notifications,
        emailNotifications: !userSettings.notifications.emailNotifications,
      },
    });
  };

  return (
    <div>
      <label>
        Email Notifications
        <Switch
          checked={userSettings.notifications.emailNotifications}
          onCheckedChange={toggleEmailNotifications}
        />
      </label>
    </div>
  );
}
```

#### Example 5: Privacy Settings
```tsx
import { useApp } from "@/context/AppContext";
import { Select } from "@/components/ui/select";

function PrivacySettings() {
  const { userSettings, updateSettings } = useApp();

  const handleVisibilityChange = (value: "public" | "private") => {
    updateSettings({
      ...userSettings,
      privacy: {
        ...userSettings.privacy,
        profileVisibility: value,
      },
    });
  };

  return (
    <div>
      <label>Profile Visibility</label>
      <Select
        value={userSettings.privacy.profileVisibility}
        onValueChange={handleVisibilityChange}
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </Select>
    </div>
  );
}
```

## Available Context Values

### Authentication
- `user: User | null` - Current authenticated user
- `session: Session | null` - Current session
- `loading: boolean` - Loading state
- `signOut: () => Promise<void>` - Sign out function

### Theme
- `theme: "light" | "dark" | "system"` - Current theme
- `toggleTheme: (newTheme) => void` - Change theme

### User Settings
- `userSettings: UserSettings` - All user settings
- `updateSettings: (newSettings) => void` - Update settings

### UserSettings Structure
```typescript
{
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    contentAlerts: boolean;
    moderationAlerts: boolean;
    weeklyDigest: boolean;
  },
  privacy: {
    profileVisibility: "public" | "private";
    showActivity: boolean;
    allowAnalytics: boolean;
  },
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    timezone: string;
    itemsPerPage: number;
  }
}
```

## Features

### LocalStorage Persistence
- Theme preference is automatically saved and restored
- User settings are persisted across sessions
- Settings sync automatically on change

### Theme Application
- Automatically applies theme to document root
- Supports system theme preference
- Seamless theme switching

### Type Safety
- Fully typed with TypeScript
- IntelliSense support in editors
- Compile-time error checking

## Migration from use-auth

If you were using the old `use-auth` hook, simply replace:

```tsx
// Old
import { useAuth } from "@/hooks/use-auth";
const { user, loading, signOut } = useAuth();

// New
import { useApp } from "@/context/AppContext";
const { user, loading, signOut } = useApp();
```

The API is compatible, with additional features available!
