import React, { useState, useRef } from 'react';
import { XMarkIcon, PhotoIcon, CloudArrowUpIcon, CameraIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
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
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  if (!isOpen) return null;

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Impossible d'accéder à la caméra.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setPhotos([file]); // On remplace par la capture
      stopCamera();
      toast.success('Photo capturée !');
    }, 'image/jpeg');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) {
        toast.error('Veuillez ajouter au moins une photo.');
        return;
    }
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
      <div className="glass w-full max-w-2xl rounded-[2.5rem] overflow-hidden animate-fade-in shadow-2xl border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white">Nouvelle Fiche de Recherche</h2>
            <p className="text-gray-400 text-sm mt-1">Saisissez les informations et ajoutez une photo de référence.</p>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }} className="p-2 hover:bg-white/10 rounded-xl transition-all">
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
            <label className="block text-sm font-medium text-gray-400 mb-2">Photo de référence</label>
            
            {showCamera ? (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/10">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-4">
                  <button 
                    type="button"
                    onClick={capturePhoto}
                    className="p-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg transition-all active:scale-90"
                  >
                    <CameraIcon className="w-6 h-6" />
                  </button>
                  <button 
                    type="button"
                    onClick={stopCamera}
                    className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
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
                      {photos.length > 0 ? `${photos.length} photo(s) sélectionnée(s)` : 'Glissez vos photos ici'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="px-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">OU</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <button 
                  type="button"
                  onClick={startCamera}
                  className="w-full py-4 border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white rounded-2xl flex items-center justify-center transition-all"
                >
                  <CameraIcon className="w-5 h-5 mr-2 text-blue-400" />
                  Prendre une photo en direct
                </button>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => { stopCamera(); onClose(); }}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  Création...
                </div>
              ) : 'Valider et Diffuser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPersonModal;
