import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/dashboard.css'

// Import React Icons
import { PiMonitorLight, PiCalendarBlank } from "react-icons/pi";
import { BsGear } from "react-icons/bs";
import { MdLogout } from "react-icons/md";

function Dashboard() {
    const navigate = useNavigate()

    const [currentTab, setCurrentTab] = useState('home')

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
        const fetchUser = async () => {
            const response = await fetch('/api/skool', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.error === 'Not found') {
                navigate('/connect-skool');
            }
        };

        fetchData();
        fetchUser();
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
        <div className='dashboard-container'>
            <div className="dashboard-sidebar">
                <button
                    id='home'
                    className="dashboard-sidebar-top"
                >
                    <PiMonitorLight className="dashboard-sidebar-icon" />
                    <span>Home</span>
                </button>
                <button
                    id='planner'
                    className="dashboard-sidebar-top"
                >
                    <PiCalendarBlank className="dashboard-sidebar-icon" />
                    <span>Planner</span>
                </button>
                <button
                    id='settings'
                    className="dashboard-sidebar-top"
                >
                    <BsGear className="dashboard-sidebar-icon" />
                    <span>Settings</span>
                </button>

                <button
                    className="dashboard-sidebar-bottom"
                    onClick={handleLogOut}
                >
                    <span>Log Out</span>
                    <MdLogout className="dashboard-sidebar-icon" />

                </button>
            </div>
            <div className="dashboard-main">
                <h1>Dashboard</h1>
            </div>
        </div>
    )
}

export default Dashboard