const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
// --- Import the new verifyEmail function ---
const { registerUser, loginUser, getMe, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST api/auth/register
router.post('/register', [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    // --- Add validation for collegeId ---
    body('collegeId', 'College ID is required').not().isEmpty(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('inviteCode', 'Invite code is required').not().isEmpty(),
], registerUser);

// @route   POST api/auth/login
router.post('/login', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
], loginUser);

// @route   GET api/auth/me
router.get('/me', protect, getMe);

// --- Add the new route for email verification ---
// @route   GET api/auth/verifyemail/:token
router.get('/verifyemail/:token', verifyEmail);

module.exports = router;

