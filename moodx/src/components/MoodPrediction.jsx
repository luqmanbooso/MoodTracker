import { useState, useEffect } from 'react';

const MoodPrediction = ({ moods }) => {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  
  useEffect(() => {
    if (!moods || moods.length < 5) return; // Need at least 5 entries for a prediction
    
    predictMood(moods);
  }, [moods]);
  
  const predictMood = (moodData) => {
    if (moodData.length < 5) return;
    
    // Map mood values to numbers for calculations
    const moodValues = {
      'Great': 5,
      'Good': 4,
      'Okay': 3,
      'Bad': 2,
      'Terrible': 1
    };
    
    // Get the last 14 days of moods (or fewer if not available)
    const last14Days = [];
    const now = new Date();
    
    for (let i = 0; i < 14; i++) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - i);
      targetDate.setHours(0, 0, 0, 0);
      
      const targetDateStr = targetDate.toISOString().split('T')[0];
      
      // Find moods for this date
      const moodsOnDate = moodData.filter(m => {
        const moodDate = new Date(m.date);
        moodDate.setHours(0, 0, 0, 0);
        return moodDate.toISOString().split('T')[0] === targetDateStr;
      });
      
      if (moodsOnDate.length > 0) {
        // If multiple moods on the same day, take the average
        const avgMoodValue = moodsOnDate.reduce((sum, m) => sum + moodValues[m.mood], 0) / moodsOnDate.length;
        last14Days.push({ day: i, value: avgMoodValue });
      }
    }
    
    // Need at least 5 days of data
    if (last14Days.length < 5) return;
    
    // Several approaches to predict mood:
    
    // 1. Average of last 3 days (simple)
    const last3Days = last14Days.filter(d => d.day < 3);
    if (last3Days.length < 2) return;
    
    const avgLast3 = last3Days.reduce((sum, d) => sum + d.value, 0) / last3Days.length;
    
    // 2. Look for weekly patterns
    let weeklyPattern = false;
    let weekdayAvg = 0;
    let weekendAvg = 0;
    let weekdayCount = 0;
    let weekendCount = 0;
    
    for (const mood of last14Days) {
      const date = new Date(now);
      date.setDate(now.getDate() - mood.day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendAvg += mood.value;
        weekendCount++;
      } else {
        weekdayAvg += mood.value;
        weekdayCount++;
      }
    }
    
    if (weekdayCount > 0) weekdayAvg /= weekdayCount;
    if (weekendCount > 0) weekendAvg /= weekendCount;
    
    // Check if there's a significant difference between weekday and weekend moods
    if (Math.abs(weekdayAvg - weekendAvg) > 0.7 && weekdayCount >= 3 && weekendCount >= 2) {
      weeklyPattern = true;
    }
    
    // Determine tomorrow's prediction
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowDay = tomorrow.getDay();
    
    let predictedMoodValue;
    let predictionConfidence;
    
    if (weeklyPattern) {
      // Use weekly pattern for prediction
      predictedMoodValue = (tomorrowDay === 0 || tomorrowDay === 6) ? weekendAvg : weekdayAvg;
      predictionConfidence = 0.7; // 70% confidence when using weekly pattern
    } else {
      // Use recent average
      predictedMoodValue = avgLast3;
      predictionConfidence = 0.5; // 50% confidence for simple average
    }
    
    // Map the numeric prediction back to a mood
    const predictedMood = mapValueToMood(predictedMoodValue);
    
    // Set prediction state
    setPrediction(predictedMood);
    setConfidence(Math.round(predictionConfidence * 100));
  };
  
  const mapValueToMood = (value) => {
    if (value >= 4.5) return 'Great';
    if (value >= 3.5) return 'Good';
    if (value >= 2.5) return 'Okay';
    if (value >= 1.5) return 'Bad';
    return 'Terrible';
  };
  
  const getMoodColor = (mood) => {
    switch(mood) {
      case 'Great': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Okay': return 'text-yellow-600';
      case 'Bad': return 'text-orange-600';
      case 'Terrible': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  if (!prediction) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Tomorrow's Mood Forecast</h3>
        <p className="text-gray-500 text-sm mb-2">Not enough data for a prediction yet.</p>
        <p className="text-gray-500 text-sm">Add at least 5 days of mood entries to see your forecast.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Tomorrow's Mood Forecast</h3>
      
      <div className="text-center py-2">
        <p className="text-sm text-gray-500 mb-1">Predicted Mood</p>
        <p className={`text-3xl font-bold ${getMoodColor(prediction)}`}>{prediction}</p>
        <p className="text-sm text-gray-500 mt-1">Confidence: {confidence}%</p>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Based on your recent mood patterns.</p>
        <p className="mt-1">Check back tomorrow to see if the prediction was accurate!</p>
      </div>
    </div>
  );
};

export default MoodPrediction;