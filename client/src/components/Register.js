import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_BASE_URL + '/register', { email, password });
            navigate('/');
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            maxWidth: '400px',
            margin: '100px auto',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ marginBottom: '20px' }}>Register</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px'
                }}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px'
                }}
            />
            <button
                type="submit"
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Register
            </button>
        </form>

    );
};

export default Register;