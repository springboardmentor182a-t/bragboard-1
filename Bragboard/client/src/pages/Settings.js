import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

const Settings = () => {
  const { user } = useAuth(); // Removed setUser since it's not used
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      shoutoutMentions: true,
      reactionAlerts: true,
      weeklyDigest: false
    },
    privacy: {
      profileVisibility: 'public', // public, team, private
      showReactions: true,
      allowTagging: true
    },
    preferences: {
      theme: 'light', // light, dark, system
      language: 'english',
      timezone: 'UTC-5'
    }
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleNotificationChange = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const handlePrivacyChange = (key, value) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    });
  };

  const handlePreferenceChange = (key, value) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    });
  };

  const handleSaveSettings = () => {
    // In a real app, you would save these to your backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Settings Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['profile', 'notifications', 'privacy', 'preferences'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Profile Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="jane.doe@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    defaultValue={user.department}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Software Engineering</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Design</option>
                    <option>Human Resources</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    defaultValue="Senior Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell your colleagues about yourself..."
                  defaultValue="Passionate about building great software and helping teammates succeed!"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {key === 'emailNotifications' && 'Receive notifications via email'}
                        {key === 'pushNotifications' && 'Receive push notifications in browser'}
                        {key === 'shoutoutMentions' && 'Get notified when mentioned in shoutouts'}
                        {key === 'reactionAlerts' && 'Get notified when someone reacts to your posts'}
                        {key === 'weeklyDigest' && 'Receive weekly summary of activities'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        value ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          value ? 'translate-x-6' : 'translate-x-1'
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
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Privacy Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public (Everyone in company)</option>
                    <option value="team">Team Members Only</option>
                    <option value="private">Private (Only me)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Show Reactions on Profile</p>
                    <p className="text-sm text-gray-600">Display reactions you receive on your profile</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyChange('showReactions', !settings.privacy.showReactions)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.privacy.showReactions ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.privacy.showReactions ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Allow Tagging</p>
                    <p className="text-sm text-gray-600">Allow others to tag you in shoutouts</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyChange('allowTagging', !settings.privacy.allowTagging)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.privacy.allowTagging ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.privacy.allowTagging ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preference Settings */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">App Preferences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.preferences.timezone}
                    onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC-5">EST (UTC-5)</option>
                    <option value="UTC-8">PST (UTC-8)</option>
                    <option value="UTC+0">GMT (UTC+0)</option>
                    <option value="UTC+1">CET (UTC+1)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveSettings}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;