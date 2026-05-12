import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import AddPersonModal from '../components/Persons/AddPersonModal';
import SearchPersonModal from '../components/Persons/SearchPersonModal';

const Persons = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const fetchPersons = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/persons');
      setPersons(response.data);
    } catch (error) {
      console.error('Error fetching persons', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  const getGravityStyle = (gravity) => {
    switch (gravity) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestion des Personnes</h1>
          <p className="text-gray-400 mt-1">Gérez la base de données des personnes recherchées et disparues.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center justify-center px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all active:scale-95"
          >
            <MagnifyingGlassIcon className="w-5 h-5 mr-2 text-purple-400" />
            Identifier (IA)
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/20 transition-all active:scale-95"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouvelle Fiche
          </button>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, ville, ID..." 
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtres
            </button>
            <select className="bg-white/5 border border-white/5 rounded-xl text-sm text-gray-300 px-4 py-3 focus:outline-none hover:bg-white/10 transition-all">
              <option>Tous les statuts</option>
              <option>Disparu</option>
              <option>Retrouvé</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Identité</th>
                <th className="px-6 py-4">Âge / Sexe</th>
                <th className="px-6 py-4">Dernier Signalement</th>
                <th className="px-6 py-4">Niveau d'urgence</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin"></div>
                      <p className="mt-4 text-gray-500 text-sm">Chargement des dossiers...</p>
                    </div>
                  </td>
                </tr>
              ) : persons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-500">
                    Aucun dossier trouvé.
                  </td>
                </tr>
              ) : persons.map((person) => (
                <tr key={person.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <img 
                        src={person.photo_url ? (person.photo_url.startsWith('http') ? person.photo_url : `${import.meta.env.VITE_API_URL}${person.photo_url}`) : 'https://via.placeholder.com/200'} 
                        alt={person.first_name} 
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/5 group-hover:ring-purple-500/30 transition-all" 
                      />
                      <div className="ml-4">
                        <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{person.first_name} {person.last_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">ID: #SEC-{person.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-gray-300">{person.age} ans</p>
                    <p className="text-xs text-gray-500 mt-0.5">{person.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-gray-300">{person.last_location || 'Non renseigné'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getGravityStyle(person.gravity_level)}`}>
                      {person.gravity_level?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${person.status === 'missing' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}></div>
                      <span className="text-xs text-gray-300">{person.status === 'missing' ? 'Disparu' : 'Retrouvé'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddPersonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchPersons} 
      />

      <SearchPersonModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
};

export default Persons;
