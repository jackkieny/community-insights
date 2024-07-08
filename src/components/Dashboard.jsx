import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/dashboard.css'

// Import Dashboard Components
import DashboardHome from './Dashboard/DashboardHome';
import Planner from './Dashboard/Planner';
import Settings from './Dashboard/Settings';

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
    }, [currentTab, navigate]);

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

    function handleTabChange(event) {
        setCurrentTab(event.currentTarget.id);
    }
    
    return (
        <div className='dashboard-container'>
            
            {/* SIDEBAR */}
            <div className="dashboard-sidebar">
                <button
                    id='home'
                    className="dashboard-sidebar-top"
                    onClick={handleTabChange.bind(this)}
                >
                    <PiMonitorLight className="dashboard-sidebar-icon" />
                    <span>Home</span>
                </button>
                <button
                    id='planner'
                    className="dashboard-sidebar-top"
                    onClick={handleTabChange.bind(this)}
                >
                    <PiCalendarBlank className="dashboard-sidebar-icon" />
                    <span>Planner</span>
                </button>
                <button
                    id='settings'
                    className="dashboard-sidebar-top"
                    onClick={handleTabChange.bind(this)}
                >
                    <BsGear className="dashboard-sidebar-icon" />
                    <span>Settings</span>
                </button>

                {/* Log Out Button */}
                <button
                    className="dashboard-sidebar-bottom"
                    onClick={handleLogOut}
                >
                    <span>Log Out</span>
                    <MdLogout className="dashboard-sidebar-icon" />

                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="dashboard-main">
                {currentTab === 'home' && (
                    <DashboardHome />
                )}
                {currentTab === 'planner' && (
                    <Planner />
                )}
                {currentTab === 'settings' && (
                    <Settings />
                )}
            </div>
        </div>
    )
}

export default Dashboard