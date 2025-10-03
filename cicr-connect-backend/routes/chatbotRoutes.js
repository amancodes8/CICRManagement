const express = require('express');
const router = express.Router();
const { summarizePage } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

router.post('/summarize', protect, summarizePage);

module.exports = router;
