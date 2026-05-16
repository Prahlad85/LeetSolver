const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAISolution(description, language, provider = 'openai') {
  const prompt = `
    You are an expert competitive programmer. Solve the following LeetCode problem.
    Optimize for time and space complexity.
    Return ONLY the raw code solution in ${language}, with no markdown formatting and no explanations.
    
    Problem Description:
    ${description}
  `;

  try {
    if (provider === 'openai') {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      });
      return response.choices[0].message.content.trim();
    }
    // Add logic for gemini/claude later
    throw new Error(`Provider ${provider} not fully implemented yet.`);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw error;
  }
}

module.exports = { getAISolution };
