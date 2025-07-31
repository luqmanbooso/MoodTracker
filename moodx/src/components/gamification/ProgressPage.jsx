import React, { useState, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../context/ThemeContext';

const ProgressPage = () => {
  const { darkMode } = useTheme();
  const { 
    progress, 
    activities, 
    achievements, 
    stats, 
    loading, 
    error, 
    fetchProgress 
  } = useProgress();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2 text-white">Error Loading Progress</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Progress Header */}
      <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-xl">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
          <span className="text-emerald-100 text-sm font-medium">Wellness Progress</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Wellness Journey</h1>
        <p className="text-emerald-100 opacity-90">Track your mental health progress, celebrate achievements, and see how far you've come.</p>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-emerald-400">{progress?.wellnessScore || 0}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Wellness Score</h3>
          <p className="text-gray-400 text-sm">Your overall mental health progress</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-yellow-400">{progress?.currentStreak || 0}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Current Streak</h3>
          <p className="text-gray-400 text-sm">Days of consistent wellness tracking</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-blue-400">{progress?.level || 1}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Wellness Level</h3>
          <p className="text-gray-400 text-sm">Your mental health mastery level</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-purple-400">{achievements?.length || 0}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Achievements</h3>
          <p className="text-gray-400 text-sm">Wellness milestones unlocked</p>
        </div>
      </div>

      {/* Progress Tabs */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { id: 'activities', label: 'Activities', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { id: 'achievements', label: 'Achievements', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
              { id: 'stats', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Wellness Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Current Level</span>
                        <span className="text-white font-medium">{progress?.level || 1}</span>
                      </div>
                      <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${progress?.progressToNextLevel || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {progress?.pointsToNextLevel || 0} points to next level
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {activities?.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{activity.description}</p>
                            <p className="text-gray-400 text-xs">{new Date(activity.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="text-emerald-400 font-medium">+{activity.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Wellness Activities</h3>
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities?.map((activity, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="text-emerald-400 font-bold">+{activity.points}</span>
                    </div>
                    <h4 className="text-white font-medium mb-1">{activity.description}</h4>
                    <p className="text-gray-400 text-sm">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Wellness Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements?.map((achievement, index) => (
                  <div key={index} className={`bg-gray-700 rounded-lg p-4 border-2 ${
                    achievement.earned ? 'border-emerald-500' : 'border-gray-600'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.earned ? 'bg-emerald-500/20' : 'bg-gray-600/20'
                      }`}>
                        <svg className={`w-6 h-6 ${
                          achievement.earned ? 'text-emerald-400' : 'text-gray-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      {achievement.earned && (
                        <span className="text-emerald-400 text-sm font-medium">✓ Earned</span>
                      )}
                    </div>
                    <h4 className={`font-medium mb-1 ${
                      achievement.earned ? 'text-white' : 'text-gray-400'
                    }`}>{achievement.name}</h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-gray-300' : 'text-gray-500'
                    }`}>{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Wellness Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4">Tracking Consistency</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current Streak</span>
                      <span className="text-white font-medium">{stats?.currentStreak || 0} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Longest Streak</span>
                      <span className="text-white font-medium">{stats?.longestStreak || 0} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Entries</span>
                      <span className="text-white font-medium">{stats?.totalMoodEntries || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4">Wellness Score</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current Score</span>
                      <span className="text-white font-medium">{stats?.totalPoints || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Wellness Level</span>
                      <span className="text-white font-medium">{stats?.level || 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Completion Rate</span>
                      <span className="text-white font-medium">{stats?.completionRate || 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4">Achievements</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Achievements</span>
                      <span className="text-white font-medium">{achievements?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Earned</span>
                      <span className="text-white font-medium">
                        {achievements?.filter(a => a.earned).length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-white font-medium">
                        {achievements?.length > 0 
                          ? Math.round((achievements.filter(a => a.earned).length / achievements.length) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;