import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

function Home() {

    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        fetch('/api/time')
            .then(res => res.json())
            .then(data => {
                setCurrentTime(data.time)
            })
            .catch(err => console.log(err));
    }, [])
  return (
    <div>
        <h1>Home</h1>
        <p>Welcome to the Home page!</p>
        <p>The current time is</p>
        <p>{currentTime}</p>
        <Link to="/about" style={{"color": "skyblue"}}>About</Link>
    </div>
  )
}

export default Home