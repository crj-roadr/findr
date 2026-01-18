import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchInput = ({ label, onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const response = await axios.get(`http://localhost:3000/api/route/search`, {
            params: { q: query }
          });
          setSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setShowSuggestions(false);
    onSelect({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      display_name: place.display_name
    });
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect(null);
  };

  return (
    <div className="search-input-wrapper" ref={wrapperRef} style={{ marginBottom: '10px', position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${label}...`}
          style={{ width: '100%', padding: '8px', paddingRight: '30px', boxSizing: 'border-box' }}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
        />
        {query && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#999',
              padding: '0 5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {suggestions.map((place) => (
            <li 
              key={place.place_id} 
              onClick={() => handleSelect(place)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
