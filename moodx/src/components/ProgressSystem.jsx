import React, { useState, useEffect } from 'react';

const ProgressSystem = ({ points, level, todos, moods, onLevelUp }) => {
  const [achievements, setAchievements] = useState([]);
  const [nextMilestone, setNextMilestone] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Calculate wellness level and milestones
  const calculateLevel = (points) => {
    return Math.floor(points / 100) + 1;
  };

  const getLevelInfo = (level) => {
    const levels = {
      1: { name: 'Wellness Beginner', color: 'text-gray-400', icon: '🌱' },
      2: { name: 'Mindful Explorer', color: 'text-green-400', icon: '🌿' },
      3: { name: 'Balance Seeker', color: 'text-blue-400', icon: '🌊' },
      4: { name: 'Wellness Warrior', color: 'text-purple-400', icon: '⚔️' },
      5: { name: 'Mental Health Master', color: 'text-yellow-400', icon: '👑' },
      6: { name: 'Wellness Sage', color: 'text-emerald-400', icon: '🧘‍♀️' },
      7: { name: 'Inner Peace Guardian', color: 'text-pink-400', icon: '🕊️' },
      8: { name: 'Wellness Legend', color: 'text-orange-400', icon: '🌟' },
      9: { name: 'Mental Health Champion', color: 'text-red-400', icon: '🏆' },
      10: { name: 'Wellness Grandmaster', color: 'text-rainbow-400', icon: '💎' }
    };
    return levels[level] || { name: 'Unknown', color: 'text-gray-400', icon: '❓' };
  };

  const getMilestones = () => {
    return [
      { level: 1, points: 0, title: 'Start Your Journey', reward: 'Basic wellness tracking' },
      { level: 2, points: 100, title: 'Mindful Explorer', reward: 'Advanced insights' },
      { level: 3, points: 200, title: 'Balance Seeker', reward: 'Personalized recommendations' },
      { level: 4, points: 300, title: 'Wellness Warrior', reward: 'AI coach access' },
      { level: 5, points: 400, title: 'Mental Health Master', reward: 'Advanced analytics' },
      { level: 6, points: 500, title: 'Wellness Sage', reward: 'Expert guidance' },
      { level: 7, points: 600, title: 'Inner Peace Guardian', reward: 'Premium features' },
      { level: 8, points: 700, title: 'Wellness Legend', reward: 'Community leader' },
      { level: 9, points: 800, title: 'Mental Health Champion', reward: 'Mentor status' },
      { level: 10, points: 900, title: 'Wellness Grandmaster', reward: 'Complete mastery' }
    ];
  };

  const getAchievements = () => {
    const achievements = [];
    
    // Streak achievements
    if (moods.length >= 7) achievements.push({ id: 'week_streak', name: 'Week Warrior', description: '7-day mood streak', icon: '📅', points: 50 });
    if (moods.length >= 30) achievements.push({ id: 'month_streak', name: 'Month Master', description: '30-day mood streak', icon: '📊', points: 100 });
    
    // Todo achievements
    const completedTodos = todos.filter(todo => todo.completed).length;
    if (completedTodos >= 5) achievements.push({ id: 'todo_5', name: 'Task Master', description: 'Completed 5 wellness tasks', icon: '✅', points: 30 });
    if (completedTodos >= 20) achievements.push({ id: 'todo_20', name: 'Wellness Champion', description: 'Completed 20 wellness tasks', icon: '🏆', points: 100 });
    
    // Level achievements
    if (level >= 3) achievements.push({ id: 'level_3', name: 'Getting Started', description: 'Reached level 3', icon: '🌱', points: 25 });
    if (level >= 5) achievements.push({ id: 'level_5', name: 'Halfway There', description: 'Reached level 5', icon: '🎯', points: 50 });
    if (level >= 10) achievements.push({ id: 'level_10', name: 'Grandmaster', description: 'Reached level 10', icon: '💎', points: 200 });
    
    return achievements;
  };

  useEffect(() => {
    const currentLevel = calculateLevel(points);
    const milestones = getMilestones();
    const nextMilestone = milestones.find(m => m.points > points) || milestones[milestones.length - 1];
    setNextMilestone(nextMilestone);
    setAchievements(getAchievements());
  }, [points, level, todos, moods]);

  // Check for level up
  useEffect(() => {
    const currentLevel = calculateLevel(points);
    if (currentLevel > level) {
      setShowLevelUp(true);
      if (onLevelUp) onLevelUp(currentLevel);
    }
  }, [points, level, onLevelUp]);

  const progressToNext = () => {
    if (!nextMilestone) return 0;
    const currentMilestone = getMilestones().find(m => m.points <= points) || { points: 0 };
    const progress = (points - currentMilestone.points) / (nextMilestone.points - currentMilestone.points);
    return Math.min(progress * 100, 100);
  };

  const levelInfo = getLevelInfo(level);

  return (
    <div className="space-y-6">
      {/* Level Up Modal */}
      {showLevelUp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">Level Up!</h2>
            <p className="text-emerald-100 text-lg mb-4">You've reached {levelInfo.name}</p>
            <div className="bg-white/20 rounded-lg p-4 mb-6">
              <p className="text-white font-medium">New Reward: {nextMilestone?.reward}</p>
            </div>
            <button
              onClick={() => setShowLevelUp(false)}
              className="px-6 py-3 bg-white text-emerald-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Continue Journey
            </button>
          </div>
        </div>
      )}

      {/* Current Progress */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Your Wellness Journey</h2>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{levelInfo.icon}</span>
            <span className={`font-bold ${levelInfo.color}`}>{levelInfo.name}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Current Level</span>
            <span className="text-2xl font-bold text-white">{level}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total Points</span>
            <span className="text-xl font-bold text-emerald-400">{points}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress to Next Level</span>
              <span className="text-emerald-400">{progressToNext().toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressToNext()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Next Milestone</h3>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold">{nextMilestone.title}</h4>
              <span className="text-blue-200 text-sm">Level {nextMilestone.level}</span>
            </div>
            <p className="text-blue-100 text-sm mb-3">{nextMilestone.reward}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-200">Points needed: {nextMilestone.points - points}</span>
              <span className="text-white font-medium">{nextMilestone.points} pts</span>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{achievement.name}</h4>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </div>
                <span className="text-emerald-400 font-medium">+{achievement.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness Goals */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Wellness Goals</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Complete 7-day streak</h4>
              <p className="text-gray-400 text-sm">Track your mood for 7 consecutive days</p>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-medium">+50 points</div>
              <div className="text-gray-400 text-xs">{moods.length}/7 days</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Complete 10 wellness tasks</h4>
              <p className="text-gray-400 text-sm">Finish 10 personalized wellness activities</p>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-medium">+100 points</div>
              <div className="text-gray-400 text-xs">{todos.filter(t => t.completed).length}/10 tasks</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Reach Wellness Master</h4>
              <p className="text-gray-400 text-sm">Achieve level 5 in your wellness journey</p>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-medium">+200 points</div>
              <div className="text-gray-400 text-xs">Level {level}/5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSystem; 