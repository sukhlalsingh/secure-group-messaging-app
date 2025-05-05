// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Initialize Express app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:30001',  // your React app
        methods: ['GET', 'POST'],
        credentials: true,
    }
});


app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect('mongodb+srv://sukhlalsingh:sukhlalsingh@secueapp.5tnmgh6.mongodb.net/?retryWrites=true&w=majority&appName=secueapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Safe model creation
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    email: String,
    password: String,
}));

const Group = mongoose.models.Group || mongoose.model('Group', new mongoose.Schema({
    name: String,
    owner: mongoose.Schema.Types.ObjectId,
}));

const Message = mongoose.models.Message || mongoose.model('Message', new mongoose.Schema({
    groupId: mongoose.Schema.Types.ObjectId,
    sender: mongoose.Schema.Types.ObjectId,
    content: String,
}));




// Middleware to check authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) return res.status(401).send('Access denied');

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user; // Attach the decoded user info to the request
        next();
    });
};

// Routes
// Route to fetch all registered users

// --- USE THE ROUTES ---
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary
app.use('/api', userRoutes); // Now /api/users will be available



// Define route for creating a group
// Route to create a group
app.post('/api/groups/create', authenticateToken, async (req, res) => {
    const { groupName, members } = req.body;
    const userId = req.user._id; // Access the user ID from the decoded token

    // Validate input
    if (!groupName || !members || members.length === 0) {
        return res.status(400).send('Group name and members are required');
    }

    // Create a new group
    const newGroup = new Group({
        name: groupName,
        owner: userId,  // Set the owner as the logged-in user
        members: members,
    });

    try {
        const savedGroup = await newGroup.save();
        res.status(201).json({ group: savedGroup });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating group');
    }
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token, userId: user._id });
});

app.get('/api/groups', authenticateToken, async (req, res) => {
    const groups = await Group.find();
    res.json(groups);
});

app.get('/api/messages/:groupId', authenticateToken, async (req, res) => {
    const messages = await Message.find({ groupId: req.params.groupId });
    res.json(messages);
});

app.post('/api/smart-replies', authenticateToken, (req, res) => {
    // Implement smart replies logic here (using AI or predefined replies)
    const replies = ['Sure!', 'I will check it out.', 'Got it!'];
    res.json({ replies });
});

// DELETE /api/groups/:id
app.delete('/api/groups/:id', authenticateToken, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).send('Group not found');

        // Only owner can delete
        if (group.owner.toString() !== req.user.userId) {
            return res.status(403).send('Forbidden');
        }

        await group.deleteOne();
        res.sendStatus(204);
    } catch (err) {
        console.error('Error deleting group:', err);
        res.status(500).send('Server error');
    }
});

// Socket.io events
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', ({ groupId, message }) => {
        const newMessage = new Message(message);
        newMessage.save().then(() => {
            io.emit('newMessage', message);
        });
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

console.log('Socket.io server starting ');
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
