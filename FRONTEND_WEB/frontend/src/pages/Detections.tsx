import { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../components/common/PageMeta";

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface Detection {
  id: string;
  type_detection: string;
  confiance: number;
  date_detection: string;
  camera_id: string;
  personne_disparue_id?: string;
  engin_vole_id?: string;
  image_path?: string;
}

const Detections = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('tous');

  useEffect(() => {
    loadDetections();
  }, []);

  const loadDetections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/detections/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDetections(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDetections = detections.filter(d =>
    filter === 'tous' ? true : d.type_detection === filter
  );

  const getTypeBadge = (type: string) => {
    const badges: any = {
      personne: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      engin: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <PageMeta title="Détections | TOGO-SecureNet" description="Détections en temps réel" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Détections
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{detections.length} détection(s) enregistrée(s)</p>
      </div>

      <div className="mb-6 flex gap-3">
        <button onClick={() => setFilter('tous')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'tous' ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Toutes</button>
        <button onClick={() => setFilter('personne')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'personne' ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Personnes</button>
        <button onClick={() => setFilter('engin')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'engin' ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Engins</button>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDetections.map((det) => (
            <div key={det.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadge(det.type_detection)}`}>{det.type_detection}</span>
                <span className="text-xs text-gray-500">{new Date(det.date_detection).toLocaleString('fr-FR')}</span>
              </div>
              {det.image_path && <img src={`${API_BASE_URL}${det.image_path}`} alt="Détection" className="w-full h-48 object-cover rounded-lg mb-3" />}
              <div className="space-y-2 text-sm">
                <p><strong>Confiance:</strong> <span className={`font-semibold ${det.confiance >= 90 ? 'text-green-600' : det.confiance >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>{det.confiance}%</span></p>
                <p><strong>Caméra:</strong> {det.camera_id}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredDetections.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune détection</h3>
        </div>
      )}
    </>
  );
};

export default Detections;
