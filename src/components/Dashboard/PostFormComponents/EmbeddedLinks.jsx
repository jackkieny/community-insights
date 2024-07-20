import React, { useState } from 'react'
import '../../../styles/dashboard/postFormComponentsStyles/embeddedLinks.css'

function EmbeddedLinks({attachments, setAttachments, onSubmit}) {

    const [embeddedLink, setEmbeddedLink] = useState('')
    const [errorMessageDisplayed, setErrorMessageDisplayed] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    function isValidVideoLink(link) {
        const patterns = {
            youtube: /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/,
            vimeo: /^https:\/\/(www\.)?vimeo\.com\/.+$/,
            loom: /^https:\/\/(www\.)?loom\.com\/.+$/,
            wistia: /^https:\/\/([a-zA-Z0-9]+)\.wistia\.com\//,
        };

        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(link)) {
                return type; 
            }
        }

        return false; 
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if the embedded link is empty
        if (embeddedLink === '') {
            setErrorMessageDisplayed(true);
            setErrorMessage('Error: Embedded Link is empty');
            return;
        }

        // Use REGEX to check if the embedded link is valid
        const linkType = isValidVideoLink(embeddedLink);

        if (!linkType) {
            setErrorMessageDisplayed(true);
            setErrorMessage('Error: Invalid embedded link');
            return;
        }

        // Check if the embedded link is valid
        const fetchData = async () => {
            setErrorMessageDisplayed(false);
            setErrorMessage('');
            const response = await fetch('/api/checkembedlink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ embeddedLink, linkType })
            });
            const data = await response.json();

            if (data.error) {
                setErrorMessageDisplayed(true);
                setErrorMessage(data.error);
                return;
            } else {
                setAttachments([...attachments, data.html]);
                onSubmit();
                setErrorMessageDisplayed(false);
                setErrorMessage('');
            }
        }

        fetchData();
    }

    return (
        <div className='embeddedlink-container'>
            <div>{"YouTube \u2022 Vimeo \u2022 Loom \u2022 Wistia"}</div>
            <div className="embeddedlink-input-container">
                <input
                    className="embeddedlink-input"
                    type="text"
                    placeholder="Embed Link"
                    onChange={(e) => setEmbeddedLink(e.target.value)}
                />
            </div>
            <button
                className='embeddedlink-submit-button'
                onClick={handleSubmit}
            >
                Submit
            </button>
            {/* Error Message */}
            {errorMessageDisplayed && <p style={{ color: '#FF4040' }}>{errorMessage}</p>}
        </div>
    )
}

export default EmbeddedLinks
