import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AddPersonModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: 'M',
    gravity_level: 'low',
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('age', formData.age);
      data.append('gender', formData.gender);
      data.append('gravity_level', formData.gravity_level);
      
      for (let i = 0; i < photos.length; i++) {
        data.append('photos', photos[i]);
      }
      
      await api.post('/api/v1/persons/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Dossier créé avec succès !');
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error creating person', error);
      toast.error('Erreur lors de la création du dossier.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass w-full max-w-2xl rounded-[2.5rem] overflow-hidden animate-fade-in shadow-2xl border-white/10">
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white">Nouvelle Fiche de Recherche</h2>
            <p className="text-gray-400 text-sm mt-1">Saisissez les informations et uploadez les photos de référence.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Prénom</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white focus:ring-2 focus:ring-purple-600/30 transition-all"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nom</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white focus:ring-2 focus:ring-purple-600/30 transition-all"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Âge</label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white focus:ring-2 focus:ring-purple-600/30 transition-all"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sexe</label>
              <select
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white focus:ring-2 focus:ring-purple-600/30 transition-all appearance-none"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="M" className="bg-[#161922]">Masculin</option>
                <option value="F" className="bg-[#161922]">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Gravité</label>
              <select
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white focus:ring-2 focus:ring-purple-600/30 transition-all appearance-none"
                value={formData.gravity_level}
                onChange={(e) => setFormData({...formData, gravity_level: e.target.value})}
              >
                <option value="low" className="bg-[#161922]">Basse</option>
                <option value="high" className="bg-[#161922]">Haute</option>
                <option value="critical" className="bg-[#161922]">Critique</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Photos de référence</label>
            <div className="relative group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full py-10 border-2 border-dashed border-white/10 group-hover:border-purple-500/50 rounded-2xl bg-white/5 flex flex-col items-center justify-center transition-all">
                <CloudArrowUpIcon className="w-10 h-10 text-gray-500 group-hover:text-purple-400 transition-colors" />
                <p className="mt-4 text-sm text-gray-400">
                  {photos.length > 0 ? `${photos.length} photo(s) sélectionnée(s)` : 'Cliquez ou glissez vos photos ici'}
                </p>
                <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-bold">JPG, PNG (MAX. 5MB)</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Valider et Diffuser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPersonModal;
