import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  VideoCameraIcon, 
  ExclamationTriangleIcon, 
  ChartBarIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: HomeIcon },
    { name: 'Personnes disparues', href: '/persons', icon: UserGroupIcon },
    { name: 'Réseau Caméras', href: '/cameras', icon: VideoCameraIcon },
    { name: 'Alertes Critiques', href: '/alerts', icon: ExclamationTriangleIcon },
    { name: 'Analytiques', href: '/stats', icon: ChartBarIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col w-72 bg-[#161922] border-r border-white/5 min-h-screen">
      <div className="flex items-center px-8 h-24">
        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
          <ExclamationTriangleIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          SecureNet
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/10 text-white border border-purple-500/20 shadow-lg shadow-purple-500/5' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3.5 transition-colors ${
                isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'
              }`} />
              <span className="text-sm font-medium tracking-wide">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3.5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
