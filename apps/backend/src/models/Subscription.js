const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  plan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
  status: { type: String, enum: ['active', 'past_due', 'canceled', 'unpaid'], default: 'active' },
  currentPeriodEnd: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
