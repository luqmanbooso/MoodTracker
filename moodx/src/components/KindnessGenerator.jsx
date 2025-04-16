import { useState, useEffect } from 'react';

const KindnessGenerator = ({ currentMood }) => {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  
  const kindnessByMood = {
    Great: [
      "Share your positive energy by writing a heartfelt thank-you note to someone who helped you recently.",
      "Send an encouraging text to someone who might be having a hard time.",
      "Buy coffee or a small treat for a colleague or friend.",
      "Leave a generous tip for your server or delivery person.",
      "Share your skills by teaching someone something you're good at.",
      "Offer to help a neighbor with a household task.",
      "Post a positive review for a small business you enjoy.",
      "Donate to a charity that's meaningful to you.",
      "Call a family member just to tell them you appreciate them.",
      "Share your resources – books, tools, or knowledge – with someone who needs them."
    ],
    Good: [
      "Write a short note of appreciation for someone in your life.",
      "Hold the door open for strangers throughout your day.",
      "Give a sincere compliment to at least three people today.",
      "Check in on a friend you haven't spoken to in a while.",
      "Recommend a book, movie, or song that might brighten someone's day.",
      "Make a playlist for a friend or family member.",
      "Let someone go ahead of you in line.",
      "Make an effort to smile at everyone you pass today.",
      "Pick up litter you see in a public place.",
      "Share something positive on social media instead of complaining."
    ],
    Okay: [
      "Send a text to check in on a friend.",
      "Make a small donation to a cause you care about.",
      "Pick up an extra item at the grocery store to donate to a food bank.",
      "Give a genuine compliment to someone in your life.",
      "Listen actively when someone is speaking to you today.",
      "Return a shopping cart for someone at the store.",
      "Share a resource or article that might help someone else.",
      "Let someone merge into your lane in traffic.",
      "Recycle something you might normally throw away.",
      "Send a funny meme or joke to someone who needs a laugh."
    ],
    Bad: [
      "Take a moment to send a kind message to a friend.",
      "Do one small act of self-kindness today – you deserve care too.",
      "Give someone your full attention in a conversation.",
      "Water a plant or feed a bird – caring for other living things can lift your mood.",
      "Put your phone away during conversations today.",
      "Smile at a stranger – it costs nothing but can mean a lot.",
      "Leave a small tip in a tip jar.",
      "Use kind words with yourself in your internal dialogue.",
      "Hold the door for someone.",
      "Thank someone for a service, like your mail carrier or grocery store worker."
    ],
    Terrible: [
      "Be kind to yourself first – take five minutes to do something that comforts you.",
      "Send a brief text to someone you care about – human connection helps.",
      "Practice compassion for yourself and one other person today.",
      "Smile at someone – sometimes the smallest gestures matter most.",
      "If you have the energy, pick up one piece of litter you see today.",
      "Use a kind voice when speaking to yourself in your thoughts.",
      "Thank someone who serves you today, even briefly.",
      "Make your bed or clean a small area – creating order can be a gift to yourself.",
      "Take a deep breath before responding to others today.",
      "Forgive yourself or someone else for a small mistake."
    ]
  };
  
  // Default suggestions if no mood is provided
  const defaultSuggestions = [
    "Send an encouraging text to someone who's going through a hard time.",
    "Offer to help a colleague with a task they're struggling with.",
    "Give a genuine compliment to someone you interact with today.",
    "Call a family member just to check in on them.",
    "Leave a positive review for a small business you appreciate.",
    "Hold the door open for someone behind you.",
    "Let someone go ahead of you in line at the store.",
    "Send a thank-you note to someone who has helped you recently.",
    "Share an interesting article or resource with someone who would appreciate it.",
    "Practice active listening in your conversations today."
  ];
  
  useEffect(() => {
    generateSuggestion();
  }, [currentMood]);
  
  const generateSuggestion = () => {
    setLoading(true);
    
    // Simulate a delay to make it feel like it's "generating" a suggestion
    setTimeout(() => {
      const suggestions = currentMood 
        ? kindnessByMood[currentMood] || defaultSuggestions
        : defaultSuggestions;
      
      const randomIndex = Math.floor(Math.random() * suggestions.length);
      setSuggestion(suggestions[randomIndex]);
      setLoading(false);
    }, 500);
  };
  
  const handleGenerateAnother = () => {
    generateSuggestion();
  };
  
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Random Act of Kindness</h3>
      
      <div className="bg-purple-50 p-4 rounded-lg mb-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-purple-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-purple-200 rounded w-5/6"></div>
          </div>
        ) : (
          <p className="text-purple-800">{suggestion}</p>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={handleGenerateAnother}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'New Suggestion'}
        </button>
        
        <button
          onClick={handleShowMore}
          className="text-purple-600 hover:text-purple-800"
        >
          {showMore ? 'Show Less' : 'Why Practice Kindness?'}
        </button>
      </div>
      
      {showMore && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">The Benefits of Kindness</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Increases happiness and positive mood</li>
            <li>• Reduces stress and anxiety</li>
            <li>• Improves social connections</li>
            <li>• Can lower blood pressure</li>
            <li>• Releases oxytocin, a hormone associated with bonding</li>
            <li>• Creates a ripple effect of positivity in your community</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default KindnessGenerator;