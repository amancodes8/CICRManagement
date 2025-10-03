const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    meetingType: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true
    },
    details: {
        topic: { type: String, required: true },
        location: { type: String, required: true }, // Can be a physical venue or a meeting URL
        agenda: { type: String }
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    organizedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', MeetingSchema);
