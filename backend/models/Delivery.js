const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  platform: String,
  pickupAddress: {
    name: String,
    address: String,
  },
  dropAddress: {
    name: String,
    address: String,
  },
  orderNumber: String,
  items: [String],
  amount: Number,
  earnings: Number,
  estimatedDeliveryTime: Date,
  distance: Number,
  status: { type: String, default: 'PENDING' },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
