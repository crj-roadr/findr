import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeafletMap from './components/LeafletMap';
import SearchInput from './components/SearchInput';
import 'leaflet/dist/leaflet.css';
import './index.css';

function App() {
  const [positions, setPositions] = useState({ start: null, end: null });
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (positions.start && positions.end) {
      calculateRoute();
    } else {
      setRouteData(null);
    }
  }, [positions]);

  const calculateRoute = async () => {
    try {
      setError(null);
      const start = `${positions.start.lng},${positions.start.lat}`;
      const end = `${positions.end.lng},${positions.end.lat}`;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/route`, {
        params: { start, end }
      });
      setRouteData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to calculate route');
    }
  };

  const reset = () => {
    setPositions({ start: null, end: null });
    setRouteData(null);
    setError(null);
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Findr</h1>
        <p>Interactive Route Explorer</p>
      </header>
      
      <div className="content">
        <div className="sidebar">
          <div className="instructions">
            <p>1. Search or click on map for <b>Origin</b>.</p>
            <p>2. Search or click on map for <b>Destination</b>.</p>
          </div>

          <div className="search-section">
            <SearchInput 
              key={`origin-${resetKey}`}
              label="Origin" 
              onSelect={(place) => setPositions(prev => ({ ...prev, start: place ? { lat: place.lat, lng: place.lng } : null }))} 
            />
            <SearchInput 
              key={`dest-${resetKey}`}
              label="Destination" 
              onSelect={(place) => setPositions(prev => ({ ...prev, end: place ? { lat: place.lat, lng: place.lng } : null }))} 
            />
          </div>
          
          <button className="reset-btn" onClick={reset}>Reset Selection</button>

          {error && <div className="error">{error}</div>}

          {routeData && routeData.routes && (
            <div className="route-info">
              <h2>Route Details</h2>
              <p><b>Distance:</b> {(routeData.routes[0].distance / 1000).toFixed(2)} km</p>
              <p><b>Duration:</b> {(routeData.routes[0].duration / 60).toFixed(0)} min</p>
            </div>
          )}
        </div>

        <div className="map-wrapper">
          <LeafletMap positions={positions} setPositions={setPositions} routeData={routeData} />
        </div>
      </div>
    </div>
  );
}

export default App;
