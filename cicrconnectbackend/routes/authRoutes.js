const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
    registerUser, 
    loginUser, 
    getMe, 
    verifyEmail, 
    updateProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register user with invite code and send verification email
router.post('/register', [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('collegeId', 'College ID is required').not().isEmpty(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('inviteCode', 'Invite code is required').not().isEmpty(),
], registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token (checks if verified)
router.post('/login', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
], loginUser);

// @route   GET api/auth/me
// @desc    Get current logged in user data
router.get('/me', protect, getMe);

// @route   PUT api/auth/profile
// @desc    Update user profile (Year, Phone, Branch, Batch, etc.)
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   GET api/auth/verifyemail/:token
// @desc    Verify email via token sent to user's inbox
router.get('/verifyemail/:token', verifyEmail);

module.exports = router;