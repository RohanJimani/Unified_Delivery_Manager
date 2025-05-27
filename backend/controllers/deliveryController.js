const Delivery = require('../models/Delivery');

// Get all deliveries (optionally filter by agent)
exports.getDeliveries = async (req, res) => {
  try {
    const filter = req.user ? { agentId: req.user.id } : {};
    const deliveries = await Delivery.find(filter);
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept a delivery
exports.acceptDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status: 'ASSIGNED', agentId: req.user.id },
      { new: true }
    );
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject a delivery
exports.rejectDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status: 'CANCELLED', agentId: null },
      { new: true }
    );
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update delivery status (picked up, delivered, etc.)
// exports.updateStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     console.log('Updating status to:', status);
//     console.log('Delivery ID:', req.params.id);

//     // Find the delivery first
//     const delivery = await Delivery.findById(req.params.id);
//     if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

//     // If marking as DELIVERED, move to Delivered collection
//     if (status === 'DELIVERED') {
//       const deliveredDoc = new Delivered({
//         ...delivery.toObject(),
//         status: 'DELIVERED',
//       });
//       await deliveredDoc.save();              // Save to delivered collection
//       await Delivery.findByIdAndDelete(req.params.id); // Remove from active
//       return res.json({ message: 'Delivery marked as DELIVERED and archived.' });
//     }

//     // Otherwise, just update the status
//     const updated = await Delivery.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     res.json(updated);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// Update delivery status (picked up, delivered, etc.)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    delivery.status = status;
    await delivery.save();

    // Archive to history if delivered
    if (status === 'DELIVERED') {
      const history = new History(delivery.toObject());
      await history.save();
    }
     console.log("✅ Delivery status updated in DB:", delivery);
    res.json(delivery);
  } catch (err) {
    console.error("❌ Error updating delivery status:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create a new delivery
exports.createDelivery = async (req, res) => {
  try {
    const {
      platform,
      pickupAddress,
      dropAddress,
      orderNumber,
      items,
      amount,
      earnings,
      estimatedDeliveryTime,
      distance
    } = req.body;

    const newDelivery = new Delivery({
      platform,
      pickupAddress,
      dropAddress,
      orderNumber,
      items,
      amount,
      earnings,
      estimatedDeliveryTime,
      distance,
      status: 'PENDING' // initial status
    });
      console.log("🚀 Incoming Delivery Data:", req.body); 
    const saved = await newDelivery.save();
    console.log("✅ New delivery created:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating delivery:", err.message);
    res.status(500).json({ error: err.message });
  }
};




