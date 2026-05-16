const mongoose = require('mongoose');

const workerNodeSchema = new mongoose.Schema({
  workerId: { type: String, required: true, unique: true },
  hostname: { type: String, required: true },
  status: { type: String, enum: ['Healthy', 'Busy', 'Offline', 'Restarting'], default: 'Healthy' },
  lastHeartbeat: { type: Date, default: Date.now },
  jobsProcessed: { type: Number, default: 0 },
  errorsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('WorkerNode', workerNodeSchema);
