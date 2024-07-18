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
            <p className="generallink-hint">
                <i>Hint:</i> You can insert links manually <br/>
                by using the markdown format: <br/>
                <b>[Display Text]</b><i style={{color: '#4DA6FF'}}><ins>(Link Address)</ins></i>
            </p>
        </div>
    )
}

export default GeneralLinks