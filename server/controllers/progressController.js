// SIMPLE MOCK IMPLEMENTATION

/**
 * Get user progress including points, level, and other stats
 */
export const getUserProgress = async (req, res) => {
  try {
    // Simple mock data
    res.json({
      points: 475,
      level: 3,
      moodEntryCount: 17,
      currentStreak: 5,
      longestStreak: 8,
      recentAchievements: [
        {
          title: "10 Mood Entries",
          description: "You've logged 10 moods!",
          earnedDate: new Date()
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all achievements for the current user
 */
export const getAchievements = async (req, res) => {
  try {
    // Simple mock data
    res.json([
      {
        title: "10 Mood Entries",
        description: "You've logged 10 moods!",
        earnedDate: new Date()
      },
      {
        title: "3 Day Streak",
        description: "3 day streak of mood logging!",
        earnedDate: new Date()
      }
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get detailed user stats and insights
 */
export const getUserStats = async (req, res) => {
  try {
    // Simple mock data
    res.json({
      totalEntries: 17,
      moodDistribution: {
        "Great": 4,
        "Good": 6,
        "Neutral": 3,
        "Bad": 3,
        "Awful": 1
      },
      mostFrequentMood: "Good"
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};