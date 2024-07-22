import React, { useState, useEffect } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Gif } from '@giphy/react-components';

import '../../../styles/dashboard/postFormComponentsStyles/gifs.css';

const giphyFetch = new GiphyFetch('');

function GiphyGrid() {
    const [gifs, setGifs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            const fetchGifs = async () => {
                let result;
                if (searchTerm === '') {
                    result = await giphyFetch.trending({ limit: 20 });
                } else {
                    result = await giphyFetch.search(searchTerm, { limit: 20 });
                }
                setGifs(result.data);
            };
            fetchGifs();
        }, 1000); // 1 second delay
        setTimeoutId(id);

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(id);
    }, [searchTerm]);

    return (
        <div className='gifs-container'>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='gifs-searchbar'
            />
            <div className='gifs-gifs-container'>
                {gifs.map((gif) => (
                    <Gif
                        key={gif.id}
                        gif={gif}
                        width={150}
                        height={125}
                        noLink={true}
                        hideAttribution={true}
                        className='gifs-gif'
                    />
                ))}
            </div>
        </div>
    );
}

export default GiphyGrid;