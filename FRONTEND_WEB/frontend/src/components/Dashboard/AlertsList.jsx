import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AlertsList = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAlerts = async () => {
      try {
        const response = await api.get('/api/v1/alerts?limit=5');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching recent alerts', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentAlerts();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  const getTimeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return `il y a ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours}h`;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="glass rounded-3xl overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-bold text-white text-lg">Alertes récentes</h3>
        <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full animate-pulse">DIRECT</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 text-sm py-10">Chargement...</p>
        ) : alerts.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-10">Aucune alerte récente.</p>
        ) : alerts.map((alert) => (
          <div key={alert.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-center">
              <div className="relative">
                <img 
                  src={alert.captured_photo_url ? (alert.captured_photo_url.startsWith('http') ? alert.captured_photo_url : `${import.meta.env.VITE_API_URL}${alert.captured_photo_url}`) : 'https://via.placeholder.com/100'} 
                  alt="Capture" 
                  className="w-12 h-12 rounded-xl object-cover" 
                />
                <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(alert.gravity_level)} rounded-full border-2 border-[#161922]`}></div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Alerte #{alert.id}</h4>
                  <span className="text-[10px] text-gray-500">{getTimeAgo(alert.created_at)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">Caméra: {alert.camera_id}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 py-1.5 bg-purple-600 text-[10px] font-bold text-white rounded-lg">VOIR</button>
              <button className="flex-1 py-1.5 bg-white/10 text-[10px] font-bold text-white rounded-lg">IGNORER</button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full py-4 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
        Voir tout l'historique
      </button>
    </div>
  );
};

export default AlertsList;
