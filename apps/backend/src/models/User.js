const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  leetcodeSession: { type: String, default: '' },
  preferredLanguage: { type: String, default: 'Python', enum: ['Python', 'JavaScript', 'Java', 'C++'] },
  defaultAiProvider: { type: String, default: 'gpt-4o', enum: ['gpt-4o', 'claude-3-5', 'gemini-1-5'] },
  automationEnabled: { type: Boolean, default: false },
  subscriptionPlan: { type: String, default: 'Free', enum: ['Free', 'Pro', 'Enterprise'] },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
