import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const AccountabilityDashboard = ({ moods = [], habits = [], goals = [] }) => {
  const { theme } = useTheme();
  const [completionRate, setCompletionRate] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [actionableInsight, setActionableInsight] = useState('');

  useEffect(() => {
    // Calculate habit completion rate
    if (habits.length > 0) {
      const completed = habits.filter(habit => habit.completed).length;
      setCompletionRate(Math.round((completed / habits.length) * 100));
    }

    // Calculate current streak of daily check-ins
    calculateStreak();

    // Generate an actionable insight based on mood patterns
    generateInsight();
  }, [moods, habits]);

  const calculateStreak = () => {
    if (moods.length === 0) return;
    
    let streak = 1;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Check if logged today
    const loggedToday = moods.some(mood => {
      const moodDate = new Date(mood.date);
      moodDate.setHours(0, 0, 0, 0);
      return moodDate.getTime() === currentDate.getTime();
    });
    
    if (!loggedToday) {
      // Check if yesterday was logged
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const loggedYesterday = moods.some(mood => {
        const moodDate = new Date(mood.date);
        moodDate.setHours(0, 0, 0, 0);
        return moodDate.getTime() === yesterday.getTime();
      });
      
      if (!loggedYesterday) {
        setCurrentStreak(0);
        return;
      }
    }
    
    // Count consecutive days backward
    let checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() - 1);
    
    while (true) {
      const hasLog = moods.some(mood => {
        const moodDate = new Date(mood.date);
        moodDate.setHours(0, 0, 0, 0);
        return moodDate.getTime() === checkDate.getTime();
      });
      
      if (!hasLog) break;
      
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    setCurrentStreak(streak);
  };

  const generateInsight = () => {
    if (moods.length < 3) {
      setActionableInsight("Start building daily habits to see actionable insights");
      return;
    }

    // Basic pattern analysis
    const recentMoods = moods.slice(0, 5);
    const badMoodCount = recentMoods.filter(m => m.mood === 'Bad' || m.mood === 'Terrible').length;
    const goodMoodCount = recentMoods.filter(m => m.mood === 'Good' || m.mood === 'Great').length;
    
    if (badMoodCount >= 3) {
      setActionableInsight("Your mood has been down lately. Focus on your sleep schedule and morning routine for the next 3 days.");
    } else if (goodMoodCount >= 3) {
      setActionableInsight("You're doing well! This is the perfect time to tackle that challenging goal you've been putting off.");
    } else {
      // Check activities correlation with good moods
      const allActivities = [...new Set(moods.flatMap(m => m.activities || []))];
      
      for (const activity of allActivities) {
        const moodsWithActivity = moods.filter(m => (m.activities || []).includes(activity));
        const goodMoodsWithActivity = moodsWithActivity.filter(m => m.mood === 'Good' || m.mood === 'Great');
        
        if (moodsWithActivity.length >= 3 && (goodMoodsWithActivity.length / moodsWithActivity.length) >= 0.7) {
          setActionableInsight(`${activity} seems to improve your mood. Make time for it today.`);
          return;
        }
      }
      
      setActionableInsight("Establish a consistent morning routine to set yourself up for daily success.");
    }
  };

  const getQuote = () => {
    const quotes = [
      "Discipline equals freedom. — Jocko Willink",
      "You don't rise to the level of your goals, you fall to the level of your systems. — James Clear",
      "A man who conquers himself is greater than one who conquers a thousand men in battle. — Buddha",
      "Hard choices, easy life. Easy choices, hard life. — Jerzy Gregory",
      "The pain of discipline is far less than the pain of regret. — Jim Rohn",
      "Do what you have to do until you can do what you want to do. — Denzel Washington",
      "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Aristotle",
      "Your mind must be stronger than your feelings. — Unknown"
    ];
    
    // Return a quote based on the day of the month to keep it consistent for the day
    const dayOfMonth = new Date().getDate();
    return quotes[dayOfMonth % quotes.length];
  };

  return (
    <div className="space-y-6">
      {/* Mindset Quote */}
      <div className={`bg-${theme.primaryColor}-800 text-white p-5 rounded-lg shadow-lg`}>
        <div className="text-xl font-bold mb-1">Today's Mindset</div>
        <div className="italic">"{getQuote()}"</div>
      </div>
      
      {/* Main Accountability Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`bg-${theme.cardBg} p-4 rounded-lg shadow border-l-4 border-blue-600`}>
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm">CURRENT STREAK</div>
            <div className="text-2xl font-bold">{currentStreak} days</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {currentStreak > 0 
              ? `Keep the momentum going!` 
              : `Time to start fresh. Log daily.`}
          </div>
        </div>
        
        <div className={`bg-${theme.cardBg} p-4 rounded-lg shadow border-l-4 border-green-600`}>
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm">HABIT COMPLETION</div>
            <div className="text-2xl font-bold">{completionRate}%</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {completionRate >= 80 
              ? `Strong discipline. Stay committed.` 
              : `Focus on consistency, not perfection.`}
          </div>
        </div>
        
        <div className={`bg-${theme.cardBg} p-4 rounded-lg shadow border-l-4 border-purple-600`}>
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm">GOALS IN PROGRESS</div>
            <div className="text-2xl font-bold">{goals.length || 0}</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {goals.length > 0 
              ? `Working on ${goals.length} key improvements` 
              : `Set clear goals to measure progress`}
          </div>
        </div>
      </div>
      
      {/* Action Item */}
      <div className={`bg-${theme.cardBg} p-5 rounded-lg shadow`}>
        <div className="flex items-start">
          <div className="bg-amber-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Today's Action</h3>
            <p className="text-gray-700">{actionableInsight}</p>
            <button 
              className={`mt-3 px-4 py-2 bg-${theme.primaryColor}-600 text-white rounded hover:bg-${theme.primaryColor}-700 transition`}
            >
              Mark Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountabilityDashboard;
