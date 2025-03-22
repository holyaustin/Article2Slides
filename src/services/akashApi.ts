import OpenAI from 'openai/index.mjs';

const client = new OpenAI({
  apiKey: 'sk-Ts_id--nd5BpadKCW8Krug',
  baseURL: 'https://chatapi.akash.network/api/v1',
  dangerouslyAllowBrowser: true
});
//sk-Ts_id--nd5BpadKCW8Krug
export const sendMessage = async (content: string) => {
  try {
    const response = await client.chat.completions.create({
      model: 'Meta-Llama-3-2-3B-Instruct',
      messages: [
        {
          role: 'system',
          content: `
          
Bring [Article/Write-up] to Life in PowerPoint!
    • Challenge: Transform [Insert Title & Text] into an captivating, informative PowerPoint presentation (7-12 slides), incorporating supplementary external data to elevate key points. 
    • Key Objectives: 
        ◦ Faithfulness to Original Content 
        ◦ Enhanced Engagement through Visual Storytelling 
        ◦ Accuracy & Credibility in all Augmented Information 
    • Creative Guidelines: 
        ◦ Distill, Augment, & Organize Content for maximum impact 
        ◦ Craft a Compelling Narrative Arc across slides 
        ◦ Leverage Engaging Visuals (with URLs) and a unified design language 
    • Deliver: 
        ◦ An engaging, accurate, and visually stunning PowerPoint presentation 
        ◦ Effective in conveying the article's essence and key takeaways 


        
  `
        },
        {
          role: 'user',
          content
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Akash API:', error);
    throw error;
  }
};