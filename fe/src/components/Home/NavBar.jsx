import React from 'react'
import logo from '../../assets/full-logo-transparent.png'

function NavBar() {
  return (
    <div>
        <div style={{background: "black"}}>
            <h1>Logo</h1>
            <img src={logo} style={{border: "1px solid red", width: "20em"}}/>
        </div>
        <div>
            Page Buttons
        </div>
        <div>
            CTA Buttons
        </div>
    </div>
  )
}

export default NavBar