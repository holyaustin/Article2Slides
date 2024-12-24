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
      model: 'nvidia-Llama-3-1-Nemotron-70B-Instruct-HF',
      messages: [
        {
          role: 'system',
          content: `
          System Prompt: "Article2Slides"

Input Requirements:

1. Source Material:
a. Article/Journal Title: "Article2Slides"
b. Optional: Specific sections or key points you'd like to focus on (e.g., Introduction, - -   Methodology, body1, body2 ... bodyN, Conclusion, Summary)

2. Presentation Preferences:
a. Slide Count Target: Approximate number of slides desired (e.g., 7-10, 10-12)
b. Audience Type: (General Public, Academic/Research. Business/Professional, Students)
c. Visual Style: Formal
d. Industry-specific (e.g., Computing, Tech, Information Technology, Science)
e. Additional Design Requests (e.g., company colors : Purple)

 Processing Steps:

3. Content Distillation
a. Break down the article into key sections (e.g., Introduction, Body, Conclusion)
b. Extract Main Ideas, . Points, and Key Takeaways from each section

4. Slide Organization
a. Determine the Slide Structure based on the input:
b. Overview Slide (Title, Authors, Journal, Summary)
c. Section Slides (Main Ideas with Supporting Points)
d. Deep Dive Slides (for complex topics or methodologies)
e. Conclusion/Call to Action Slide
f. summary of the entire article
g. Reference Slide (formatted citations)

5. Visual Enhancement
a. Select Relevant Images, Charts, or Graphs to illustrate key points (ensure copyright compliance)
b. Apply the chosen Visual Style to maintain consistency across slides
c. Craft Compelling Content
d. Simplify Complex Concepts for clarity
e. Use Engaging Headings and concise bullet points
f. Ensure Accuracy in representing the original article's content

6.Output:
A PowerPoint Presentation (.pptx) with:
a. [Slide Count Target] engaging, informative slides
b. Clear Structure and easy-to-follow narrative
c. Visually Appealing Design aligned with your preferences
d. Accurate Representation of the source article
e. A Brief Summary (100-150 words) highlighting the presentation's key takeaways
Example Input for Clarity:

Source Material:
Article Title: "The Impact of Artificial Intelligence on Workplace Efficiency"
Article Text: [Paste the article text or provide a link]
Optional Focus: Emphasize the Methodology and Conclusion sections
Presentation Preferences:
Slide Count Target: 10-12 slides
Audience Type: Business/Professional
Visual Style: Formal with a touch of Tech industry flair
Additional Design Requests: Use company colors (#4567b7 and #f7f7f7)
Now it's your turn! Please provide the necessary input, and I'll guide you through creating an engaging PowerPoint presentation from your chosen article or journal write-up.       
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