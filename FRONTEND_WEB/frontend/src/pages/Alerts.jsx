import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, CalendarIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/api/v1/alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'validated': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'resolved': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20 animate-pulse';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Historique des Alertes</h1>
          <p className="text-gray-400 mt-1">Consultez et gérez toutes les détections générées par l'IA.</p>
        </div>
        <button className="flex items-center justify-center px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all">
          <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
          Exporter (PDF/CSV)
        </button>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <CalendarIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Aujourd'hui" className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-white focus:outline-none" />
            </div>
            <button className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-gray-300">
              <FunnelIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-4">ID Alerte</th>
                <th className="px-6 py-4">Personne</th>
                <th className="px-6 py-4">Unité de Capture</th>
                <th className="px-6 py-4">Date & Heure</th>
                <th className="px-6 py-4">Confiance IA</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-8 py-4 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="7" className="py-20 text-center text-gray-500">Chargement de l'historique...</td></tr>
              ) : alerts.length === 0 ? (
                <tr><td colSpan="7" className="py-20 text-center text-gray-500">Aucune alerte enregistrée.</td></tr>
              ) : alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-xs font-mono text-gray-500">#{alert.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-white">ID Personne: {alert.person_id}</p>
                    <div className={`mt-1 h-1 w-12 rounded-full ${alert.gravity_level === 'critical' ? 'bg-red-500' : alert.gravity_level === 'high' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-300">Caméra #{alert.camera_id}</td>
                  <td className="px-6 py-5 text-sm text-gray-400">{formatDate(alert.created_at)}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${alert.confidence * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-purple-400">{(alert.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(alert.status)}`}>
                      {alert.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-xs text-purple-400 font-bold hover:underline">CONSULTER</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
