const User = require('../models/User');
const InviteCode = require('../models/InviteCode');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

/**
 * @desc    Generate a new invitation code
 */
exports.generateInviteCode = async (req, res) => {
    try {
        const codeString = crypto.randomBytes(4).toString('hex').toUpperCase();

        const newCode = new InviteCode({
            code: codeString,
            createdBy: req.user.id, // Matches your Schema
        });

        await newCode.save();
        res.status(201).json({ message: 'Invite code created successfully', code: newCode.code });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

/**
 * @desc    Send Invite Code to User Email
 */
exports.sendInviteEmail = async (req, res) => {
    const { email, inviteCode } = req.body;

    if (!email || !inviteCode) {
        return res.status(400).json({ message: 'Email and Invite Code are required' });
    }

    try {
        // Check using 'isUsed' to match your schema
        const codeRecord = await InviteCode.findOne({ code: inviteCode, isUsed: false });
        
        if (!codeRecord) {
            const exists = await InviteCode.findOne({ code: inviteCode });
            return res.status(404).json({ 
                message: exists?.isUsed ? 'Invite code already used' : 'Invite code not found' 
            });
        }

        const emailMessage = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
                <h2 style="color: #2563eb;">Lab Invitation</h2>
                <p>You've been invited to join <strong>CICR Connect</strong>.</p>
                <p>Use this code during registration:</p>
                <div style="background: #f8fafc; border: 2px dashed #cbd5e1; padding: 16px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${inviteCode}</span>
                </div>
                <p>Register at: <a href="http://localhost:5173/login">CICR Portal</a></p>
            </div>
        `;

        await sendEmail({ email, subject: 'CICR Connect Invitation', message: emailMessage });

        res.status(200).json({ success: true, message: `Invite sent to ${email}` });
    } catch (err) {
        res.status(500).json({ message: 'Error sending email.' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) { res.status(500).send('Server error'); }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (err) { res.status(500).send('Server error'); }
};

exports.updateUserByAdmin = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) { res.status(500).send('Server error'); }
};