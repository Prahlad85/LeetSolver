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
 *     tags: [Automation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               leetcodeSession:
 *                 type: string
 *               preferredLanguage:
 *                 type: string
 *               aiProvider:
 *                 type: string
 *     responses:
 *       200:
 *         description: Automation job added to queue
 */
router.post('/trigger', async (req, res) => {
  try {
    const { userId, leetcodeSession, preferredLanguage, aiProvider } = req.body;
    
    const job = await leetcodeQueue.add('solve-daily', {
      userId,
      leetcodeSession,
      preferredLanguage,
      aiProvider
    });

    res.json({ message: 'Automation triggered', jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/automation/run-now:
 *   post:
 *     summary: Manually start automation for a specific user using their saved DB settings
 *     tags: [Automation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Automation started
 */
router.post('/run-now', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.leetcodeSession) return res.status(400).json({ error: 'LeetCode session not connected in settings' });

    const job = await leetcodeQueue.add('solve-daily', {
      userId: user._id,
      leetcodeSession: user.leetcodeSession,
      preferredLanguage: user.preferredLanguage || 'Python',
      aiProvider: 'Gemini'
    });

    res.json({ message: 'Automation started successfully', jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/automation/status/{jobId}:
 *   get:
 *     summary: Check status of an automation job
 *     tags: [Automation]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         schema:
 *           type: string
 *         required: true
 *         description: Job ID to check
 *     responses:
 *       200:
 *         description: Job status retrieved
 */
router.get('/status/:jobId', async (req, res) => {
  try {
    const job = await leetcodeQueue.getJob(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    const state = await job.getState();
    res.json({ id: job.id, state, result: job.returnvalue, failedReason: job.failedReason });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
