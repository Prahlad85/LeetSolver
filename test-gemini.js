require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
Solve this LeetCode problem in JavaScript:

Two Sum

Given an array nums and target,
return indices of two numbers such that they add up to target.
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    console.log(response);

  } catch (err) {
    console.error("Gemini Error:", err.message);
  }
}

testGemini();