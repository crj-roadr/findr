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

module.exports = router;
