import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import authService from '../services/authService';

// Enhanced Settings component with comprehensive user management
const Settings = ({ 
  isOpen, 
  onClose, 
  customMoodCategories = [], 
  onAddCustomMood, 
  onRemoveCustomMood,
  user,
  onLogout,
  onUpdateUser
}) => {
  const [newMoodCategory, setNewMoodCategory] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  // User profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: user?.language || 'en'
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    notifications: {
      dailyReminders: user?.preferences?.notifications?.dailyReminders ?? true,
      weeklyInsights: user?.preferences?.notifications?.weeklyInsights ?? true,
      moodStreakAlerts: user?.preferences?.notifications?.moodStreakAlerts ?? true,
      achievementAlerts: user?.preferences?.notifications?.achievementAlerts ?? true
    },
    privacy: {
      shareData: user?.preferences?.privacy?.shareData ?? false,
      publicProfile: user?.preferences?.privacy?.publicProfile ?? false,
      allowResearch: user?.preferences?.privacy?.allowResearch ?? false
    },
    appearance: {
      theme: user?.preferences?.appearance?.theme || 'dark',
      compactMode: user?.preferences?.appearance?.compactMode ?? false,
      showAnimations: user?.preferences?.appearance?.showAnimations ?? true
    },
    wellness: {
      focusSessionDuration: user?.preferences?.wellness?.focusSessionDuration ?? 25,
      defaultMoodCheckTime: user?.preferences?.wellness?.defaultMoodCheckTime ?? '18:00',
      enableInterventionAlerts: user?.preferences?.wellness?.enableInterventionAlerts ?? true
    }
  });

  // Security state
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: user.language || 'en'
      });
      
      setPreferences({
        notifications: {
          dailyReminders: user.preferences?.notifications?.dailyReminders ?? true,
          weeklyInsights: user.preferences?.notifications?.weeklyInsights ?? true,
          moodStreakAlerts: user.preferences?.notifications?.moodStreakAlerts ?? true,
          achievementAlerts: user.preferences?.notifications?.achievementAlerts ?? true
        },
        privacy: {
          shareData: user.preferences?.privacy?.shareData ?? false,
          publicProfile: user.preferences?.privacy?.publicProfile ?? false,
          allowResearch: user.preferences?.privacy?.allowResearch ?? false
        },
        appearance: {
          theme: user.preferences?.appearance?.theme || 'dark',
          compactMode: user.preferences?.appearance?.compactMode ?? false,
          showAnimations: user.preferences?.appearance?.showAnimations ?? true
        },
        wellness: {
          focusSessionDuration: user.preferences?.wellness?.focusSessionDuration ?? 25,
          defaultMoodCheckTime: user.preferences?.wellness?.defaultMoodCheckTime ?? '18:00',
          enableInterventionAlerts: user.preferences?.wellness?.enableInterventionAlerts ?? true
        }
      });
    }
  }, [user]);

  const handleAddMoodCategory = (e) => {
    e.preventDefault();
    if (newMoodCategory && !customMoodCategories.includes(newMoodCategory)) {
      onAddCustomMood(newMoodCategory);
      setNewMoodCategory('');
      toast.success('Custom mood added!');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const updatedUser = await authService.updateProfile({
        ...profileData,
        preferences
      });
      
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (securityData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.changePassword(securityData.currentPassword, securityData.newPassword);
      toast.success('Password changed successfully!');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (deletePassword !== securityData.currentPassword) {
      toast.error('Password confirmation is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.deleteAccount(deletePassword);
      toast.success('Account deleted successfully');
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
      setDeletePassword('');
    }
  };

  const handlePreferenceChange = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  // Determine if this is being used as a modal
  const isModal = isOpen !== undefined;

  // If it's a modal and not open, don't render anything
  if (isModal && !isOpen) return null;

  // Common content for both modal and page views
  const SettingsContent = () => (
    <>
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-700 overflow-x-auto">
        {[
          { id: 'profile', label: 'Profile', icon: '👤' },
          { id: 'preferences', label: 'Preferences', icon: '⚙️' },
          { id: 'security', label: 'Security', icon: '🔒' },
          { id: 'moods', label: 'Custom Moods', icon: '😊' },
          { id: 'data', label: 'Data & Privacy', icon: '📊' }
        ].map(tab => (
        <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 pb-3 px-4 whitespace-nowrap transition-colors ${
              activeTab === tab.id 
            ? 'border-b-2 border-emerald-500 text-emerald-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
        >
            <span>{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
        </button>
        ))}
      </div>
      
      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="bg-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Your display name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={profileData.timezone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={profileData.language}
                  onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
      
      {/* Preferences Settings */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
            <div className="space-y-4">
              {Object.entries(preferences.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      {key === 'dailyReminders' && 'Daily Mood Reminders'}
                      {key === 'weeklyInsights' && 'Weekly Wellness Insights'}
                      {key === 'moodStreakAlerts' && 'Streak Alerts'}
                      {key === 'achievementAlerts' && 'Achievement Notifications'}
                    </label>
                    <p className="text-xs text-gray-400">
                      {key === 'dailyReminders' && 'Get reminded to log your mood daily'}
                      {key === 'weeklyInsights' && 'Receive weekly wellness reports'}
                      {key === 'moodStreakAlerts' && 'Celebrate your mood tracking streaks'}
                      {key === 'achievementAlerts' && 'Get notified of new achievements'}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('notifications', key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-emerald-600' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                <select
                  value={preferences.appearance.theme}
                  onChange={(e) => handlePreferenceChange('appearance', 'theme', e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Compact Mode</label>
                  <p className="text-xs text-gray-400">Use more compact layout</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('appearance', 'compactMode', !preferences.appearance.compactMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.appearance.compactMode ? 'bg-emerald-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.appearance.compactMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Show Animations</label>
                  <p className="text-xs text-gray-400">Enable smooth animations</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('appearance', 'showAnimations', !preferences.appearance.showAnimations)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.appearance.showAnimations ? 'bg-emerald-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.appearance.showAnimations ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Wellness Settings */}
          <div className="bg-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Wellness Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Focus Session Duration (minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={preferences.wellness.focusSessionDuration}
                  onChange={(e) => handlePreferenceChange('wellness', 'focusSessionDuration', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Mood Check Time</label>
                <input
                  type="time"
                  value={preferences.wellness.defaultMoodCheckTime}
                  onChange={(e) => handlePreferenceChange('wellness', 'defaultMoodCheckTime', e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Intervention Alerts</label>
                  <p className="text-xs text-gray-400">Get alerts when you need support</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('wellness', 'enableInterventionAlerts', !preferences.wellness.enableInterventionAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.wellness.enableInterventionAlerts ? 'bg-emerald-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.wellness.enableInterventionAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
              </label>
              <input
                  type="password"
                  id="confirmPassword"
                  value={securityData.confirmPassword}
                  onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
            <p className="text-sm text-gray-300 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Delete Account
                </button>
              </div>
            </div>
      )}
      
      {/* Custom Moods Settings */}
      {activeTab === 'moods' && (
        <div className="space-y-6">
          <div className="bg-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Custom Mood Categories</h3>
            
            <form onSubmit={handleAddMoodCategory} className="mb-6">
              <div className="flex gap-3">
              <input
                type="text"
                value={newMoodCategory}
                onChange={(e) => setNewMoodCategory(e.target.value)}
                  placeholder="E.g., Excited, Nostalgic, Grateful..."
                  className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="submit"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Add
              </button>
            </div>
          </form>
          
            <div className="max-h-60 overflow-y-auto">
            {customMoodCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customMoodCategories.map((category) => (
                    <div key={category} className="flex items-center justify-between bg-gray-600 px-4 py-3 rounded-lg">
                      <span className="text-sm text-white font-medium">{category}</span>
                    <button
                      onClick={() => onRemoveCustomMood(category)}
                        className="text-gray-400 hover:text-red-400 focus:outline-none focus:text-red-400"
                      aria-label={`Remove ${category}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">😊</div>
                  <p className="text-gray-400">No custom moods added yet.</p>
                  <p className="text-sm text-gray-500 mt-1">Add your own mood categories to personalize your experience.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Data & Privacy Settings */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="bg-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              {Object.entries(preferences.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      {key === 'shareData' && 'Share Anonymous Data'}
                      {key === 'publicProfile' && 'Public Profile'}
                      {key === 'allowResearch' && 'Allow Research Participation'}
                    </label>
                    <p className="text-xs text-gray-400">
                      {key === 'shareData' && 'Help improve the app with anonymous usage data'}
                      {key === 'publicProfile' && 'Allow others to see your public profile'}
                      {key === 'allowResearch' && 'Participate in wellness research studies'}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('privacy', key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-emerald-600' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Data Export</h3>
            <p className="text-sm text-gray-300 mb-4">
              Download all your data including mood entries, achievements, and preferences.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
              Export My Data
            </button>
          </div>
        </div>
      )}
      
      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-400 mb-4">Delete Account</h3>
            <p className="text-sm text-gray-300 mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAccountDeletion}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // For modal view
  if (isModal) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden bg-gray-800 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              Settings
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-200"
              aria-label="Close settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <SettingsContent />
          </div>
        </div>
      </div>
    );
  }

  // For page view
  return (
    <div className="rounded-xl shadow-md p-6 bg-gray-800 border border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-white">
        Settings
      </h2>
      
      <SettingsContent />
    </div>
  );
};

export default Settings;