const express = require('express');
const cors = require('cors');
const { ApifyClient } = require('apify-client');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing
app.use(cors({
  origin: 'https://instagram-reels-frontend.onrender.com', // Allow your frontend
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Replace with your Apify API token
const APIFY_API_TOKEN = "apify_api_gCq1ohmGFCYJ9xL07B5MmbeJ4AlsF00uEr2k";

// Initialize the ApifyClient
const client = new ApifyClient({
    token: APIFY_API_TOKEN,
});


let cachedReels = null;
let lastFetchedTime = null;

app.post('/fetch-reels', async (req, res) => {
    const now = new Date();

    // Check if data is still valid (less than 30 days old)
    if (cachedReels && lastFetchedTime && (now - lastFetchedTime < 30 * 24 * 60 * 60 * 1000)) {
        console.log('✅ Returning cached data');
        return res.json(cachedReels);
    }

    try {
        const { resultsLimit } = req.body;

        const input = {
            username: ['https://www.instagram.com/re_timer/', 'https://www.instagram.com/taholiving/'],
            resultsLimit: resultsLimit || 100,
        };

        const run = await client.actor('apify/instagram-reel-scraper').call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        // Cache the data
        cachedReels = items;
        lastFetchedTime = now;

        console.log('🆕 Fetched new data from Apify');
        res.json(items);
    } catch (error) {
        console.error('Error fetching or processing data:', error.message);
        res.status(500).json({ error: 'Failed to fetch reels data' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
