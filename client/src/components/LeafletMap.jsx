import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in leaflet with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationMarker({ positions, setPositions }) {
  useMapEvents({
    click(e) {
        if (positions.start && positions.end) {
            // Reset if both set
            setPositions({ start: e.latlng, end: null });
        } else if (!positions.start) {
            setPositions({ ...positions, start: e.latlng });
        } else {
            setPositions({ ...positions, end: e.latlng });
        }
    },
  });

  return (
    <>
      {positions.start && <Marker position={positions.start}><Popup>Origin</Popup></Marker>}
      {positions.end && <Marker position={positions.end} icon={orangeIcon}><Popup>Destination</Popup></Marker>}
    </>
  );
}

const MapUpdater = ({ positions, routeData }) => {
  const map = useMap();

  React.useEffect(() => {
    if (routeData && routeData.routes && routeData.routes[0].geometry) {
       // Create bounds from route coordinates
       const coordinates = routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
       const bounds = L.latLngBounds(coordinates);
       map.fitBounds(bounds, { padding: [50, 50] });
    } else if (positions.start && positions.end) {
      const bounds = L.latLngBounds([positions.start, positions.end]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, routeData, map]);

  return null;
};

const LeafletMap = ({ positions, setPositions, routeData }) => {
  const center = [51.505, -0.09]; // Default center (London)

  return (
    <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker positions={positions} setPositions={setPositions} />
      <MapUpdater positions={positions} routeData={routeData} />
      {routeData && routeData.routes && routeData.routes[0].geometry && (
          <Polyline 
            positions={routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]])} 
            color="blue" 
          />
      )}
    </MapContainer>
  );
};
// Note: OSRM returns encoded polyline. We need decoding. 
// Leaflet doesn't decode default OSRM polyline automatically usually without plugin or decode function.
// Actually OSRM 'geometries=geojson' is easier. I used that in backend.
// So geometry will be GeoJSON LineString.

export default LeafletMap;
