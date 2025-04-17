import Achievement from '../models/Achievement.js';

// Calculate streak from array of dates
export const calculateStreak = (dates) => {
  if (!dates || dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  // Sort dates in descending order
  const sortedDates = [...dates].sort((a, b) => new Date(b) - new Date(a));
  
  // Get today and yesterday for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Convert dates to day-only format for comparison
  const formattedDates = sortedDates.map(date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });
  
  // Check if streak is current (includes today or yesterday)
  const hasTodayOrYesterday = formattedDates.some(date => 
    date === today.getTime() || date === yesterday.getTime()
  );
  
  // If streak isn't current, return 0 for current streak
  if (!hasTodayOrYesterday) {
    // Calculate longest historical streak
    let longestStreak = 1;
    let currentRun = 1;
    
    for (let i = 0; i < formattedDates.length - 1; i++) {
      const currentDate = formattedDates[i];
      const nextDate = formattedDates[i + 1];
      
      // Check if dates are consecutive
      const diffTime = currentDate - nextDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        // Consecutive day
        currentRun++;
      } else if (diffDays === 0) {
        // Same day (duplicate entry)
        continue;
      } else {
        // Streak broken
        longestStreak = Math.max(longestStreak, currentRun);
        currentRun = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, currentRun);
    
    return { currentStreak: 0, longestStreak };
  }
  
  // Calculate current streak
  let currentStreak = 1;
  let dayToCheck = today.getTime();
  
  if (formattedDates.includes(today.getTime())) {
    dayToCheck = yesterday.getTime();
  } else {
    dayToCheck = new Date(today);
    dayToCheck.setDate(dayToCheck.getDate() - 2);
    dayToCheck = dayToCheck.getTime();
  }
  
  // Loop through dates to find consecutive days
  for (let i = 0; i < formattedDates.length; i++) {
    if (formattedDates.includes(dayToCheck)) {
      currentStreak++;
      const nextDay = new Date(dayToCheck);
      nextDay.setDate(nextDay.getDate() - 1);
      dayToCheck = nextDay.getTime();
    } else {
      break;
    }
  }
  
  return { currentStreak, longestStreak: currentStreak };
};

// Check for streak-related achievements
export const checkStreakAchievements = async (userId, type, targetId, streakCount) => {
  // Streak milestones
  const streakMilestones = [
    { streak: 3, id: `${type.toLowerCase()}-streak-3`, name: 'Building Momentum', points: 15 },
    { streak: 7, id: `${type.toLowerCase()}-streak-7`, name: '1 Week Streak', points: 30 },
    { streak: 14, id: `${type.toLowerCase()}-streak-14`, name: '2 Week Streak', points: 50 },
    { streak: 21, id: `${type.toLowerCase()}-streak-21`, name: 'Habit Forming', points: 75 },
    { streak: 30, id: `${type.toLowerCase()}-streak-30`, name: 'Monthly Master', points: 100 },
    { streak: 60, id: `${type.toLowerCase()}-streak-60`, name: 'Dedication', points: 150 },
    { streak: 90, id: `${type.toLowerCase()}-streak-90`, name: 'Lifestyle Change', points: 200 },
    { streak: 180, id: `${type.toLowerCase()}-streak-180`, name: 'Half Year Hero', points: 300 },
    { streak: 365, id: `${type.toLowerCase()}-streak-365`, name: 'Year-Long Legend', points: 500 }
  ];
  
  const unlockedAchievements = [];
  
  // Find applicable milestone
  for (const milestone of streakMilestones) {
    if (streakCount >= milestone.streak) {
      // Check if already unlocked
      const existingAchievement = await Achievement.findOne({
        userId,
        achievementId: milestone.id
      });
      
      if (!existingAchievement) {
        // Create new achievement
        const newAchievement = new Achievement({
          userId,
          achievementId: milestone.id,
          name: `${milestone.name} (${type})`,
          description: `Maintained a ${milestone.streak}-day streak for a ${type.toLowerCase()}.`,
          category: 'Streak',
          icon: '🔥',
          pointsAwarded: milestone.points,
          unlockedAt: new Date()
        });
        
        await newAchievement.save();
        unlockedAchievements.push(newAchievement);
      }
    }
  }
  
  return unlockedAchievements;
};