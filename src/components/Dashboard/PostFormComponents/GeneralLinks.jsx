import React from 'react'

import '../../../styles/dashboard/postFormComponentsStyles/generalLinks.css'

function GeneralLinks({setGLDisplayText, setGLLinkAddress, onSubmit}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    }

    return (
        <div className="generallink-container">
            {/* Display Text */}
            <div className="generallink-input-container">
                <input
                    className="generallink-input"
                    type="text"
                    placeholder="Display Text"
                    onChange={(e) => setGLDisplayText(e.target.value)}
                />
            </div>
            {/* Link Address */}
            <div className="generallink-input-container">
                <input
                    className='generallink-input'
                    style={{color: '#4DA6FF'}}
                    type="text"
                    placeholder='Link Address'
                    onChange={(e) => setGLLinkAddress(e.target.value)}
                />
            </div>
            {/* Submit Button */}
            <button
                className="generallink-submit-button"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    )
}

export default GeneralLinks