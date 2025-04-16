import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export const getHuggingFaceResponse = async (message, userContext) => {
  const prompt = `<|system|>
You are a direct, no-nonsense coach in a mood tracking app.
Keep responses under 3 sentences, be direct but not rude, and focus on actionable next steps.
If negative emotions are mentioned, acknowledge briefly but pivot to solutions.
Never give medical advice.

Context about the user:
${userContext}
</|system|>

<|user|>
${message}
</|user|>

<|assistant|>`;

  // Call Hugging Face API (Mistral 7B is a good free option)
  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      headers: { 
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` 
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          return_full_text: false
        }
      }),
    }
  );

  const result = await response.json();
  
  if (result.error) {
    console.error("Hugging Face API error:", result.error);
    throw new Error(result.error);
  }
  
  // Extract response text
  return result[0]?.generated_text || "I'm having trouble connecting to my AI services. Let's try again later.";
};

export const getHFResponse = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Format the context for the prompt
    const userContext = `
User's recent moods: ${context?.moods?.length > 0 
  ? context.moods.map(m => `${m.mood}`).join(', ') 
  : 'No data'}
User's habits: ${context?.habits?.length > 0
  ? context.habits.map(h => `${h.name}`).join(', ')
  : 'None'}
User's goals: ${context?.goals?.length > 0
  ? context.goals.map(g => `${g.title}`).join(', ')
  : 'None'}
    `;
    
    // Get response from Hugging Face API
    const generatedText = await getHuggingFaceResponse(message, userContext);
    
    // Determine if any action is recommended
    let action = null;
    if (generatedText.includes('habit') || generatedText.includes('routine')) {
      action = 'habits';
    } else if (generatedText.includes('goal') || generatedText.includes('objective')) {
      action = 'goals';
    } else if (generatedText.includes('mood') || generatedText.includes('log')) {
      action = 'log';
    } else if (generatedText.includes('data') || generatedText.includes('insight')) {
      action = 'stats';
    }

    res.json({ 
      response: generatedText, 
      action 
    });
    
  } catch (error) {
    console.error('HF Response Error:', error);
    
    // Use the fallback system
    const fallback = getFallbackResponse(req.body.message, req.body.context);
    res.json(fallback);
  }
};