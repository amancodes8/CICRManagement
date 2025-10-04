const User = require('../models/User');

/**
 * @desc    Get logged in user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
    // req.user is attached from the auth middleware, so this finds the logged-in user
    const user = await User.findById(req.user.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.year = req.body.year || user.year;
        user.branch = req.body.branch || user.branch;
        user.batch = req.body.batch || user.batch;
        user.projectIdeas = req.body.projectIdeas || user.projectIdeas;

        const updatedUser = await user.save();
        
        // Return the full updated user object (excluding password)
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json(userResponse);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
};

