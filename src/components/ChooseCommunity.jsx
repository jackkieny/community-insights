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
            console.log(data);
            setCommunities(data);
            if (data.error === 'Not found') {
                navigate('/connect-skool');
            }
        };

        fetchData();
        fetchCommunities();
    }, []);


  return (
    <div className='choosecommunity-container'>
        <h1 style={{'textDecoration': 'underline'}}>SELECT A COMMUNITY</h1>
        <div className='choosecommunity-active-container'>
            {communities.map((community) => 
                community.archived === 0 && community.role === 'group-admin' &&
                <div
                    className='choosecommunity-active-card'
                    key={community.id}
                    style={{
                        borderColor: community.color,
                        backgroundImage: `url(${community.logo_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className='choosecommunity-active-card-text'>
                        {community.display_name}
                    </div>
                </div> 
            )}
        </div>

        <h3 style={{'textDecoration': 'underline'}}>UNAVAILABLE COMMUNITIES</h3>
        <div className='choosecommunity-inactive-container'>
            {communities.map((community) => 
                (community.archived === 1 || community.role !== 'group-admin') &&
                <div
                    className='choosecommunity-inactive-card'
                    key={community.id}
                    style={{
                        borderColor: community.color,
                        backgroundImage: `url(${community.logo_url})`,
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