const { Worker } = require('bullmq');
const io = require('socket.io-client');
const { generateSolution } = require('./ai');
const { extractProblem, submitCode } = require('./automation/leetcode');
const { syncUserProgress } = require('./automation/sync');
const SolveHistory = require('../backend/src/models/SolveHistory'); // Import Model
const CryptoJS = require('crypto-js');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect Mongoose in worker
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/leetsolver');

const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined
};

const socket = io(process.env.BACKEND_URL || 'http://localhost:5000');

async function handleJob(job) {
  const { userId, leetcodeSession } = job.data;
  
  if (job.name === 'sync-progress') {
    socket.emit('worker_log', { userId, message: `[Sync] Starting progress synchronization...` });
    try {
      const decryptedSession = CryptoJS.AES.decrypt(leetcodeSession, process.env.COOKIE_SECRET || 'secret123').toString(CryptoJS.enc.Utf8);
      const solvedProblems = await syncUserProgress(decryptedSession);
      
      // Save to DB
      for (const solve of solvedProblems) {
        await SolveHistory.findOneAndUpdate(
          { userId, problem: solve.problem },
          { ...solve, userId },
          { upsert: true }
        );
      }
      
      socket.emit('worker_log', { userId, message: `[Sync] Success! Synced ${solvedProblems.length} past problems.` });
    } catch (err) {
      socket.emit('worker_log', { userId, message: `[Sync Error] ${err.message}` });
    }
    return;
  }

  if (job.name === 'solve-daily') {
    // ... (Existing runAutomation logic)
    // For brevity, I'm keeping the solve-daily logic separate or calling it
    return await runAutomation(job);
  }
}

async function runAutomation(job) {
  const { userId, leetcodeSession, preferredLanguage } = job.data;
  socket.emit('worker_log', { userId, message: `[Worker] Daily solver started...` });
  // (Full playwright logic here as before)
}

const worker = new Worker('leetcode-automation', handleJob, { connection: redisConnection });

console.log('LeetSolver Worker initialized with Sync capability.');
