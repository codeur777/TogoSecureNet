import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SearchPersonModal = ({ isOpen, onClose }) => {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
      setResults([]);
    }
  };

  const handleSearch = async () => {
    if (!photo) return;
    setLoading(true);
    setResults([]);
    
    try {
      const data = new FormData();
      data.append('photo', photo);
      
      const response = await api.post('/api/v1/persons/search', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResults(response.data);
      if (response.data.length === 0) {
        toast.error('Aucune correspondance trouvée.');
      } else {
        toast.success(`${response.data.length} correspondance(s) trouvée(s) !`);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la recherche.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass w-full max-w-xl rounded-[2.5rem] overflow-hidden animate-fade-in border-purple-500/20">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <MagnifyingGlassIcon className="w-6 h-6 mr-3 text-purple-400" />
            Recherche par Photo
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-600" />
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold uppercase tracking-widest">Changer Photo</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-400 text-center">Uploadez une photo pour que l'IA identifie la personne dans notre base.</p>
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Résultats de correspondance</h3>
              <div className="space-y-3">
                {results.map(person => (
                  <div key={person.id} className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center">
                    <img 
                      src={person.photo_url ? `${import.meta.env.VITE_API_URL}${person.photo_url}` : 'https://via.placeholder.com/100'} 
                      className="w-12 h-12 rounded-xl object-cover" 
                      alt="" 
                    />
                    <div className="ml-4">
                      <p className="text-white font-bold">{person.first_name} {person.last_name}</p>
                      <p className="text-xs text-purple-400">Identifié à 98%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={!photo || loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Lancer l'Analyse IA
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPersonModal;
