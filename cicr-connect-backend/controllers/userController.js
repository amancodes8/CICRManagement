const User = require('../models/User');

// @desc    Get user profile (this function might already exist or be in authController)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    // req.user is populated by the 'protect' middleware from the token
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// --- NEW FUNCTION START ---
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        // Update fields if they are provided in the request body
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.year = req.body.year || user.year;
        user.branch = req.body.branch || user.branch;
        user.batch = req.body.batch || user.batch;
        
        // Handle projectIdeas as an array of strings
        if (req.body.projectIdeas) {
            user.projectIdeas = Array.isArray(req.body.projectIdeas) 
                ? req.body.projectIdeas 
                : [req.body.projectIdeas];
        }

        // We explicitly do not update email, password, or role here for security.
        // Those actions should have their own separate, more secure endpoints.

        const updatedUser = await user.save();
        
        // Return the updated user object, excluding the password
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json(userResponse);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};
// --- NEW FUNCTION END ---


module.exports = {
    getUserProfile,
    updateUserProfile, // Export the new function
};

