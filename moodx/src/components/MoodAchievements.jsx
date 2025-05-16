import { useMemo } from 'react';

const MoodAchievements = ({ moods }) => {
  const achievements = useMemo(() => {
    if (!moods.length) return null;

    // Sort moods by date
    const sortedMoods = [...moods].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate current streak
    let currentStreak = 0;
    let lastDate = null;

    // Get only the dates (without time) to compare them
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateStrings = sortedMoods.map(mood => {
      const date = new Date(mood.date);
      date.setHours(0, 0, 0, 0);
      return date.toISOString().split('T')[0];
    });

    // Get unique dates (in case multiple moods were logged on the same day)
    const uniqueDates = [...new Set(dateStrings)];
    uniqueDates.reverse(); // Start with most recent

    // Calculate streak
    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      
      if (i === 0) {
        // Check if the most recent entry is from today or yesterday
        const todayStr = today.toISOString().split('T')[0];
        const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().split('T')[0];
        
        if (uniqueDates[i] === todayStr || uniqueDates[i] === yesterdayStr) {
          currentStreak = 1;
          lastDate = currentDate;
        } else {
          break; // Streak is broken
        }
      } else {
        // Check if this date is consecutive with the last one
        const expectedDate = new Date(lastDate.getTime() - 86400000);
        expectedDate.setHours(0, 0, 0, 0);
        const expectedDateStr = expectedDate.toISOString().split('T')[0];
        
        if (uniqueDates[i] === expectedDateStr) {
          currentStreak++;
          lastDate = currentDate;
        } else {
          break; // Streak is broken
        }
      }
    }

    // Calculate badges
    const badges = [];

    // Total entries badges
    if (moods.length >= 5) badges.push({ name: 'Getting Started', description: 'Log 5 moods' });
    if (moods.length >= 20) badges.push({ name: 'Mood Tracker', description: 'Log 20 moods' });
    if (moods.length >= 50) badges.push({ name: 'Mood Master', description: 'Log 50 moods' });

    // Streak badges
    if (currentStreak >= 3) badges.push({ name: 'Consistent', description: '3-day streak' });
    if (currentStreak >= 7) badges.push({ name: 'Week Warrior', description: '7-day streak' });
    if (currentStreak >= 30) badges.push({ name: 'Monthly Master', description: '30-day streak' });

    // Mood variety badges
    const uniqueMoods = new Set(moods.map(m => m.mood));
    if (uniqueMoods.size >= 3) badges.push({ name: 'Emotionally Aware', description: 'Track 3 different moods' });
    if (uniqueMoods.size >= 5) badges.push({ name: 'Emotional Range', description: 'Experience the full mood spectrum' });

    // Note badges
    const notesCount = moods.filter(m => m.note && m.note.trim().length > 0).length;
    if (notesCount >= 5) badges.push({ name: 'Reflector', description: 'Add notes to 5 mood entries' });
    if (notesCount >= 20) badges.push({ name: 'Journal Keeper', description: 'Add notes to 20 mood entries' });

    return {
      currentStreak,
      totalEntries: moods.length,
      badges
    };
  }, [moods]);

  if (!achievements) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-semibold mb-3 text-white">Achievements</h3>
        <p className="text-gray-300">Log your first mood to start earning achievements!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-white">Your Achievements</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-900/20 p-4 rounded-lg text-center">
          <p className="text-sm text-emerald-400 mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-white">{achievements.currentStreak} {achievements.currentStreak === 1 ? 'day' : 'days'}</p>
        </div>
        <div className="bg-indigo-900/20 p-4 rounded-lg text-center">
          <p className="text-sm text-indigo-400 mb-1">Total Entries</p>
          <p className="text-3xl font-bold text-white">{achievements.totalEntries}</p>
        </div>
      </div>
      
      {achievements.badges.length > 0 ? (
        <div>
          <h4 className="text-md font-medium mb-3 text-white">Badges Earned ({achievements.badges.length})</h4>
          <div className="grid grid-cols-2 gap-3">
            {achievements.badges.map((badge, index) => (
              <div key={index} className="border border-gray-700 rounded-lg p-3 flex items-center">
                <div className="bg-emerald-900/30 text-emerald-300 rounded-full p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">{badge.name}</p>
                  <p className="text-xs text-gray-400">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-3">
          <p className="text-gray-400">Keep tracking your moods to earn badges!</p>
        </div>
      )}
      
      {achievements.currentStreak > 0 && (
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Come back tomorrow to continue your streak!</p>
        </div>
      )}
    </div>
  );
};

export default MoodAchievements;