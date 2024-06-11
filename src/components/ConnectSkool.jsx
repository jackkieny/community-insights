import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/connectSkool.css'


function ConnectSkool() {
    const navigate = useNavigate()

    const [skoolEmail, setSkoolEmail] = useState('') 
    const [skoolPassword, setSkoolPassword] = useState('')

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
        }else{
            navigate('/choose-community');
        }


    }


  return (
    <div className='connectskool-container'>
        <h1>
            <span>Connect to </span>
            <span style={{'color':'var(--skool-S-color' }}>S</span>
            <span style={{'color':'var(--skool-K-color' }}>k</span>
            <span style={{'color':'var(--skool-O1-color' }}>o</span>
            <span style={{'color':'var(--skool-O2-color' }}>o</span>
            <span style={{'color':'var(--skool-L-color' }}>l</span>
        </h1>
        <form className='connectskool-form' onSubmit={handleSubmit}>
            <label>Skool Email</label>
            <input
                type='text' 
                className='connectskool-form-input'
                value={skoolEmail}
                onChange={(e) => setSkoolEmail(e.target.value)}
            />
            <label>Skool Password</label>
            <input
                type='password'
                className='connectskool-form-input'
                value={skoolPassword}
                onChange={(e) => setSkoolPassword(e.target.value)}
            />
            <button className='connectskool-form-button'>Connect to Skool</button>
        </form>
    </div>
  )
}

export default ConnectSkool