const mongoose = require('mongoose');

const aiLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemTitle: { type: String, required: true },
  aiProvider: { type: String, required: true },
  promptTokens: { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  estimatedCost: { type: Number, default: 0 },
  executionTimeMs: { type: Number, default: 0 },
  status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
  errorMessage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('AiLog', aiLogSchema);
