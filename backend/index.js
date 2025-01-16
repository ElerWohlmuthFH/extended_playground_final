
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// Example Wikipedia API Proxy
app.get('/api/bears', async (req, res) => {
    try {
        const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/bear');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching Wikipedia API:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/', (req, res) => {
    res.send('Backend is running and ready to serve API requests.');
});


app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:5001`);
});
