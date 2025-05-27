const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const Delivered = require('../models/Delivery');
const auth = require('../middleware/auth'); // JWT auth middleware


// Get all deliveries for the logged-in agent
router.get('/', auth, deliveryController.getDeliveries);

// Add this route at the top
router.post('/', auth, deliveryController.createDelivery);


// Accept a delivery
router.post('/:id/accept', auth, deliveryController.acceptDelivery);

// Reject a delivery
router.post('/:id/reject', auth, deliveryController.rejectDelivery);

// Update delivery status
router.patch('/:id/status', auth, deliveryController.updateStatus);



module.exports = router;