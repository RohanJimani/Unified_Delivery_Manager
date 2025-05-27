const History = require('../models/history');

// Get all history for the logged-in agent
// exports.getHistory = async (req, res) => {
//   try {
//     const histories = await History.find({ agentId: req.user.id }).sort({ createdAt: -1 });
//     res.json(histories);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    // Return only delivered deliveries
    const deliveries = await Delivery.find({ user: userId, status: "delivered" }).sort({ date: -1 });
    res.json(deliveries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

// Add a delivery to history
exports.addToHistory = async (req, res) => {
  try {
    const history = new History({
      ...req.body,
      agentId: req.user.id,
    });
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const deliveryId = req.params.id;
    const { status } = req.body;

    // Update status only if the delivery belongs to logged-in user
    const delivery = await Delivery.findOne({ _id: deliveryId, user: userId });
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    delivery.status = status; // e.g., "delivered"
    await delivery.save();

    res.json({ message: "Status updated successfully", delivery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};