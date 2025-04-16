import { useState, useEffect } from 'react';

const PersonalizedTips = ({ moods }) => {
  const [tip, setTip] = useState(null);
  
  useEffect(() => {
    if (!moods || moods.length === 0) return;
    
    // Get most recent mood
    const latestMood = moods[0];
    
    // Generate tip based on mood
    generateTip(latestMood);
  }, [moods]);
  
  const generateTip = (moodData) => {
    if (!moodData) return;
    
    const { mood, activities = [] } = moodData;
    
    // Tips organized by mood category
    const moodTips = {
      'Great': [
        `Celebrate your positive mood by sharing your joy with a friend.`,
        `Take advantage of your good mood to tackle a difficult task you've been putting off.`,
        `When you're feeling great, try journaling about it to understand what factors contribute to your happiness.`,
        `Maintain this positive energy with some light meditation or a quick yoga session.`,
        `Use this positive state to set goals for the future.`
      ],
      'Good': [
        `Keep the good vibes going with a short walk or light exercise.`,
        `Listen to your favorite upbeat music to maintain your positive mood.`,
        `Try to identify what contributed to your good mood today so you can replicate it.`,
        `Use this good mood to connect with friends or family members.`,
        `Practice gratitude by writing down three things you're thankful for today.`
      ],
      'Okay': [
        `Sometimes neutral is good! Use this balanced state to plan your day.`,
        `A short 10-minute meditation might help center your thoughts while in this neutral state.`,
        `Try a creative activity like drawing or writing to potentially boost your mood.`,
        `A change of environment might help – try working from a different room or go outside.`,
        `Check in with yourself – are there small things you could do to move toward a more positive state?`
      ],
      'Bad': [
        `Take a few deep breaths and remember that all feelings are temporary.`,
        `A short walk or light exercise can help release endorphins when you're feeling down.`,
        `Consider talking to someone about what's bothering you – sharing can help lighten the load.`,
        `Try to limit social media use when feeling down as it can sometimes worsen negative feelings.`,
        `Practice self-care: take a warm shower, make a cup of tea, or read a few pages of a book you enjoy.`
      ],
      'Terrible': [
        `When feeling very low, remember to be kind to yourself – this feeling will pass.`,
        `Consider reaching out to a trusted friend, family member, or mental health professional.`,
        `Focus on basic self-care – ensure you're eating, staying hydrated, and getting rest.`,
        `Try grounding exercises: name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.`,
        `If possible, postpone major decisions until your mood improves.`
      ]
    };
    
    // Activity-based tips
    const activityTips = {
      'Exercise': `Great job staying active! Regular exercise is linked to improved mood and mental health.`,
      'Work': `Remember to take short breaks during work to prevent burnout and maintain productivity.`,
      'Family': `Family time is valuable for emotional wellbeing. Keep nurturing these connections.`,
      'Friends': `Social connections are key to happiness. Make time for friends regularly.`,
      'Hobby': `Hobbies provide joy and fulfillment. Try to make time for them even when busy.`,
      'Rest': `Good rest is essential for emotional regulation. Prioritize your sleep schedule.`,
      'Other': `Trying new activities expands your experiences and can lead to new sources of joy.`
    };
    
    // Select random tip based on mood
    const moodBasedTips = moodTips[mood] || moodTips['Okay'];
    const randomMoodTip = moodBasedTips[Math.floor(Math.random() * moodBasedTips.length)];
    
    // Select activity tip if applicable
    let activityTip = null;
    if (activities && activities.length > 0) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      activityTip = activityTips[activity] || null;
    }
    
    setTip({
      moodTip: randomMoodTip,
      activityTip: activityTip
    });
  };
  
  if (!tip) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Personalized Tips</h3>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          </div>
          <p className="text-gray-700">{tip.moodTip}</p>
        </div>
        
        {tip.activityTip && (
          <div className="flex items-center mt-4">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-700">{tip.activityTip}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedTips;