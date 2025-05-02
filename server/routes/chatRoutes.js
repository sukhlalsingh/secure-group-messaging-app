// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // adjust path if needed
const { authenticateToken } = require('../middleware/auth'); // if you have auth middleware

// Save a new message
router.post('/messages', authenticateToken, async (req, res) => {
    try {
        const { groupId, sender, content } = req.body;
        const message = new Message({ groupId, sender, content });
        await message.save();
        res.status(201).json({ message });
    } catch (err) {
        console.error('Failed to save message:', err);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Get all messages for a group
router.get('/messages/:groupId', authenticateToken, async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
        res.json({ messages });
    } catch (err) {
        console.error('Failed to fetch messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;
