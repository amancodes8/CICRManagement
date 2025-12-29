const User = require('../models/User');
const InviteCode = require('../models/InviteCode');
const crypto = require('crypto');

/**
 * @desc    Generate a new invitation code
 * @route   POST /api/admin/invite
 * @access  Private (Admin)
 */
const generateInviteCode = async (req, res) => {
    try {
        // Generate a random, URL-safe string
        const codeString = crypto.randomBytes(8).toString('hex');

        const newCode = new InviteCode({
            code: codeString,
            createdBy: req.user.id,
        });

        await newCode.save();
        res.status(201).json({ message: 'Invite code created successfully', code: newCode.code });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne(); // or user.remove() for older mongoose versions
        res.json({ message: 'User removed successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

/**
 * @desc    Update a user's role or details
 * @route   PUT /api/admin/users/:id
 * @access  Private (Admin)
 */
const updateUserByAdmin = async (req, res) => {
    const { name, email, role } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        const updatedUser = await user.save();
        res.json(updatedUser);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


module.exports = {
    generateInviteCode,
    getAllUsers,
    deleteUser,
    updateUserByAdmin
};
