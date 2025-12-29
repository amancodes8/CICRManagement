const Project = require('../models/Project');
const Meeting = require('../models/Meeting');

/**
 * @desc    Summarize a page (project or meeting)
 * @route   POST /api/chatbot/summarize
 * @access  Private
 */
const summarizePage = async (req, res) => {
    const { pageType, pageId } = req.body; // e.g., pageType: 'project', pageId: '...'

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: 'Gemini API key not configured.' });
    }

    try {
        let contextText = '';
        if (pageType === 'project') {
            const project = await Project.findById(pageId).populate('lead', 'name').populate('team', 'name');
            if (!project) return res.status(404).json({ message: 'Project not found.' });
            contextText = `Project Title: ${project.title}. Description: ${project.description}. Lead by: ${project.lead.name}. Team members: ${project.team.map(m => m.name).join(', ')}. Status: ${project.status}.`;
        } else if (pageType === 'meeting') {
            const meeting = await Meeting.findById(pageId).populate('organizedBy', 'name');
            if (!meeting) return res.status(404).json({ message: 'Meeting not found.' });
            contextText = `Meeting: ${meeting.title}. Type: ${meeting.meetingType}. Topic: ${meeting.details.topic}. Organized by: ${meeting.organizedBy.name}. Scheduled for: ${new Date(meeting.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}.`;
        } else {
            return res.status(400).json({ message: 'Invalid page type.' });
        }

        const prompt = `Provide a concise, one-paragraph summary of the following: ${contextText}`;
        
        // --- Gemini API Call ---
        // Using fetch to call the Gemini API
        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            return res.status(response.status).json({ message: 'Failed to get summary from Gemini API.', details: errorData });
        }

        const result = await response.json();
        const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a summary for this.";

        res.status(200).json({ summary });

    } catch (err) {
        console.error('Summarize Endpoint Error:', err);
        res.status(500).send('Server Error');
    }
};

module.exports = { summarizePage };
