import React, { useState } from 'react';
import axios from 'axios';

const InstagramReelsFetcher = () => {
    const [reels, setReels] = useState([]);
    const [filteredReels, setFilteredReels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [playCountFilter, setPlayCountFilter] = useState('all');
    const [likeCountFilter, setLikeCountFilter] = useState('all');


    const fetchReels = async () => {
        setLoading(true);
        setError('');
        setReels([]);
        setFilteredReels([]);
    
        try {
            const response = await axios.post('http://localhost:5000/fetch-reels', {
                // no need to send anything now
                resultsLimit: 100,
            });
            setReels(response.data);
            setFilteredReels(response.data);
        } catch (err) {
            console.error('Error fetching Reels data:', err);
            setError('Failed to fetch Reels data. Please try again.');
        }
    
        setLoading(false);
    };

    


    const applyFilters = () => {
        let filtered = [...reels];

        if (playCountFilter !== 'all') {
            const [min, max] = playCountFilter.split('-').map(Number);
            filtered = filtered.filter(
                (reel) => reel.videoPlayCount >= min && reel.videoPlayCount <= max
            );
        }

        if (likeCountFilter !== 'all') {
            const [min, max] = likeCountFilter.split('-').map(Number);
            filtered = filtered.filter(
                (reel) => reel.likesCount >= min && reel.likesCount <= max
            );
        }

        setFilteredReels(filtered);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Instagram Reels Fetcher</h1>
            <button
                onClick={fetchReels}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Fetch Reels
            </button>

            <div style={{ marginTop: '20px' }}>
                <label style={{ marginRight: '10px' }}>Filter by Play Count:</label>
                <select
                    value={playCountFilter}
                    onChange={(e) => setPlayCountFilter(e.target.value)}
                    style={{ padding: '5px', marginRight: '20px' }}
                >
                    <option value="all">All</option>
                    <option value="1000-10000">1K - 10K</option>
                    <option value="10000-100000">10K - 100K</option>
                    <option value="100000-10000000">1M - 10M</option>
                </select>

                <label style={{ marginRight: '10px' }}>Filter by Like Count:</label>
                <select
                    value={likeCountFilter}
                    onChange={(e) => setLikeCountFilter(e.target.value)}
                    style={{ padding: '5px' }}
                >
                    <option value="all">All</option>
                    <option value="1000-10000">1K - 10K</option>
                    <option value="10000-100000">10K - 100K</option>
                    <option value="1000000-10000000">1M - 10M</option>
                </select>

                <button
                    onClick={applyFilters}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28A745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginLeft: '20px',
                    }}
                >
                    Apply Filters
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '20px',
                    marginTop: '20px',
                }}
            >
                {filteredReels.map((reel, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                        <a href={reel.url}>
                            <video
                                src={reel.videoUrl}
                                controls
                                style={{ width: '100%', borderRadius: '10px' }}
                            ></video>
                            <p>Likes: {reel.likesCount}</p>
                            <p>View Count: {reel.videoViewCount}</p>
                            <p>Play Count: {reel.videoPlayCount}</p>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstagramReelsFetcher;