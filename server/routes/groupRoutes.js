const express = require('express');
const router = express.Router();
const Group = require('./models/Group');

// POST /api/groups/create
router.post('/create', async (req, res) => {
    const { groupName, members } = req.body;

    if (!groupName || !members || members.length === 0) {
        return res.status(400).json({ message: 'Group name and members are required' });
    }
    console.log('Creating group with name:', groupName, 'and members:', members);
    try {
        const group = new Group({ name: groupName, members });
        await group.save();
        res.status(201).json({ group });
    } catch (err) {
        console.error('Error creating group:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
