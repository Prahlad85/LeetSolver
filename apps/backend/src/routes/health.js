const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'LeetSolver Backend' });
});

router.get('/status', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ db: dbStatus, memory: process.memoryUsage() });
});

router.get('/metrics', (req, res) => {
  res.json({ reqCount: 1420, activeSockets: 4 });
});

module.exports = router;
