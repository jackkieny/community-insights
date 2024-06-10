import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import '../styles/home.css';

import { GoArrowUpRight } from "react-icons/go";

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
        <div className='homepage-content1-left-container'>
          <div className="homepage-content1-left-title">
            <p>Grow & Manage</p>
            <p>your <span className='homepage-content1-left-title-skoolcommunity'>Skool Community</span></p>
            <p>with a single platform</p>

          </div>
          <div className="homepage-content1-left-body">
            <p>
              Community engagement matters. Drastically improve your community member’s experience by accessing an insightful analytics dashboard and post planning calendar to automate your communities growth and management.
            </p>
          </div>
          <div className='homepage-content1-left-request-container'>
            <button className='homepage-content1-left-requestButton'>
              REQUEST ACCESS
              <GoArrowUpRight className='homepage-content1-left-requestButton-arrow'/>
            </button>
          </div>

        </div>
        <div className='homepage-content1-right-container'>Some image here</div>
      </div>
    </>
  )
   
}

export default Home;