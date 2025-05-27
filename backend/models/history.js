const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery', required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: String,
  orderNumber: String,
  customer: String,
  amount: Number,
  location: String,
  status: String,
  date: Date,
  time: String,
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);