const User = require('../models/User');
const InviteCode = require('../models/InviteCode');
const generateToken = require('../utils/generateToken');

/**
 * @desc   
 * @route   
 * @access  
 */
const registerUser = async (req, res) => {
    // --- FIX: Added 'collegeId' to the destructuring ---
    const { name, email, password, collegeId, inviteCode } = req.body;

    // Basic validation
    if (!name || !email || !password || !inviteCode || !collegeId) {
        res.status(400);
        throw new Error('Please enter all required fields');
    }

    try {
        // 1. Check if user already exists by email OR collegeId
        const userExists = await User.findOne({ $or: [{ email }, { collegeId }] });
        if (userExists) {
            let message = userExists.email === email
                ? 'A user with this email already exists.'
                : 'A user with this College ID already exists.';
            res.status(400);
            throw new Error(message);
        }

        // 2. Validate the invite code
        const code = await InviteCode.findOne({ code: inviteCode });
        if (!code || code.used || code.expiresAt < new Date()) {
            res.status(400);
            throw new Error('Invalid or expired invitation code');
        }

        // --- FIX: Pass 'collegeId' when creating the new user ---
        const user = await User.create({
            name,
            email,
            password,
            collegeId, // This was the missing piece
        });
        
        if (user) {
            // 4. Mark invite code as used
            code.used = true;
            await code.save();

            // 5. Return user and token
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }

    } catch (err) {
        // This makes sure Mongoose validation errors are sent back nicely
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            res.status(400).json({ message: messages[0] });
        } else {
            console.error(err.message);
            res.status(500).json({ message: err.message || 'Server error' });
        }
    }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
};


module.exports = {
    registerUser,
    loginUser,
    getMe,
};

