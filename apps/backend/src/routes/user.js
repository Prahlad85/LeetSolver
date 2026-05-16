const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middlewares/authMiddleware');
const CryptoJS = require('crypto-js');

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/connect-leetcode:
 *   post:
 *     summary: Connect LeetCode session cookie
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leetcodeSession:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session connected
 */
router.post('/connect-leetcode', authMiddleware, async (req, res) => {
  try {
    const { leetcodeSession } = req.body;
    const encrypted = CryptoJS.AES.encrypt(leetcodeSession, process.env.COOKIE_SECRET || 'secret123').toString();
    await User.findByIdAndUpdate(req.user.id, { leetcodeSession: encrypted, automationEnabled: true });
    res.json({ message: 'LeetCode session connected and encrypted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/language:
 *   put:
 *     summary: Update preferred coding language
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [Python, JavaScript, Java, C++]
 *     responses:
 *       200:
 *         description: Language updated
 */
router.put('/language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.body;
    await User.findByIdAndUpdate(req.user.id, { preferredLanguage: language });
    res.json({ message: 'Language updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
