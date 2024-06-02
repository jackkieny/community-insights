import React from 'react'
import { Link } from 'react-router-dom';

function About() {
  return (
    <>
        <div>About</div>
        <Link to="/" style={{"color": "skyblue"}}>Home</Link>
    </>
  )
}

export default About