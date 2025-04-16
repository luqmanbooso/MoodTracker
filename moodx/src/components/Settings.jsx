import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = ({ customMoodCategories, onAddCustomMood, onRemoveCustomMood }) => {
  const { theme, setTheme, themeColors, setThemeColor } = useTheme();
  const [newMoodCategory, setNewMoodCategory] = useState('');
  const [activeTab, setActiveTab] = useState('appearance');
  
  const tabs = [
    { id: 'appearance', label: 'Appearance & Theme' },
    { id: 'customization', label: 'Custom Moods' },
    { id: 'preferences', label: 'App Preferences' },
    { id: 'account', label: 'Account' }
  ];

  const handleAddMoodCategory = () => {
    if (newMoodCategory && !customMoodCategories.includes(newMoodCategory)) {
      onAddCustomMood(newMoodCategory);
      setNewMoodCategory('');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className={`mb-6 p-6 rounded-xl bg-gradient-to-r from-${theme.primaryColor}-600 via-${theme.primaryColor}-500 to-${theme.primaryColor}-700 text-white shadow-xl`}>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="opacity-90">Customize your MoodX experience</p>
      </div>
      
      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar/Tab Navigation */}
        <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800`}>
          <div className="p-4">
            <h2 className="font-bold text-lg mb-3">Settings</h2>
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id 
                      ? `bg-${theme.primaryColor}-100 text-${theme.primaryColor}-800 dark:bg-${theme.primaryColor}-900/30 dark:text-${theme.primaryColor}-200 font-medium` 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800`}>
            
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Theme Settings</h2>
                
                {/* Theme Mode */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3">Mode</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setTheme({ ...theme, mode: 'light' })}
                      className={`flex-1 p-4 border rounded-lg text-center transition-all ${
                        theme.mode === 'light' 
                          ? `bg-${theme.primaryColor}-100 border-${theme.primaryColor}-500 text-${theme.primaryColor}-800 dark:bg-${theme.primaryColor}-900/30 dark:border-${theme.primaryColor}-700 dark:text-${theme.primaryColor}-200` 
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <span className="font-medium">Light Mode</span>
                    </button>
                    
                    <button 
                      onClick={() => setTheme({ ...theme, mode: 'dark' })}
                      className={`flex-1 p-4 border rounded-lg text-center transition-all ${
                        theme.mode === 'dark' 
                          ? `bg-${theme.primaryColor}-100 border-${theme.primaryColor}-500 text-${theme.primaryColor}-800 dark:bg-${theme.primaryColor}-900/30 dark:border-${theme.primaryColor}-700 dark:text-${theme.primaryColor}-200` 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <span className="font-medium">Dark Mode</span>
                    </button>
                  </div>
                </div>
                
                {/* Theme Color */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Theme Color</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {['indigo', 'purple', 'pink', 'blue', 'teal', 'green', 'yellow', 'orange', 'red'].map(color => (
                      <button
                        key={color}
                        onClick={() => setTheme({ ...theme, primaryColor: color })}
                        className={`aspect-square rounded-full p-1 transition-transform ${
                          theme.primaryColor === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 scale-110' : ''
                        }`}
                      >
                        <div className={`w-full h-full rounded-full bg-${color}-500`}></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Custom Moods Tab */}
            {activeTab === 'customization' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Custom Mood Categories</h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Add New Mood Category
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={newMoodCategory}
                      onChange={(e) => setNewMoodCategory(e.target.value)}
                      placeholder="Enter mood category..."
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                    />
                    <button
                      onClick={handleAddMoodCategory}
                      className={`px-4 py-2 bg-${theme.primaryColor}-600 hover:bg-${theme.primaryColor}-700 text-white rounded-lg transition-colors`}
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Current Custom Moods</h3>
                  <div className="flex flex-wrap gap-2">
                    {customMoodCategories.map(category => (
                      <div 
                        key={category}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center group"
                      >
                        <span>{category}</span>
                        <button
                          onClick={() => onRemoveCustomMood(category)}
                          className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    {customMoodCategories.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No custom mood categories added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">App Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Notifications</h3>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Daily Mood Check-in</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get a reminder to log your mood</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-${theme.primaryColor}-600`}></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Weekly Report</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive a summary of your weekly moods</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-${theme.primaryColor}-600`}></div>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Privacy</h3>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Data Analytics</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Help improve MoodX with anonymous data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-${theme.primaryColor}-600`}></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 bg-${theme.primaryColor}-100 dark:bg-${theme.primaryColor}-900/30 rounded-full flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-${theme.primaryColor}-600 dark:text-${theme.primaryColor}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">User Account</h3>
                    <p className="text-gray-600 dark:text-gray-400">user@example.com</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button className={`w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800`}>
                    <span>Change Password</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button className={`w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800`}>
                    <span>Export Your Data</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 border border-red-300 dark:border-red-700 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <span>Delete Account</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;