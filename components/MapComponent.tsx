"use client";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Custom Hook to update the map's view when new coordinates are provided
const ChangeMapView = ({ coords }) => {
  const map = useMap();
  map.setView(coords, 13); // Set the map view to new coordinates
  return null;
};

const MapWithCheckpoints = ({
  longitude,
  latitude,
}: {
  longitude: string;
  latitude: string;
}) => {
  // Default locations (centered on India)
  const [coordinates, setCoordinates] = useState({
    lat: latitude,
    lon: longitude,
  });
  const [markers, setMarkers] = useState([]);

  // Update coordinates on input change
  const handleInputChange = (e) => {
    setCoordinates({
      ...coordinates,
      [e.target.name]: parseFloat(e.target.value),
      addMarker,
    });
  };

  // Add a new marker when "Add Marker" button is clicked
  const addMarker = () => {
    setMarkers([...markers, { lat: coordinates.lat, lon: coordinates.lon }]);
  };

  return (
    <div>
      {/* Input for Latitude and Longitude */}
      <div>
        <button onClick={addMarker}>Add Marker</button>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[coordinates.lat, coordinates.lon]}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Change map view based on new coordinates */}
        <ChangeMapView coords={[coordinates.lat, coordinates.lon]} />

        {/* Render markers */}
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lon]} />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapWithCheckpoints;
