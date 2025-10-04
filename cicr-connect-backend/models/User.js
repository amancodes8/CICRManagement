const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    collegeId: {
        type: String,
        required: [true, 'Please add a college ID'], // Added required validation
        unique: true, // Ensures no two users can have the same college ID
        trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String },
    year: { type: Number },
    branch: { type: String },
    batch: { type: String },
    role: {
        type: String,
        enum: ['Admin', 'Head', 'Member', 'Alumni'],
        default: 'Member'
    },
    currentProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    projectIdeas: [{ type: String }],
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

module.exports = mongoose.model('User', UserSchema);
