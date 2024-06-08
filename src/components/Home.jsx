import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  return (
    <>
      {/* Home Page Header */}
      <div className='homepage-header-container'>
        <div className='homepage-header-logo'>CommunityInsights</div>
        <div className='homepage-header-nav-container'>
          <Link to='/how-it-works' className='homepage-header-link'>How It Works</Link>
          <Link to='/pricing' className='homepage-header-link'>Pricing & Benefits</Link>
          <Link to='/use-cases' className='homepage-header-link'>Use Cases</Link>
          <Link to='/blogs' className='homepage-header-link'>Blogs</Link>
        </div>
        <div className='homepage-header-login-container'>
            <button className='homepage-header-login-button'>
              <Link to='/login' className='homepage-header-link'>Login</Link>
            </button>
        </div>
      </div>


      {/* Home Page Content */}

      <div className='homepage-content1-container'>
        Content
      </div>
    </>
  )
   
}

export default Home;