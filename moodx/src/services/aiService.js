// No need for axios import - using fetch instead

export const getAIResponse = async (message, context) => {
  try {
    console.log('Sending message to AI:', message);
    console.log('With context:', context);
    
    const response = await fetch('http://localhost:5000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, context })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw backend response:', data);
    
    // Make sure to map the response structure correctly
    return {
      message: data.response,  // Map 'response' from backend to 'message' for frontend
      action: data.action,
      source: data.source || 'openrouter'
    };
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
};