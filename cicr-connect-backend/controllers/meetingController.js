const Meeting = require('../models/Meeting');

/**
 * @desc    Schedule a new meeting
 * @route   POST /api/meetings
 * @access  Private (Heads, Admins)
 */
const scheduleMeeting = async (req, res) => {
    const { title, meetingType, details, startTime, endTime, participants } = req.body;

    try {
        const meeting = new Meeting({
            title,
            meetingType,
            details,
            startTime,
            endTime,
            participants,
            organizedBy: req.user.id
        });

        const createdMeeting = await meeting.save();

        // TODO: Integrate notification service (Email/WhatsApp) here

        res.status(201).json(createdMeeting);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Get all meetings
 * @route   GET /api/meetings
 * @access  Private
 */
const getAllMeetings = async (req, res) => {
    try {
        // Find meetings where the logged-in user is a participant or organizer
        const meetings = await Meeting.find({
            $or: [
                { participants: req.user.id },
                { organizedBy: req.user.id }
            ]
        }).populate('organizedBy', 'name').populate('participants', 'name email');
        
        res.json(meetings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    scheduleMeeting,
    getAllMeetings,
};
