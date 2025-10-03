const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// The 'protect' middleware ensures only logged-in users can access these routes.

// This single route now handles two HTTP methods:
// GET will retrieve the user's profile using the getUserProfile controller function.
// PUT will update the user's profile using the updateUserProfile controller function.
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;

