const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const auth = require('../middleware/auth');

// Get all history for the logged-in agent
router.get('/', auth, historyController.getHistory);

// Add a delivery to history
router.post('/', auth, historyController.addToHistory);

module.exports = router;