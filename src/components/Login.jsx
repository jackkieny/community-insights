import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import '../styles/login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [response, setResponse] = useState(null)
    const navigate = useNavigate()

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

    return (
        <div className='loginpage-container'>
            <div className='loginpage-home-button'>
                <Link to='/' className='loginpage-home-button-link'>Home</Link>
            </div>

            <form className='login-form' onSubmit={handleSubmit}>
                <div className='login-form-header'>Login to<br/>Community Insights</div>

                <label className='login-form-label'>Email</label>
                <input 
                    type='text' 
                    className='login-form-input' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />

                <label className='login-form-label'>Password</label>
                <input 
                    type='password' 
                    className='login-form-input' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />

                <button className='login-form-button'>Login</button>
            </form>

            {response && response.error ? 
                <div className="loginpage-errormsg">
                    <p>Email or password is incorrect.</p>
                </div>
              : null}
            
            {response && response.success ?
                <div className="loginpage-successmsg">
                    <p>Login successful!</p>
                </div>
              : null
            }
        </div>
    )
}

export default Login