const express = require('express');
const router = express.Router();
const { scheduleMeeting, getAllMeetings } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, getAllMeetings)
    .post(protect, authorize('Admin', 'Head'), scheduleMeeting);

module.exports = router;
