const mongoose = require('mongoose');

const queueLogSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Active', 'Completed', 'Failed'], default: 'Pending' },
  attemptsMade: { type: Number, default: 0 },
  failedReason: { type: String, default: '' },
  processedByWorker: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('QueueLog', queueLogSchema);
