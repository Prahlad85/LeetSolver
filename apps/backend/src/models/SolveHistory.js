const mongoose = require('mongoose');

const solveHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemTitle: { type: String, required: true },
  problemDifficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  language: { type: String, required: true },
  aiProvider: { type: String, required: true },
  codeSubmitted: { type: String, required: true },
  status: { type: String, enum: ['Success', 'Failed'], required: true },
  executionTimeMs: { type: Number },
  memoryUsedMb: { type: Number },
  logs: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SolveHistory', solveHistorySchema);
