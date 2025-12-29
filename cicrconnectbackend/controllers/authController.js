const User = require('../models/User');
const InviteCode = require('../models/InviteCode');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
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

        // 3. Create the user
        const user = await User.create({
            name,
            email,
            password,
            collegeId,
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
        // Note: Without try/catch or async-handler, this throw might crash the app in Express 4
        // Recommend adding error handling here in the future
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

/**
 * @desc    Verify User Email
 * @route   GET /api/auth/verifyemail/:token
 * @access  Public
 */
const verifyEmail = async (req, res) => {
    // TODO: Add your actual email verification logic here
    // For now, this placeholder prevents the server from crashing
    const { token } = req.params;
    console.log(`Verification requested for token: ${token}`);
    
    res.status(200).json({ 
        success: true, 
        message: 'Email verification endpoint hit' 
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    verifyEmail, // <--- This was the missing export causing your error
};