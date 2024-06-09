import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/dashboard.css'

function Dashboard() {
    const navigate = useNavigate()
 
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

    const handleLogOut = async () => {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.success) {
            navigate('/login');
            alert('You have been logged out.');
        }
    }

  return (
    <div>
        <h1>Dashboard</h1>
        <button onClick={ handleLogOut }>Log Out</button>
    </div>
  )
}

export default Dashboard