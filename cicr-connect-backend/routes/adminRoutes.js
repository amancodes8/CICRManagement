const express = require('express');
const router = express.Router();
const { generateInviteCode, getAllUsers, deleteUser, updateUserByAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes in this file are protected and for Admins only
router.use(protect, authorize('Admin'));

// Generate invite code
router.post('/invite', generateInviteCode);

// Get all users, update a user, delete a user
router.route('/users')
    .get(getAllUsers);
    
router.route('/users/:id')
    .put(updateUserByAdmin)
    .delete(deleteUser);

module.exports = router;
