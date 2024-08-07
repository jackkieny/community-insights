import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

// Import styles
import '../styles/login.css'

// Import Assets
import fullLogo from '../assets/logo+text+white+cropped.png'
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoArrowBackCircle } from "react-icons/io5";
import { BsArrowRight } from "react-icons/bs";

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [response, setResponse] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    const viewPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        setResponse(data);
        if (data.success) {
            navigate('/dashboard');
        }
    }

    function errorMessage() {
        return (
            <div className='loginpage-errormsg'>
                {response.error}
            </div>
        )
    }

    return (
        <div className='loginpage-container'>
            <IoArrowBackCircle className='loginpage-back-button' onClick={() => navigate('/')} />
            <img src={fullLogo} className='loginpage-logo' />

            <form className='login-form'>
                <div className='loginpage-input-container'>
                    <label className='loginpage-label'>Email</label>
                    <input className='loginpage-input'
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='mail@example.com'
                    />
                </div>

                <div className='loginpage-input-container'>
                    <label className='loginpage-label'>Password</label>
                    <div className='loginpage-password-container'>
                        <input className='loginpage-input'
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                        />
                    </div>
                    <div className='loginpage-eye-icon'>
                        {showPassword ? <FiEyeOff onClick={viewPassword} /> : <FiEye onClick={viewPassword} />}
                    </div>
                </div>

                <button className='loginpage-button' onClick={handleSubmit}>LOG IN <BsArrowRight className='loginpage-button-arrow'/></button>
            </form>

            { response && response.error ? errorMessage() : null }
        </div>
    )
}

export default Login