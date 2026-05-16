const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  totalUsers: { type: Number, default: 0 },
  activeSubscriptions: { type: Number, default: 0 },
  problemsSolved: { type: Number, default: 0 },
  totalAiCost: { type: Number, default: 0 },
  averageExecutionTime: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
