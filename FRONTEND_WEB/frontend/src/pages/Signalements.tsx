import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";
import toast from "react-hot-toast";

interface Signalement {
  id: string;
  numero_suivi: string;
  declarant_nom: string;
  declarant_email?: string;
  declarant_phone?: string;
  type_signalement: string;
  statut: string;
  date_declaration: string;
}

const Signalements = () => {
  const navigate = useNavigate();
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('tous');
  const [typeFilter, setTypeFilter] = useState<string>('tous');

  useEffect(() => {
    loadSignalements();
  }, []);

  const loadSignalements = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/signalements/");
      setSignalements(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error("Erreur lors du chargement des signalements");
      setSignalements([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSignalements = signalements.filter(s => {
    const statutMatch = filter === 'tous' ? true : s.statut === filter;
    const typeMatch = typeFilter === 'tous' ? true : s.type_signalement === typeFilter;
    return statutMatch && typeMatch;
  });

  const getStatutBadge = (statut: string) => {
    const badges = {
      en_attente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      valide: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      rejete: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    return badges[statut as keyof typeof badges] || badges.en_attente;
  };

  const getStatutLabel = (statut: string) => {
    const labels = {
      en_attente: "En attente",
      valide: "Validé",
      rejete: "Rejeté"
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const enAttente = signalements.filter(s => s.statut === 'en_attente').length;

  return (
    <>
      <PageMeta
        title="Signalements | TOGO-SecureNet"
        description="Gestion des signalements citoyens"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Signalements
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Examinez et validez les signalements des citoyens
        </p>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{enAttente}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Signalements en attente</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setFilter('tous')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'tous' ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Tous</button>
          <button onClick={() => setFilter('en_attente')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'en_attente' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>En attente</button>
          <button onClick={() => setFilter('valide')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'valide' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Validés</button>
          <button onClick={() => setFilter('rejete')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'rejete' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Rejetés</button>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setTypeFilter('tous')} className={`px-4 py-2 rounded-lg text-sm font-medium ${typeFilter === 'tous' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>Tous</button>
          <button onClick={() => setTypeFilter('personne_disparue')} className={`px-4 py-2 rounded-lg text-sm font-medium ${typeFilter === 'personne_disparue' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>Personnes</button>
          <button onClick={() => setTypeFilter('engin_vole')} className={`px-4 py-2 rounded-lg text-sm font-medium ${typeFilter === 'engin_vole' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>Engins</button>
        </div>
      </div>

      {loading ? <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div></div> : (
        <div className="space-y-4">
          {filteredSignalements.map((sig) => (
            <div key={sig.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{sig.numero_suivi}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(sig.statut)}`}>{getStatutLabel(sig.statut)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>{sig.declarant_nom}</span>
                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{new Date(sig.date_declaration).toLocaleString('fr-FR')}</span>
                    {sig.declarant_email && <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>{sig.declarant_email}</span>}
                    {sig.declarant_phone && <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>{sig.declarant_phone}</span>}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${sig.type_signalement === 'personne_disparue' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'}`}>{sig.type_signalement === 'personne_disparue' ? 'Personne' : 'Engin'}</span>
              </div>
              <button onClick={() => navigate(`/gestion-signalements/${sig.id}`)} className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium">Examiner</button>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredSignalements.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun signalement</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aucun résultat pour ces filtres</p>
        </div>
      )}
    </>
  );
};

export default Signalements;
