import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateGroup.css'; // Assuming you have some CSS for styling
const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [members, setMembers] = useState([]); // List of selected user IDs
    const [userList, setUserList] = useState([]); // List of all users
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(API_BASE_URL + '/users');
                console.log(response.data); // Log to inspect the structure of the response

                // Directly set the userList to the response data (which is an array of users)
                setUserList(response.data);
            } catch (err) {
                setError('Failed to load users');
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    // Handle member selection
    const handleMemberSelection = (userId) => {
        setMembers((prevMembers) =>
            prevMembers.includes(userId)
                ? prevMembers.filter((id) => id !== userId) // Remove if already selected
                : [...prevMembers, userId] // Add if not selected
        );
    };

    const handleCreateGroup = async () => {


        if (!groupName || members.length === 0) {
            alert('Please provide a group name and select members');
            return;
        }

        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

        if (!token) {
            alert('You must be logged in to create a group.');
            return;
        }


        try {
            const response = await axios.post(
                'http://localhost:5000/api/groups/create',
                {
                    groupName,
                    members,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the token in the Authorization header
                    },
                }
            );
            alert('Group created: ' + response.data.group.name);
            navigate('/chat');
        } catch (err) {
            console.error(err);
            alert('Failed to create group');
        }
    };


    return (
        <div className="create-group-container">
            <h2>Create Group</h2>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="input-field"
                />
            </div>

            <h3>Select Members</h3>

            {error && <p className="error-text">{error}</p>}

            <div className="user-list">
                {userList.length === 0 ? (
                    <p>Loading users...</p>
                ) : (
                    userList.map((user) => (
                        <div key={user._id} className="user-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={members.includes(user._id)}
                                    onChange={() => handleMemberSelection(user._id)}
                                />
                                {user.email}
                            </label>
                        </div>
                    ))
                )}
            </div>

            <button onClick={handleCreateGroup} className="create-button">
                Create
            </button>
        </div>

    );
};

export default CreateGroup;
