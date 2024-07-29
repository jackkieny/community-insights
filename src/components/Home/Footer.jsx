import React from 'react'
import "../../styles/home/footer.css"
import fullLogo from "../../assets/logo+text+white+cropped.png"

function Footer() {
  return (
    <div className="footer-container">
        <div className="footer-content-container">
        </div>
        <div className="footer-logo-container">
            <img src={fullLogo} alt='Community Insights Logo' className='footer-logo'/>
        </div>
    </div>
  )
}

export default Footer