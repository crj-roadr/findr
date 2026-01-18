const express = require('express');
const axios = require('axios');
const router = express.Router();

const OSRM_API_URL = 'http://router.project-osrm.org/route/v1';

// Get route between coordinates
// Expects query params: start (lon,lat), end (lon,lat), profile (driving, walking, cycling)
router.get('/', async (req, res) => {
  const { start, end, profile = 'driving' } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: 'Start and end coordinates are required' });
  }

  try {
    // Format: /profile/start_lon,start_lat;end_lon,end_lat?overview=full&geometries=geojson
    const url = `${OSRM_API_URL}/${profile}/${start};${end}?overview=full&geometries=geojson`;
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('OSRM API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch route from OSRM' });
  }
});

// Proxy to Nominatim API for geocoding
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q,
        format: 'json',
        addressdetails: 1,
        limit: 5
      },
      headers: {
        'User-Agent': 'FindrApp/1.0'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Nominatim API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Nominatim' });
  }
});

module.exports = router;
