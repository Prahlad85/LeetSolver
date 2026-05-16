const express = require('express');
const router = express.Router();
const { adminMiddleware, authMiddleware } = require('../middlewares/authMiddleware');

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  res.json([{ id: 1, email: 'admin@leetsolver.ai', role: 'admin' }]);
});

router.get('/workers', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({ activeWorkers: 2, queueLength: 0 });
});

router.post('/ban-user', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({ message: 'User banned' });
});

router.post('/restart-worker', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({ message: 'Worker restart signal sent' });
});

module.exports = router;
