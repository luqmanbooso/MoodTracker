import { useMemo } from 'react';

const MoodStreak = ({ moods }) => {
  const { currentStreak, longestStreak, badges } = useMemo(() => {
    if (!moods.length) {
      return { currentStreak: 0, longestStreak: 0, badges: [] };
    }

    // Sort moods by date (newest first)
    const sortedMoods = [...moods].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate current streak
    let currentStreak = 1;
    let longestStreak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const firstMoodDate = new Date(sortedMoods[0].date);
    firstMoodDate.setHours(0, 0, 0, 0);
    
    // Check if most recent mood is from today or yesterday
    if (!(today.getTime() === firstMoodDate.getTime() || 
        today.getTime() - firstMoodDate.getTime() === 86400000)) {
      currentStreak = 0;
    } else {
      // Calculate streak by checking consecutive days
      for (let i = 0; i < sortedMoods.length - 1; i++) {
        const currentDate = new Date(sortedMoods[i].date);
        const nextDate = new Date(sortedMoods[i + 1].date);
        
        currentDate.setHours(0, 0, 0, 0);
        nextDate.setHours(0, 0, 0, 0);
        
        // If dates are consecutive days, increase streak
        if (currentDate.getTime() - nextDate.getTime() === 86400000) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          // Streak broken
          break;
        }
      }
    }
    
    // Define badges
    const badges = [];
    
    // Streak badges
    if (currentStreak >= 3) badges.push({ name: "3-Day Streak", icon: "🔥", description: "Logged mood for 3 consecutive days" });
    if (currentStreak >= 7) badges.push({ name: "Week Warrior", icon: "🏆", description: "Logged mood for 7 consecutive days" });
    if (currentStreak >= 30) badges.push({ name: "Mood Master", icon: "⭐", description: "Logged mood for 30 consecutive days" });
    
    // Count badges
    const totalEntries = moods.length;
    if (totalEntries >= 5) badges.push({ name: "Getting Started", icon: "🌱", description: "Logged 5 mood entries" });
    if (totalEntries >= 20) badges.push({ name: "Consistent Tracker", icon: "📊", description: "Logged 20 mood entries" });
    if (totalEntries >= 50) badges.push({ name: "Mood Expert", icon: "🧠", description: "Logged 50 mood entries" });
    
    // Variety badges
    const uniqueMoods = new Set(moods.map(m => m.mood)).size;
    if (uniqueMoods >= 3) badges.push({ name: "Emotional Range", icon: "🌈", description: "Tracked 3 different moods" });
    if (uniqueMoods >= 5) badges.push({ name: "Full Spectrum", icon: "🎭", description: "Tracked all 5 different moods" });
    
    return { currentStreak, longestStreak, badges };
  }, [moods]);

  if (!moods.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Achievements</h3>
        <p className="text-gray-500">Start logging your moods to earn badges and build streaks!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Achievements</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-3xl mb-1">🔥 {currentStreak}</div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-3xl mb-1">⚡ {longestStreak}</div>
          <div className="text-sm text-gray-600">Longest Streak</div>
        </div>
      </div>
      
      {badges.length > 0 ? (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Badges Earned</h4>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 flex items-center">
                <div className="text-2xl mr-3">{badge.icon}</div>
                <div>
                  <div className="font-medium">{badge.name}</div>
                  <div className="text-xs text-gray-500">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Keep tracking to earn badges!</p>
      )}
    </div>
  );
};

export default MoodStreak;