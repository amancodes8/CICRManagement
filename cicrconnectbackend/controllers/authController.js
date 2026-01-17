const User = require('../models/User');
const InviteCode = require('../models/InviteCode');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    const { name, email, password, collegeId, inviteCode } = req.body;

    // Basic validation
    if (!name || !email || !password || !inviteCode || !collegeId) {
        return res.status(400).json({ message: 'Please enter all required fields' });
    }

    try {
        // 1. Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { collegeId }] });
        if (userExists) {
            let message = userExists.email === email
                ? 'A user with this email already exists.'
                : 'A user with this College ID already exists.';
            return res.status(400).json({ message });
        }

        // 2. Validate the invite code
        const code = await InviteCode.findOne({ code: inviteCode });
        if (!code || code.used || code.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired invitation code' });
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

            // 5. Generate Verification Token
            const verifyToken = user.createVerificationToken();
            await user.save({ validateBeforeSave: false });

            // 6. Send Verification Email
            // Note: Change 'localhost' to your IP if testing on a mobile device
            const verifyUrl = `http://localhost:5173/verify-email/${verifyToken}`;
            
            const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2563eb; text-align: center;">Verify Your CICR Account</h2>
                    <p>Hello ${user.name},</p>
                    <p>Thank you for joining CICR Connect! Please click the button below to verify your email and activate your account:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
                    </div>
                    <p style="font-size: 12px; color: #777;">If you did not register for this account, please ignore this email.</p>
                </div>
            `;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Action Required: Verify Your Email',
                    message: emailContent
                });

                res.status(201).json({
                    success: true,
                    message: 'Registration successful! Please check your email to verify your account.'
                });
            } catch (err) {
                console.error("Email send failed:", err);
                res.status(201).json({
                    success: true,
                    message: 'Account created, but verification email failed to send. Please contact support.'
                });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            
            // MANDATORY CHECK: Block login if not verified
            if (!user.isVerified) {
                return res.status(401).json({ 
                    message: 'Email not verified. Please check your inbox for the verification link.' 
                });
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                collegeId: user.collegeId,
                year: user.year,
                branch: user.branch,
                batch: user.batch,
                phone: user.phone,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error during login' });
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
 * @desc    Update user profile (Year, Phone, Branch, Batch)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.year = req.body.year || user.year;
            user.branch = req.body.branch || user.branch;
            user.batch = req.body.batch || user.batch;
            user.projectIdeas = req.body.projectIdeas || user.projectIdeas;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                collegeId: updatedUser.collegeId,
                year: updatedUser.year,
                branch: updatedUser.branch,
                batch: updatedUser.batch,
                phone: updatedUser.phone,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * @desc    Verify User Email
 * @route   GET /api/auth/verifyemail/:token
 * @access  Public
 */
const verifyEmail = async (req, res) => {
    try {
        // Hash the token from the URL to compare with the stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Verification link is invalid or has expired.' 
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'Email verified successfully! You can now log in.' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error during verification' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    verifyEmail,
};