import React, { useState, useEffect } from 'react';
import { PlusIcon, VideoCameraIcon, SignalIcon, MapPinIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const Cameras = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await api.get('/api/v1/cameras');
        setCameras(response.data);
      } catch (error) {
        console.error('Error fetching cameras', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCameras();
  }, []);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Réseau de Surveillance</h1>
          <p className="text-gray-400 mt-1">Supervisez l'état des caméras intelligentes déployées sur le territoire.</p>
        </div>
        <button className="flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/20 transition-all active:scale-95">
          <PlusIcon className="w-5 h-5 mr-2" />
          Ajouter une Caméra
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          [1,2,3,4].map(i => (
            <div key={i} className="glass p-6 rounded-3xl h-48 animate-pulse flex items-center justify-center">
              <div className="w-10 h-10 bg-white/5 rounded-full"></div>
            </div>
          ))
        ) : cameras.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500">
            Aucune caméra configurée.
          </div>
        ) : cameras.map((camera) => (
          <div key={camera.id} className="glass p-6 rounded-3xl group hover:border-purple-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${camera.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                <VideoCameraIcon className="w-6 h-6" />
              </div>
              <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${camera.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                {camera.status.toUpperCase()}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold text-white text-lg">{camera.name}</h3>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <MapPinIcon className="w-3.5 h-3.5 mr-1" />
                {camera.address || 'Position inconnue'}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center">
                <SignalIcon className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-xs text-gray-300 font-mono">En ligne</span>
              </div>
              <button className="text-xs text-purple-400 font-bold hover:text-purple-300 transition-colors">
                ACCÉDER AU FLUX
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cameras;
