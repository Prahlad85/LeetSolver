const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');

async function generateSolution(problemData, language) {
  const prompt = `
  You are an expert competitive programmer. Solve the following LeetCode problem in ${language}.
  
  Title: ${problemData.title}
  Description: ${problemData.description}
  
  Please provide ONLY the clean, optimal code. Do not include markdown codeblocks or explanations, just the raw code.
  Optimize for Time and Space Complexity.
  `;

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock-key') {
    console.log('[AI Mock] Returning mock solution for', language);
    return `// Mock optimal solution for ${problemData.title}\nclass Solution {\n  solve() {\n    return true;\n  }\n}`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Gemini sometimes wraps code in markdown despite instructions, so we clean it
    text = text.replace(/```[\w]*\n/g, '').replace(/```/g, '').trim();
    
    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate solution via Gemini');
  }
}

module.exports = { generateSolution };
