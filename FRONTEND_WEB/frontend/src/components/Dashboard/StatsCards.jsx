import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  VideoCameraIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const StatsCards = () => {
  const [stats, setStats] = useState([
    { name: 'Personnes recherchées', key: 'total_persons', value: '0', icon: UserGroupIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Caméras actives', key: 'active_cameras', value: '0', icon: VideoCameraIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Alertes en attente', key: 'pending_alerts', value: '0', icon: ExclamationTriangleIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Incidents résolus', key: 'resolved_incidents', value: '0', icon: CheckCircleIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/v1/dashboard/summary');
        const data = response.data;
        
        setStats(prev => prev.map(stat => ({
          ...stat,
          value: data[stat.key]?.toString() || '0'
        })));
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div key={item.name} className="glass p-6 rounded-3xl group hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center">
            <div className={`p-4 rounded-2xl ${item.bg} mr-5 group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">{item.name}</p>
              <h3 className="text-2xl font-bold text-white">{item.value}</h3>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${item.color.replace('text-', 'bg-')} w-1/3 opacity-50`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
