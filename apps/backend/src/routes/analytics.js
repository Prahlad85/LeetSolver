const express = require('express');
const router = express.Router();
const { adminMiddleware, authMiddleware } = require('../middlewares/authMiddleware');

router.get('/dashboard', authMiddleware, async (req, res) => {
  // Placeholder logic for returning analytics dashboard data
  res.json({ successRate: 94, totalSolved: 45, currentStreak: 12 });
});

router.get('/streak', authMiddleware, async (req, res) => {
  res.json({ streak: 12 });
});

router.get('/history', authMiddleware, async (req, res) => {
  res.json([]);
});

router.get('/ai-usage', authMiddleware, async (req, res) => {
  res.json({ tokensUsed: 120500, costEstimate: 0.24 });
});

module.exports = router;
