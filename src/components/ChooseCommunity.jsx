import React, { useState, useEffect } from 'react'
import '../styles/chooseCommunity.css'
import { useNavigate } from 'react-router-dom'


function ChooseCommunity() {
    const navigate = useNavigate();

    const [communities, setCommunities] = useState([]);

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
        const fetchCommunities = async () => {
            const response = await fetch('/api/get-communities', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setCommunities(data);
            if (data.error === 'Not found') {
                navigate('/connect-skool');
            }
        };

        fetchData();
        fetchCommunities();
    }, []);

    const handleSelectCommunity = async (communityId) => {
        const response = await fetch('/api/selectcommunity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ communityId })
        });
        const data = await response.json();
        if (data.success) {
            navigate('/dashboard');
        }
    }

    const activeCommunities = communities.filter(community => community.archived === 0 && community.role === 'group-admin')

    return (
        <div className='choosecommunity-container'>
            <h1 style={{ 'textDecoration': 'underline' }}>SELECT A COMMUNITY</h1>
            <div className='choosecommunity-active-container'>
                {activeCommunities.length > 0 ? (
                    activeCommunities.map((community) =>
                        <div
                            className='choosecommunity-active-card'
                            key={community.id}
                            style={{
                                borderColor: community.color,
                                backgroundImage: `url(${community.logo_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            onClick={() => handleSelectCommunity(community.id)}
                        >
                            <div className='choosecommunity-active-card-text'>
                                {community.display_name}
                            </div>
                        </div>
                    )
                ) : (
                    // If there are no communities that meet the criteria, render a button to go back to the /connectskool page
                    <div className="choosecommunity-nocommunities-container">
                        <div className="choosecommunity-nocommunities-title">
                            <h3 style={{ 'border': '1px solid red', 'padding': '10px' }}>Error! No communities available</h3>
                            <p>This is because you are not an admin of any of these communities or becuase these communities have been archived.</p>

                        </div>
                        <button
                            className='choosecommunity-nocommunities-button'
                            onClick={() => navigate('/connect-skool')}
                        >
                            Login with Different Account</button>
                    </div>
                )}
            </div>

            <h3 style={{ 'textDecoration': 'underline' }}>UNAVAILABLE COMMUNITIES</h3>
            <div className='choosecommunity-inactive-container'>
                {communities.map((community) =>
                    (community.archived === 1 || community.role !== 'group-admin') &&
                    <div
                        className='choosecommunity-inactive-card'
                        key={community.id}
                        style={{
                            borderColor: community.color,
                            backgroundImage: `url(${community.logo_url})`,
                            filter: 'grayscale(100%)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',

                        }}
                    >
                        <div className="choosecommunity-inactive-card-text">
                            {community.display_name}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ChooseCommunity