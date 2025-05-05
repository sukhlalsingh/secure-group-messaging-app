import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

const REACT_APP_API_ROOT_URL = process.env.REACT_APP_API_ROOT_URL;

const socket = io(REACT_APP_API_ROOT_URL, {
    transports: ['websocket'], // Ensure it uses the WebSocket transport
});

socket.on('connect', () => {
    console.log('Connected to server via WebSocket');
});

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Chat = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [smartReplies, setSmartReplies] = useState([]);
    const [typingStatus, setTypingStatus] = useState('');

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        axios.get(REACT_APP_API_BASE_URL + '/groups', {
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => setGroups(res.data));

        socket.on('newMessage', (msg) => {
            if (msg.groupId === selectedGroup?._id) setMessages(prev => [...prev, msg]);
        });

        socket.on('typing', ({ sender, groupId }) => {
            if (groupId === selectedGroup?._id && sender !== userId) {
                setTypingStatus('Someone is typing...');
                setTimeout(() => setTypingStatus(''), 1500);
            }
        });

        return () => {
            socket.off('newMessage');
            socket.off('typing');
        };
    }, [selectedGroup]);

    useEffect(() => {
        if (!selectedGroup) return;
        axios.get(`http://localhost:5000/api/messages/${selectedGroup._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setMessages(res.data)).catch(err => console.error('Error fetching messages', err));
    }, [selectedGroup]);

    const fetchSmartReplies = async (lastMessage) => {
        if (!lastMessage || !userId || !selectedGroup) return;
        try {
            const res = await axios.post('http://localhost:5000/api/smart-replies', {
                userId,
                groupId: selectedGroup._id,
                lastMessage,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSmartReplies(res.data.replies || []);
        } catch (err) {
            console.error('Failed to fetch smart replies', err);
        }
    };

    const handleSend = () => {
        if (!messageText) return;
        const msg = {
            sender: userId,
            groupId: selectedGroup._id,
            content: messageText,
        };
        socket.emit('sendMessage', { groupId: selectedGroup._id, message: msg });
        setMessages(prev => [...prev, msg]);
        setMessageText('');
        setSmartReplies([]);
    };



    const handleSmartReplyClick = (reply) => {
        setMessageText(reply);
    };

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.sender !== userId) {
                fetchSmartReplies(lastMessage.content);
            }
        }
    }, [messages]);

    const handleTyping = () => {
        if (selectedGroup) {
            socket.emit('typing', { groupId: selectedGroup._id, sender: userId });
        }
    };

    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const email = localStorage.getItem('userEmail'); // Retrieve from localStorage
        setUserEmail(email);
    }, []);

    const handleDelete = async (groupId) => {
        if (!window.confirm('Delete this group?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Refresh list & clear selection if needed
            fetchGroups();
            if (selectedGroup?._id === groupId) setSelectedGroup(null);
        } catch (err) {
            console.error('Delete failed', err.response || err);
            alert('Failed to delete group');
        }
    };
    //console.log('User email: ' + userEmail); // Debugging line
    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '20px' }}>Welcome, {userEmail}</h2>

            <div style={{ marginBottom: '15px' }}>
                <Link to="/create-group">
                    <button>Create New Group</button>
                </Link>
            </div>

            <div>
                <h3>Available Groups</h3>
                <table style={{
                    width: '100%',
                    marginTop: '20px',
                    textAlign: 'left',
                    borderCollapse: 'collapse',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                }}>
                    <thead style={{ backgroundColor: '#f5f5f5' }}>
                        <tr>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Group Name</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map(group => (
                            <tr key={group._id}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{group.name}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <button onClick={() => setSelectedGroup(group)}>Join</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedGroup && (
                <div style={{ marginTop: '40px' }}>
                    <h4 style={{ marginBottom: '20px' }}>
                        You are chatting in the group: <span style={{ color: '#007bff' }}>{selectedGroup.name}</span>
                    </h4>

                    <div style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        minHeight: '200px',
                        marginBottom: '15px',
                        backgroundColor: '#fafafa'
                    }}>
                        {messages.map((m, i) => (
                            <div key={i}><strong>{m.sender}</strong>: {m.content}</div>
                        ))}
                        {typingStatus && (
                            <div style={{ fontStyle: 'italic', color: 'gray', marginTop: '10px' }}>{typingStatus}</div>
                        )}
                    </div>

                    {smartReplies.length > 0 && (
                        <div style={{ margin: '10px 0' }}>
                            <strong>Smart Replies:</strong>
                            {smartReplies.map((reply, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSmartReplyClick(reply)}
                                    style={{ margin: '5px', padding: '5px 10px' }}
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={handleTyping}
                            placeholder="Type your message..."
                            style={{ flex: 1, padding: '10px' }}
                        />
                        <button onClick={handleSend} style={{ padding: '10px 20px' }}>Send</button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Chat;