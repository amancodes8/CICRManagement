const mongoose = require('mongoose');

const InviteCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    // Set code to expire in 7 days by default
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    },
}, { timestamps: true });

module.exports = mongoose.model('InviteCode', InviteCodeSchema);
