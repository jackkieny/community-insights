import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Import Styles
import "../styles/home/header.css";
import "../styles/home/content1.css";
import "../styles/home/content2.css";

// Import Content
import fullLogo from "../assets/logo+text+white.png";
import tempImg from "../assets/logo+white.png";

//Import Icons
import { GoArrowUpRight, GoArrowRight } from "react-icons/go";

function Home() {
    const navigate = useNavigate();

    function handleRequestAccess() { navigate('/request-access'); }

    return (
        <>
            {/* Home Page Header */}
            <div className="homepage-header-container">
                {/* Logo */}
                <div className="homepage-header-logo">
                    <img
                        src={fullLogo}
                        alt="Community Insights Logo"
                        className="homepage-header-logo-image"
                    />
                </div>

                {/* Nav Bar */}
                <div className="homepage-header-nav-container">
                    <div className="homepage-header-nav-links-container">
                        <Link to="/about" className="homepage-header-link">
                            How It Works
                        </Link>
                        <Link to="/about" className="homepage-header-link">
                            Pricing & Benefits
                        </Link>
                        <Link to="/about" className="homepage-header-link">
                            Use Cases
                        </Link>
                        <Link to="/about" className="homepage-header-link">
                            Blogs
                        </Link>
                    </div>
                </div>

                {/* Login */}
                <div className="homepage-header-login-container">
                    <button className="homepage-header-login-button">
                        <Link
                            to="/login"
                            className="homepage-header-login-button-link"
                        >
                            Login
                        </Link>
                    </button>
                    <button className="homepage-header-request-button">
                        <Link
                            to="/request-access"
                            className="homepage-header-request-button-link"
                        >
                            Request Access{" "}
                        </Link>
                        <GoArrowRight className="homepage-header-request-button-link-arrow" />
                    </button>
                </div>
            </div>

            {/* Content 1 - Title & Image*/}
            <div className="homepage-content1-container">
                <div className="homepage-content1-left">
                    <div className="homepage-content1-left-title">
                        <h1>Grow & Manage</h1>
                        <h1>
                            your{" "}
                            <span className="homepage-content1-left-title-skcmmty">
                                Skool Community
                            </span>
                        </h1>
                        <h1>with a single platform</h1>
                    </div>
                    <div className="homepage-content1-left-subtitle">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Saepe sed illum repellendus voluptate amet officia
                        quidem, aperiam deserunt? Eius ducimus ullam unde sint
                        perspiciatis reprehenderit facilis quam obcaecati,
                        exercitationem doloribus? Vero commodi odit facilis
                        incidunt sint repellat, expedita quos alias obcaecati
                        consequatur, fugiat totam officiis, earum dicta quam
                        doloremque minus?
                    </div>
                    <div className="homepage-content1-left-button">
                        <Link to="/request-access"></Link>
                        <button
                            className="homepage-content1-left-button-button"
                            onClick={handleRequestAccess}
                        >
                            Request Access
                            <GoArrowUpRight className="homepage-content1-left-button-button-arrow" />
                        </button>
                    </div>
                </div>
                <div className="homepage-content1-right">
                    <div className="homepage-content1-right-image-container">
                        {/* <img src={tempImg} className="homepage-content1-right-image"/> */}

                    </div>
                </div>
            </div>

            {/* Content 2 - Quick Stats */}
            <div className="homepage-content2-container">
              {/* Item One */}
              <div className="homepage-content2-item-container">
                <div className="homepage-content2-item-one">
                  <div className="homepage-content2-item-title">
                    <h1>100+</h1>
                  </div>
                  <div className="homepage-content2-item-subtitle">
                    <p><span>Community Owners</span></p>
                    <p>use our tool</p>
                  </div>
                </div>
              </div>
              {/* Item Two */}
              <div className="homepage-content2-item-container">
                <div className="homepage-content2-item-one">
                  <div className="homepage-content2-item-title">
                    <h1>478K</h1>
                  </div>
                  <div className="homepage-content2-item-subtitle">
                    <p><span>Members Managed</span></p>
                    <p>under our tool</p>
                  </div>
                </div>
              </div>
              {/* Item Three */}
              <div className="homepage-content2-item-container">
                <div className="homepage-content2-item-three">
                  <div className="homepage-content2-item-title">
                    <h1>5.6X</h1>
                  </div>
                  <div className="homepage-content2-item-subtitle">
                    <p>Increase In Member</p>
                    <p>Retention</p>
                  </div>
                </div>
              </div>
            </div>
        </>
    );
}

export default Home;
