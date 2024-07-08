import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Import styles
import '../styles/connectSkool.css'

// Import Assets
import { IoArrowBackCircle } from 'react-icons/io5';
import { FiEye, FiEyeOff } from "react-icons/fi";

function ConnectSkool() {
    const navigate = useNavigate()

    const [skoolEmail, setSkoolEmail] = useState('')
    const [skoolPassword, setSkoolPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)

    const viewPassword = () => {
        setShowPassword(!showPassword)
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/session', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.session === 'inactive') {
                navigate('/login');
                alert('Not logged in! Please log in to access the dashboard.');
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/connectskool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ skoolEmail, skoolPassword })
        });
        const data = await response.json();
        if (data.error === 'Invalid credentials') {
            alert('Invalid credentials. Please try again.');
        } else {
            navigate('/choose-community');
        }


    }


    return (
        <div className='connectskool-container'>
            <h1>
                <span>Connect to </span>
                <span style={{ 'color': 'var(--skool-S-color' }}>S</span>
                <span style={{ 'color': 'var(--skool-K-color' }}>k</span>
                <span style={{ 'color': 'var(--skool-O1-color' }}>o</span>
                <span style={{ 'color': 'var(--skool-O2-color' }}>o</span>
                <span style={{ 'color': 'var(--skool-L-color' }}>l</span>
            </h1>

            <IoArrowBackCircle className='connectskool-back-button' onClick={() => navigate('/login')} />

            <form className='connectskool-form' onSubmit={handleSubmit}>
                <div className="connectskool-input-container">
                    <label className='connectskool-label'>Skool Email</label>
                    <input className='connectskool-input'
                        type='text'
                        value={skoolEmail}
                        onChange={(e) => setSkoolEmail(e.target.value)}
                        placeholder='johnny.appleseed@mail.com'
                    />

                </div>

                <div className="connectskool-input-container">
                    <label className='connectskool-label'>Skool Password</label>
                    <div className='connectskool-password-container'>
                        <input className='connectskool-input'
                            type={showPassword ? 'text' : 'password'}
                            value={skoolPassword}
                            onChange={(e) => setSkoolPassword(e.target.value)}
                            placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                        />
                        <div className='connectskool-eye-icon'>
                            {showPassword ? <FiEyeOff onClick={() => viewPassword()} /> : <FiEye onClick={() => viewPassword()} />}
                        </div>

                    </div>
                </div>
                <button className='connectskool-button'>Connect to Skool</button>
            </form>
        </div>
    )
}

export default ConnectSkool