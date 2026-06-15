import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import api from "../../services/api";
import toast from "react-hot-toast";

interface Signalement {
  id: string;
  numero_suivi: string;
  type_signalement: 'personne_disparue' | 'engin_vole';
  declarant_nom: string;
  declarant_email?: string;
  declarant_phone?: string;
  date_declaration: string;
  statut: 'en_attente' | 'valide' | 'rejete';
}

const MesSignalements = () => {
  const navigate = useNavigate();
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'tous' | 'en_attente' | 'valide' | 'rejete'>('tous');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSignalement, setSelectedSignalement] = useState<any>(null);

  const fetchSignalements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/signalements/");
      setSignalements(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur lors du chargement des signalements.");
      setSignalements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignalements();
  }, [fetchSignalements]);

  const filteredSignalements = signalements.filter(s =>
    filter === 'tous' ? true : s.statut === filter
  );

  const handleVoirDetails = async (signalement: Signalement) => {
    try {
      const res = await api.get(`/api/v1/signalements/${signalement.id}`);
      setSelectedSignalement(res.data);
      setDetailsModalOpen(true);
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors du chargement des détails");
    }
  };

  const handleModifier = (signalement: Signalement) => {
    // Rediriger vers la page de modification selon le type
    if (signalement.type_signalement === 'personne_disparue') {
      navigate(`/report/person?edit=${signalement.id}`);
    } else {
      navigate(`/report/vehicle?edit=${signalement.id}`);
    }
  };

  const getTitre = (s: Signalement) => {
    return `Signalement #${s.numero_suivi || s.id.substring(0, 8)}`;
  };

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
      en_attente: "En attente d'examen",
      valide: "Validé",
      rejete: "Rejeté"
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return (
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'valide':
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejete':
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Seuls les signalements "en_attente" peuvent être modifiés
  const canEdit = (statut: string) => {
    return statut === 'en_attente';
  };

  return (
    <>
      <PageMeta
        title="Mes Signalements | TOGO-SecureNet"
        description="Consultez et gérez vos signalements"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Mes Signalements
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Suivez l'état de vos déclarations et modifications
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Information importante</h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Vous pouvez modifier vos signalements tant qu'ils n'ont pas été examinés ou validés par un administrateur.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('tous')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'tous'
              ? 'bg-brand-500 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          Tous ({signalements.length})
        </button>
        <button
          onClick={() => setFilter('en_attente')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'en_attente'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          En attente ({signalements.filter(s => s.statut === 'en_attente').length})
        </button>

        <button
          onClick={() => setFilter('valide')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'valide'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          Validés ({signalements.filter(s => s.statut === 'valide').length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSignalements.map((signalement) => (
            <div
              key={signalement.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {getTitre(signalement)}
                    </h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      signalement.type_signalement === 'personne_disparue' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                    }`}>
                      {signalement.type_signalement === 'personne_disparue' ? 'Personne' : 'Engin'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Signalé le {new Date(signalement.date_declaration).toLocaleDateString('fr-FR')} à{' '}
                    {new Date(signalement.date_declaration).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatutIcon(signalement.statut)}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatutBadge(signalement.statut)}`}>
                    {getStatutLabel(signalement.statut)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleVoirDetails(signalement)}
                  className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium"
                >
                  Voir détails
                </button>
                {canEdit(signalement.statut) && (
                  <button 
                    onClick={() => handleModifier(signalement)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                  >
                    Modifier
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredSignalements.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun signalement</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vous n'avez pas encore effectué de signalement.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <a
              href="/report/person"
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium"
            >
              Signaler une personne
            </a>
            <a
              href="/report/vehicle"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
            >
              Signaler un engin
            </a>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {detailsModalOpen && selectedSignalement && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setDetailsModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Détails du signalement
                </h2>
                <button
                  onClick={() => setDetailsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Numéro de suivi</span>
                  <p className="text-lg font-bold text-brand-600 dark:text-brand-400">{selectedSignalement.numero_suivi}</p>
                </div>

                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Type</span>
                  <p className="text-gray-900 dark:text-white">
                    {selectedSignalement.type_signalement === 'personne_disparue' ? 'Personne disparue' : 'Engin volé'}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Statut</span>
                  <p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatutBadge(selectedSignalement.statut)}`}>
                      {getStatutLabel(selectedSignalement.statut)}
                    </span>
                  </p>
                </div>

                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Date de déclaration</span>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedSignalement.date_declaration).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {selectedSignalement.personne && (
                  <>
                    <div className="border-t dark:border-gray-700 pt-4 mt-4">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Informations sur la personne</h3>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Nom complet</span>
                      <p className="text-gray-900 dark:text-white">{selectedSignalement.personne.prenoms} {selectedSignalement.personne.nom}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Âge</span>
                      <p className="text-gray-900 dark:text-white">{selectedSignalement.personne.age} ans</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Date de disparition</span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedSignalement.personne.date_disparition).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Lieu de disparition</span>
                      <p className="text-gray-900 dark:text-white">{selectedSignalement.personne.lieu_disparition}</p>
                    </div>
                    {selectedSignalement.personne.description && (
                      <div>
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Description</span>
                        <p className="text-gray-900 dark:text-white">{selectedSignalement.personne.description}</p>
                      </div>
                    )}
                  </>
                )}

                {selectedSignalement.engin && (
                  <>
                    <div className="border-t dark:border-gray-700 pt-4 mt-4">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Informations sur le véhicule</h3>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Type</span>
                      <p className="text-gray-900 dark:text-white">{selectedSignalement.engin.type_engin}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Marque et modèle</span>
                      <p className="text-gray-900 dark:text-white">{selectedSignalement.engin.marque} {selectedSignalement.engin.modele}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Plaque d'immatriculation</span>
                      <p className="text-xl font-bold text-orange-600 dark:text-orange-400 font-mono">{selectedSignalement.engin.plaque_immatriculation}</p>
                    </div>
                    {selectedSignalement.engin.couleur && (
                      <div>
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Couleur</span>
                        <p className="text-gray-900 dark:text-white">{selectedSignalement.engin.couleur}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Date du vol</span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedSignalement.engin.date_vol).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {selectedSignalement.engin.lieu_vol && (
                      <div>
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Lieu du vol</span>
                        <p className="text-gray-900 dark:text-white">{selectedSignalement.engin.lieu_vol}</p>
                      </div>
                    )}
                    {selectedSignalement.engin.circonstances && (
                      <div>
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Circonstances</span>
                        <p className="text-gray-900 dark:text-white">{selectedSignalement.engin.circonstances}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDetailsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Fermer
                </button>
                {canEdit(selectedSignalement.statut) && (
                  <button
                    onClick={() => {
                      setDetailsModalOpen(false);
                      handleModifier(selectedSignalement);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Modifier
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MesSignalements;
