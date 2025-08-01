import React, { useState, useEffect } from 'react';
import { awardPoints, getProgress } from '../services/progressApi';

// Wellness-focused point values
const WELLNESS_VALUES = {
  LOG_MOOD: 15,           // Base wellness check-in
  ADD_NOTE: 10,           // Self-reflection bonus
  ADD_ACTIVITIES: 8,      // Activity awareness
  ADD_TAGS: 5,            // Emotional awareness
  COMPLETE_HABIT: 20,     // Healthy habit completion
  COMPLETE_MILESTONE: 25, // Goal progress
  COMPLETE_GOAL: 50,      // Major achievement
  DAILY_STREAK: 15,       // Consistency bonus
  WEEKLY_STREAK: 40,      // Weekly consistency
  MONTHLY_STREAK: 100,    // Monthly dedication
  WELLNESS_INSIGHT: 12,   // Understanding patterns
  SELF_CARE_ACTIVITY: 18  // Self-care actions
};

const PointsSystem = ({ points, streaks, level, achievements }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Calculate level and progress
  const calculateLevel = (totalPoints) => {
    const levels = [
      { level: 1, minPoints: 0, title: "Emotional Novice" },
      { level: 2, minPoints: 100, title: "Emotional Apprentice" },
      { level: 3, minPoints: 300, title: "Emotional Practitioner" },
      { level: 4, minPoints: 600, title: "Emotional Adept" },
      { level: 5, minPoints: 1000, title: "Emotional Master" },
      { level: 6, minPoints: 1500, title: "Emotional Sage" },
      { level: 7, minPoints: 2200, title: "Emotional Guru" },
      { level: 8, minPoints: 3000, title: "Emotional Legend" },
      { level: 9, minPoints: 4000, title: "Emotional Immortal" },
      { level: 10, minPoints: 5000, title: "Emotional Deity" }
    ];

    const currentLevel = levels.find(l => totalPoints >= l.minPoints) || levels[0];
    const nextLevel = levels.find(l => l.minPoints > totalPoints) || currentLevel;
    
    const progress = nextLevel.minPoints > currentLevel.minPoints 
      ? ((totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
      : 100;

    return {
      current: currentLevel,
      next: nextLevel,
      progress: Math.min(progress, 100),
      pointsToNext: Math.max(0, nextLevel.minPoints - totalPoints)
    };
  };

  const levelInfo = calculateLevel(points);

  // Points earning breakdown
  const pointsBreakdown = {
    baseLog: 10,
    detailedNotes: 5,
    activities: 3,
    positiveMood: 2,
    streakBonus: 1,
    weeklyReflection: 20,
    monthlyInsights: 50,
    moodImprovement: 100,
    breakingPatterns: 200,
    helpingOthers: 30,
    communityParticipation: 25,
    emotionalBreakthrough: 150
  };

  // Achievement categories
  const achievementCategories = {
    consistency: {
      title: "Consistency",
      icon: "📅",
      achievements: [
        { id: "first_week", name: "First Week", description: "Log moods for 7 consecutive days", points: 50 },
        { id: "first_month", name: "Monthly Master", description: "Log moods for 30 consecutive days", points: 200 },
        { id: "streak_100", name: "Century Streak", description: "Reach 100-day streak", points: 500 }
      ]
    },
    growth: {
      title: "Growth",
      icon: "🌱",
      achievements: [
        { id: "mood_improvement", name: "Mood Climber", description: "Improve average mood by 1 point", points: 100 },
        { id: "pattern_break", name: "Pattern Breaker", description: "Break a negative mood pattern", points: 200 },
        { id: "emotional_breakthrough", name: "Breakthrough", description: "Achieve major emotional insight", points: 300 }
      ]
    },
    community: {
      title: "Community",
      icon: "🤝",
      achievements: [
        { id: "help_others", name: "Helper", description: "Support 5 other users", points: 100 },
        { id: "community_leader", name: "Leader", description: "Lead a community challenge", points: 200 },
        { id: "mentor", name: "Mentor", description: "Guide 10 users to their first achievement", points: 500 }
      ]
    },
    creativity: {
      title: "Creativity",
      icon: "🎨",
      achievements: [
        { id: "mood_art", name: "Mood Artist", description: "Create 10 mood artworks", points: 150 },
        { id: "emotional_poetry", name: "Poet", description: "Write 20 emotional poems", points: 200 },
        { id: "creative_breakthrough", name: "Creative Genius", description: "Create something beautiful from pain", points: 400 }
      ]
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">{levelInfo.current.level}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{levelInfo.current.title}</h2>
            <p className="text-sm text-slate-400">{points} total points</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300">Progress to Level {levelInfo.next.level}</span>
          <span className="text-emerald-400 font-medium">{levelInfo.progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${levelInfo.progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {levelInfo.pointsToNext} points to next level
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-slate-700 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">{streaks?.moodStreak || 0}</div>
          <div className="text-xs text-slate-400">Day Streak</div>
        </div>
        <div className="text-center p-3 bg-slate-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">{achievements?.length || 0}</div>
          <div className="text-xs text-slate-400">Achievements</div>
        </div>
        <div className="text-center p-3 bg-slate-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">{levelInfo.current.level}</div>
          <div className="text-xs text-slate-400">Current Level</div>
        </div>
      </div>

      {/* Points Earning Guide */}
      {showDetails && (
        <div className="mb-6 p-4 bg-slate-700 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-3">How to Earn Points</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-emerald-400 mb-2">Daily Activities</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">Log mood</span>
                  <span className="text-emerald-400">+10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Add detailed notes</span>
                  <span className="text-emerald-400">+5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Log activities</span>
                  <span className="text-emerald-400">+3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Positive mood bonus</span>
                  <span className="text-emerald-400">+2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Streak bonus</span>
                  <span className="text-emerald-400">+1</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-2">Special Activities</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">Weekly reflection</span>
                  <span className="text-blue-400">+20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Monthly insights</span>
                  <span className="text-blue-400">+50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Mood improvement</span>
                  <span className="text-blue-400">+100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Break patterns</span>
                  <span className="text-blue-400">+200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Help others</span>
                  <span className="text-blue-400">+30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Achievements</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(achievementCategories).map(([category, data]) => (
            <div key={category} className="p-3 bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{data.icon}</span>
                <span className="text-sm font-medium text-white">{data.title}</span>
              </div>
              
              <div className="space-y-1">
                {data.achievements.slice(0, 2).map(achievement => {
                  const isUnlocked = achievements?.some(a => a.id === achievement.id);
                  return (
                    <div 
                      key={achievement.id}
                      className={`text-xs p-2 rounded ${
                        isUnlocked 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-slate-600/50 text-slate-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{achievement.name}</span>
                        <span className="text-emerald-400">+{achievement.points}</span>
                      </div>
                      <div className="text-xs mt-1">{achievement.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level Rewards */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Level Rewards</h3>
        
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(level => (
            <div 
              key={level}
              className={`p-3 rounded-lg border ${
                level <= levelInfo.current.level
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-700 border-slate-600 text-slate-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Level {level}</span>
                <span className="text-sm">
                  {level <= levelInfo.current.level ? '✅ Unlocked' : '🔒 Locked'}
                </span>
              </div>
              <div className="text-xs mt-1">
                {level === 1 && 'Access to basic mood tracking'}
                {level === 2 && 'Unlock detailed analytics and insights'}
                {level === 3 && 'Access to AI wellness coach'}
                {level === 4 && 'Unlock community features and challenges'}
                {level === 5 && 'Become a mentor and help others'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointsSystem;