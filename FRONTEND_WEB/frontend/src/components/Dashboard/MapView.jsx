import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
  const [cameras, setCameras] = useState([]);
  const center = [6.1375, 1.2125]; // Lomé, Togo
  
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await api.get('/api/v1/cameras');
        // Filter cameras with valid coordinates
        const validCameras = response.data.filter(c => c.location_lat && c.location_lng);
        setCameras(validCameras);
      } catch (error) {
        console.error('Error fetching cameras for map', error);
      }
    };
    
    fetchCameras();
  }, []);

  return (
    <div className="glass rounded-3xl overflow-hidden h-[600px] relative">
      <div className="absolute top-6 left-6 z-[1000] p-4 bg-[#161922]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
        <h3 className="font-bold text-white text-sm">Vue Réseau Temps Réel</h3>
        <p className="text-xs text-gray-400 mt-1">Localisation des unités de capture</p>
      </div>
      
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cameras.map(camera => (
          <Marker key={camera.id} position={[camera.location_lat, camera.location_lng]}>
            <Popup>
              <div className="p-1">
                <p className="font-bold text-gray-800">{camera.name}</p>
                <p className="text-xs text-gray-500 mt-1">{camera.address}</p>
                <p className={`text-[10px] font-bold mt-1 ${camera.status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>
                  ● {camera.status === 'active' ? 'En ligne' : 'Maintenance'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
