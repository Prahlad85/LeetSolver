const { Worker } = require('bullmq');
const { chromium } = require('playwright');
const io = require('socket.io-client');
const { generateSolution } = require('./ai');
const { extractProblem, submitCode } = require('./automation/leetcode');
const CryptoJS = require('crypto-js');
require('dotenv').config();

const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_HOST?.includes('upstash.io') ? {} : undefined
};

const socket = io(process.env.BACKEND_URL || 'http://localhost:5000');

async function runAutomation(job) {
  const { userId, leetcodeSession, preferredLanguage } = job.data;
  socket.emit('worker_log', { userId, message: `[Worker] Job ${job.id} started. Launching Playwright browser...` });

  let browser;
  let page;
  try {
    const bytes = CryptoJS.AES.decrypt(leetcodeSession, process.env.COOKIE_SECRET || 'secret123');
    const decryptedCookie = bytes.toString(CryptoJS.enc.Utf8);

    browser = await chromium.launch({ headless: false }); 
    const context = await browser.newContext();
    
    // Set cookie
    await context.addCookies([{ 
      name: 'LEETCODE_SESSION', 
      value: decryptedCookie, 
      domain: '.leetcode.com', 
      path: '/',
      secure: true,
      httpOnly: true
    }]);
    
    page = await context.newPage();

    // 1. Extract Problem
    socket.emit('worker_log', { userId, message: `[Worker] Extracting problem data...` });
    const problemData = await extractProblem(page);
    socket.emit('worker_log', { userId, message: `[Worker] Extracted problem: ${problemData.title}` });

    // AI Code Validation & Auto-Retry Loop
    let isSuccess = false;
    let attempts = 0;
    const maxAttempts = 3;
    let currentProblemData = { ...problemData };

    while (!isSuccess && attempts < maxAttempts) {
      attempts++;
      socket.emit('worker_log', { userId, message: `[Worker] Attempt ${attempts}/${maxAttempts}: Generating solution via Gemini...` });
      
      const solutionCode = await generateSolution(currentProblemData, preferredLanguage);
      
      socket.emit('worker_log', { userId, message: `[Worker] Pasting and Submitting...` });
      const result = await submitCode(page, solutionCode);

      if (result.status === "Success") {
        socket.emit('worker_log', { userId, message: `[Worker] Submission Accepted! 🎉` });
        isSuccess = true;
        return { success: true, problem: problemData.title, metrics: result };
      } else {
        socket.emit('worker_log', { userId, message: `[Worker] Failed: ${result.error}. Retrying...` });
        currentProblemData.description += `\n\nPrevious attempt failed with error: ${result.error}. Fix the code.`;
      }
    }

    if (!isSuccess) throw new Error(`Max retry attempts reached.`);
    
  } catch (error) {
    console.error('[Worker Error]', error);
    socket.emit('worker_log', { userId, message: `[Worker CRITICAL] ${error.message}` });
    throw error;
  } finally {
    if (browser) {
      console.log('[Worker] Waiting 10 seconds before closing...');
      await new Promise(r => setTimeout(r, 10000));
      await browser.close();
    }
  }
}

const worker = new Worker('leetcode-automation', async job => {
  return await runAutomation(job);
}, { connection: redisConnection });

console.log('Playwright Worker Node initialized.');
