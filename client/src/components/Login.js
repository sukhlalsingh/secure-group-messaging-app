import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
          
            const res = await axios.post(API_BASE_URL + '/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('userEmail', res.data.email); // ✅ ADD THIS LINE

            navigate('/chat');
        } catch (err) {
            alert('Login failed');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register'); // 👈 navigate to Register page
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    padding: '40px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    width: '300px',
                    textAlign: 'center'
                }}
            >
                <h1 style={{ marginBottom: '20px' }}>Login</h1>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '15px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
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
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Login
                </button>

                <div style={{ marginTop: '20px' }}>
                    <p style={{ marginBottom: '10px' }}>Don't have an account?</p>
                    <button
                        type="button"
                        onClick={handleRegisterRedirect}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;