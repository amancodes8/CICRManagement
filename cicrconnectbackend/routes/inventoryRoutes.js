const express = require('express');
const router = express.Router();
const { 
    getInventory, 
    addComponent, 
    issueComponent 
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all robotics components
router.get('/', protect, getInventory);

// Admin only: Add new components (like Servo - 10)
router.post('/add', protect, authorize('Admin'), addComponent);

// Members: Borrow/Issue components for projects
router.post('/issue', protect, issueComponent);

module.exports = router;