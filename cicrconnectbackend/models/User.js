const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Built-in Node module for token generation

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    collegeId: {
        type: String,
        required: [true, 'Please add a college ID'],
        unique: true,
        trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String },
    year: { type: Number },
    branch: { type: String },
    batch: { type: String },
    role: {
        type: String,
        enum: ['Admin', 'Head', 'User', 'Alumni'], 
        default: 'User'
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], 
    projectIdeas: [{ type: String }],
    
    // --- FIELDS FOR MANDATORY EMAIL VERIFICATION ---
    isVerified: {
        type: Boolean,
        default: false, // User cannot login until this is true
    },
    verificationToken: String,
    verificationTokenExpires: Date,

}, { timestamps: true });

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- NEW METHOD: GENERATE VERIFICATION TOKEN ---
UserSchema.methods.createVerificationToken = function() {
    // Generate a random 32-character hex string
    const token = crypto.randomBytes(20).toString('hex');

    // Hash the token to save it in the database (security best practice)
    this.verificationToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Token expires in 24 hours
    this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    return token; // Return the unhashed token to send via email
};

module.exports = mongoose.model('User', UserSchema);