import React from 'react'
import { Link } from 'react-router-dom'
import './error404.css'

function Error404() {
  return (
    <div className='error404-container'>
      <div className="error404-content">
        <p className="error404-number">404</p>
        <h1>Page Not Found</h1>
        <p className="error404-message">
            Oops, it seems like the page you're looking for isn't available or doesn't exist.
        </p>
        <p className="error404-message">
            Please check the URL and try again.
        </p>
        <button className="error404-button">
            <Link to="/" className="error404-link">HOME</Link>
        </button>
      </div>
    </div>
  )
}

export default Error404 
