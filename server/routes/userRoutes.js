const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust the path as necessary

// Get all registered users
router.get('/users', async (req, res) => {
    console.log('Fetching all registered users...'); // Server-side debug
    try {
        const users = await User.find(); // Assuming you have users in MongoDB
        res.json(users); // Return users directly (no { users } wrapper needed)
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

module.exports = router;