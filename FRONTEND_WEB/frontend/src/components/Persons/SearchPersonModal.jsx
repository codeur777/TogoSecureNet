import React, { useState, useRef } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, UserIcon, CameraIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SearchPersonModal = ({ isOpen, onClose }) => {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
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
      const file = new File([blob], `search_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setPhoto(file);
      setPreview(canvas.toDataURL('image/jpeg'));
      stopCamera();
      toast.success('Photo capturée !');
    }, 'image/jpeg');
  };

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
      <div className="glass w-full max-w-xl rounded-[2.5rem] overflow-hidden animate-fade-in border-purple-500/20 max-h-[90vh] overflow-y-auto">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <MagnifyingGlassIcon className="w-6 h-6 mr-3 text-purple-400" />
            Recherche par Photo
          </h2>
          <button onClick={() => { stopCamera(); onClose(); }} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center">
            {showCamera ? (
                <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black relative border border-white/10">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <button 
                        type="button"
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg transition-all active:scale-90"
                    >
                        <CameraIcon className="w-6 h-6" />
                    </button>
                </div>
            ) : (
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
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Upload Photo</span>
                </div>
                </div>
            )}
            
            {!showCamera && (
                <button 
                    type="button"
                    onClick={startCamera}
                    className="mt-4 flex items-center text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-all"
                >
                    <CameraIcon className="w-4 h-4 mr-2" />
                    Utiliser la Caméra
                </button>
            )}
            
            <p className="mt-4 text-sm text-gray-400 text-center">Prenez ou uploadez une photo pour l'identifier.</p>
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Résultats de correspondance</h3>
              <div className="space-y-3">
                {results.map(person => (
                  <div key={person.id} className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center">
                    <img 
                      src={person.photo_url ? (person.photo_url.startsWith('http') ? person.photo_url : `${import.meta.env.VITE_API_URL}${person.photo_url}`) : 'https://via.placeholder.com/100'} 
                      className="w-12 h-12 rounded-xl object-cover" 
                      alt="" 
                    />
                    <div className="ml-4">
                      <p className="text-white font-bold">{person.first_name} {person.last_name}</p>
                      <p className="text-xs text-purple-400">Identifié par TogoSecure AI</p>
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
