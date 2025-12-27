import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout.jsx';

const Settings = () => {
  const { user, toggleTheme, userSettings, updateSettings } = useAuth();

  // ... (state hooks) ...
  const [settings, setSettings] = useState(userSettings || {});
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local settings when context settings change
  useEffect(() => {
    if (userSettings) {
      setSettings(userSettings);
    }
  }, [userSettings]);

  // Check if settings have changed
  useEffect(() => {
    const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(userSettings);
    setHasChanges(hasUnsavedChanges);
  }, [settings, userSettings]);

  // ... (handlers skipped for brevity, keeping existing logic) ...
  const handleNotificationChange = (key) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...(settings.notifications || {}),
        [key]: !settings.notifications?.[key]
      }
    };
    setSettings(newSettings);
    setIsSaved(false);
  };

  const toggleAllNotifications = () => {
    const allOn = !Object.values(settings.notifications).every(Boolean);
    const newSettings = {
      ...settings,
      notifications: Object.keys(settings.notifications || {}).reduce((acc, key) => {
        acc[key] = allOn;
        return acc;
      }, {})
    };
    setSettings(newSettings);
    setIsSaved(false);
  };

  const handlePrivacyChange = (key, value) => {
    const newSettings = {
      ...settings,
      privacy: {
        ...(settings.privacy || {}),
        [key]: value
      }
    };
    setSettings(newSettings);
    setIsSaved(false);
  };

  const handlePreferenceChange = (key, value) => {
    const newSettings = {
      ...settings,
      preferences: {
        ...(settings.preferences || {}),
        [key]: value
      }
    };

    setSettings(newSettings);
    setIsSaved(false);

    if (key === 'theme') {
      if (typeof toggleTheme === 'function') {
        toggleTheme(value);
      }
      updateSettings(newSettings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleProfileChange = (field, value) => {
    const newSettings = {
      ...settings,
      profile: {
        ...(settings.profile || {}),
        [field]: value
      }
    };
    setSettings(newSettings);
    setIsSaved(false);
  };

  const handleSaveSettings = () => {
    updateSettings(settings);
    setIsSaved(true);
    setHasChanges(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="w-full px-8 pb-20">
        {/* Header Section */}
        <div className="py-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4 transition-colors duration-200">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>

          {/* Alert Messages */}
          <div className="space-y-4 mt-4">
            {isSaved && (
              <div className="flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md shadow-sm">
                <span className="mr-2">✅</span>
                <span className="font-medium">Settings saved successfully!</span>
              </div>
            )}

            {hasChanges && !isSaved && (
              <div className="flex items-center bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md shadow-sm">
                <span className="mr-2">⚠️</span>
                <span className="font-medium">You have unsaved changes.</span>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 overflow-x-auto px-1">
          {[
            { id: 'profile', label: '👤 Profile' },
            { id: 'notifications', label: '🔔 Notifications' },
            { id: 'privacy', label: '🔒 Privacy' },
            { id: 'preferences', label: '⚙️ Preferences' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20 dark:text-blue-400 rounded-t-lg'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-t-lg'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-200 p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Public Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-6">
                      <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                          Change Avatar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                    <input
                      type="email"
                      defaultValue={settings.profile?.email || "jane.doe@company.com"}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Department</label>
                    <select
                      defaultValue={user?.department}
                      onChange={(e) => handleProfileChange('department', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Software Engineering</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>Design</option>
                      <option>Human Resources</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Title</label>
                    <input
                      type="text"
                      defaultValue={settings.profile?.jobTitle || "Senior Software Engineer"}
                      onChange={(e) => handleProfileChange('jobTitle', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bio</label>
                    <textarea
                      rows="4"
                      defaultValue={settings.profile?.bio || "Passionate about building great software!"}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                <button
                  onClick={toggleAllNotifications}
                  className="text-sm text-blue-600 hover:text-blue-800 border px-3 py-1 rounded hover:bg-blue-50"
                >
                  {Object.values(settings.notifications || {}).every(Boolean) ? 'Turn all off' : 'Turn all on'}
                </button>
              </div>

              <div className="space-y-6">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', icon: '📧' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser', icon: '🔔' },
                  { key: 'shoutoutMentions', label: 'Shoutout Mentions', desc: 'Get notified when mentioned in shoutouts', icon: '👤' },
                  { key: 'reactionAlerts', label: 'Reaction Alerts', desc: 'Get notified when someone reacts to your posts', icon: '❤️' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive weekly summary of activities', icon: '📊' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 text-xl dark:text-gray-300">{item.icon}</div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(item.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${settings.notifications?.[item.key] ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${settings.notifications?.[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Privacy & Security</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={settings.privacy?.profileVisibility || 'public'}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="public">Public (Everyone at Company)</option>
                      <option value="team">My Team Only</option>
                      <option value="private">Private (Only Me)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Show Received Reactions</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Display emojis on your profile stats</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('showReactions', !settings.privacy?.showReactions)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy?.showReactions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${settings.privacy?.showReactions ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Allow Mentions</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Let others tag you in their shoutouts</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('allowTagging', !settings.privacy?.allowTagging)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy?.allowTagging ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${settings.privacy?.allowTagging ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">App Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interface Theme</label>
                    <select
                      value={settings.preferences?.theme || 'light'}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Language</label>
                    <select
                      value={settings.preferences?.language || 'english'}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="english">English (US)</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Save Area */}
        <div className="mt-12 flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            <button
              disabled={!hasChanges}
              onClick={() => setSettings(userSettings || {})}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={!hasChanges}
              className={`px-6 py-2 rounded-md font-medium text-white transition-all ${hasChanges
                ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                : 'bg-gray-300 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;