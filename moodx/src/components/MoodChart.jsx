import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MoodChart = ({ moods }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (moods.length === 0) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Process data for the chart
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const moodValues = {
      'Great': 5,
      'Good': 4,
      'Okay': 3,
      'Bad': 2,
      'Terrible': 1
    };

    const moodsByDay = last7Days.map(day => {
      const dayMoods = moods.filter(mood => 
        new Date(mood.date).toISOString().split('T')[0] === day
      );
      
      if (dayMoods.length === 0) return null;
      
      // Calculate average mood for the day
      const avgMood = dayMoods.reduce((sum, mood) => sum + moodValues[mood.mood], 0) / dayMoods.length;
      return avgMood;
    });

    // Format dates for display
    const labels = last7Days.map(day => {
      const date = new Date(day);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });

    // Create chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mood Trend',
          data: moodsByDay,
          backgroundColor: 'rgba(66, 135, 245, 0.2)',
          borderColor: 'rgba(66, 135, 245, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgba(66, 135, 245, 1)',
          pointRadius: 4
        }]
      },
      options: {
        scales: {
          y: {
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                const labels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Great'];
                return labels[value];
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed.y;
                const labels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Great'];
                return `Mood: ${labels[value]}`;
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [moods]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Mood Trend</h2>
      <div className="h-64">
        {moods.length > 0 ? (
          <canvas ref={chartRef}></canvas>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">Log your moods to see trends</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodChart;