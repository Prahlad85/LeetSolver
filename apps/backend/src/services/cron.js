const cron = require('node-cron');
const { Queue } = require('bullmq');
const User = require('../models/User');

const leetcodeQueue = new Queue('leetcode-automation', {
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_HOST?.includes('upstash.io') ? {} : undefined
  }
});

const startDailyCron = () => {
  // Run every day at 00:01 UTC
  cron.schedule('1 0 * * *', async () => {
    console.log('[CRON] Triggering daily LeetCode automation for all active users...');
    try {
      const activeUsers = await User.find({ automationEnabled: true });
      for (const user of activeUsers) {
        if (user.leetcodeSession) {
          await leetcodeQueue.add('solve-daily', {
            userId: user._id,
            leetcodeSession: user.leetcodeSession,
            preferredLanguage: user.preferredLanguage || 'Python',
            aiProvider: user.defaultAiProvider || 'gpt-4o'
          });
        }
      }
      console.log(`[CRON] Added ${activeUsers.length} jobs to the queue.`);
    } catch (error) {
      console.error('[CRON Error]:', error);
    }
  });
};

module.exports = startDailyCron;
