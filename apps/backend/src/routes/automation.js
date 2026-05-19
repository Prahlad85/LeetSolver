const express = require('express');
const router = express.Router();
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

/**
 * @swagger
 * /api/automation/trigger:
 *   post:
 *     summary: Trigger LeetCode daily problem automation
 */
router.post('/trigger', async (req, res) => {
  try {
    const { userId, leetcodeSession, preferredLanguage, aiProvider } = req.body;
    const job = await leetcodeQueue.add('solve-daily', { userId, leetcodeSession, preferredLanguage, aiProvider });
    res.json({ message: 'Automation triggered', jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/automation/run-now:
 *   post:
 *     summary: Manually start automation for a specific user
 */
router.post('/run-now', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.leetcodeSession) return res.status(400).json({ error: 'LeetCode session missing' });

    const job = await leetcodeQueue.add('solve-daily', {
      userId: user._id,
      leetcodeSession: user.leetcodeSession,
      preferredLanguage: user.preferredLanguage || 'Python',
      aiProvider: 'Gemini'
    });

    res.json({ message: 'Automation started', jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/automation/sync-progress:
 *   post:
 *     summary: Sync past solves from LeetCode
 */
router.post('/sync-progress', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.leetcodeSession) return res.status(400).json({ error: 'LeetCode session missing' });

    const job = await leetcodeQueue.add('sync-progress', {
      userId: user._id,
      leetcodeSession: user.leetcodeSession
    });

    res.json({ message: 'Sync job started', jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status/:jobId', async (req, res) => {
  try {
    const job = await leetcodeQueue.getJob(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const state = await job.getState();
    res.json({ id: job.id, state, result: job.returnvalue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
