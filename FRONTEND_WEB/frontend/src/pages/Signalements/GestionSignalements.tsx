import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import PageMeta from '../../components/common/PageMeta';

interface Signalement {
  id: string;
  numero_suivi: string;
  declarant_nom: string;
  declarant_email?: string;
  declarant_phone?: string;
  type_signalement: string;
  statut: string;
  date_declaration: string;
  personne?: {
    id: string;
    nom: string;
    prenoms: string;
    age: string;
    date_disparition: string;
    lieu_disparition: string;
    description?: string;
    niveau_gravite: string;
    photo: string[];
    vecteur_facial?: any;
  };
  engin?: {
    id: string;
    type_engin: string;
    marque: string;
    modele: string;
    couleur: string;
    plaque_immatriculation: string;
    date_vol: string;
    lieu_vol?: string;
    circonstances?: string;
  };
}

export default function GestionSignalements() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [signalement, setSignalement] = useState<Signalement | null>(null);
  const [loading, setLoading] = useState(true);
  const [extractingVectors, setExtractingVectors] = useState(false);
  const [motifRejet, setMotifRejet] = useState('');
  const [niveauGravite, setNiveauGravite] = useState('grave');

  useEffect(() => {
    if (id) {
      loadSignalement();
    }
  }, [id]);

  const loadSignalement = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/signalements/${id}`);
      setSignalement(response.data);
      
      if (response.data.personne) {
        setNiveauGravite(response.data.personne.niveau_gravite || 'grave');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Impossible de charger le signalement");
      navigate('/signalements');
    } finally {
      setLoading(false);
    }
  };

  const extractVecteurs = async () => {
    if (!signalement?.personne) return;
    
    setExtractingVectors(true);
    try {
      await api.post(`/api/v1/personnes-disparues/${signalement.personne.id}/extraire-vecteurs`);
      toast.success("Vecteurs faciaux extraits avec succès");
      loadSignalement();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'extraction");
    } finally {
      setExtractingVectors(false);
    }
  };

  const valider = async () => {
    if (!signalement) return;

    if (signalement.personne && !signalement.personne.vecteur_facial) {
      toast.error("Veuillez d'abord extraire les vecteurs faciaux");
      return;
    }

    try {
      const body = signalement.personne ? { niveau_gravite: niveauGravite } : {};
      
      await api.patch(`/api/v1/signalements/${signalement.id}/valider`, body);
      toast.success("Signalement validé - Le citoyen a été notifié");
      navigate('/signalements');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erreur lors de la validation");
    }
  };

  const rejeter = async () => {
    if (!signalement) return;
    
    if (!motifRejet.trim()) {
      toast.error("Veuillez indiquer un motif de rejet");
      return;
    }

    try {
      await api.patch(`/api/v1/signalements/${signalement.id}/rejeter?motif=${encodeURIComponent(motifRejet)}`);
      toast.success("Signalement rejeté - Le citoyen a été notifié");
      navigate('/signalements');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erreur lors du rejet");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!signalement) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Signalement introuvable
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={`Signalement ${signalement.numero_suivi} | TOGO-SecureNet`} description="" />
      
      <div className="mb-6">
        <button
          onClick={() => navigate('/signalements')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux signalements
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Examen du signalement
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
              {signalement.numero_suivi}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            signalement.statut === 'en_attente'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              : signalement.statut === 'valide'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {signalement.statut === 'en_attente' ? 'En attente' : signalement.statut === 'valide' ? 'Validé' : 'Rejeté'}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Informations déclarant */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Déclarant
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Nom:</span>
              <p className="text-gray-900 dark:text-white">{signalement.declarant_nom}</p>
            </div>
            {signalement.declarant_email && (
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
                <p className="text-gray-900 dark:text-white">{signalement.declarant_email}</p>
              </div>
            )}
            {signalement.declarant_phone && (
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Téléphone:</span>
                <p className="text-gray-900 dark:text-white">{signalement.declarant_phone}</p>
              </div>
            )}
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Date de déclaration:</span>
              <p className="text-gray-900 dark:text-white">{new Date(signalement.date_declaration).toLocaleString('fr-FR')}</p>
            </div>
          </div>
        </div>

        {/* Détails personne disparue */}
        {signalement.personne && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Personne Disparue
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Nom:</span>
                <p className="text-gray-900 dark:text-white">{signalement.personne.nom}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Prénoms:</span>
                <p className="text-gray-900 dark:text-white">{signalement.personne.prenoms}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Âge:</span>
                <p className="text-gray-900 dark:text-white">{signalement.personne.age} ans</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Date disparition:</span>
                <p className="text-gray-900 dark:text-white">{new Date(signalement.personne.date_disparition).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Lieu:</span>
                <p className="text-gray-900 dark:text-white">{signalement.personne.lieu_disparition}</p>
              </div>
              {signalement.personne.description && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Description:</span>
                  <p className="text-gray-900 dark:text-white mt-1">{signalement.personne.description}</p>
                </div>
              )}
            </div>

            {/* Photos */}
            {signalement.personne.photo && signalement.personne.photo.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-3">Photos:</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {signalement.personne.photo.map((url: string, idx: number) => (
                    <img
                      key={idx}
                      src={`http://localhost:8000${url}`}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Extraction vecteurs */}
            {signalement.statut === 'en_attente' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Extraction des vecteurs faciaux
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                      {signalement.personne.vecteur_facial
                        ? "Les vecteurs faciaux ont été extraits. Vous pouvez valider le signalement."
                        : "Pour valider ce signalement, vous devez d'abord extraire les vecteurs faciaux des photos."}
                    </p>
                    {!signalement.personne.vecteur_facial && (
                      <button
                        onClick={extractVecteurs}
                        disabled={extractingVectors}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {extractingVectors ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Extraction en cours...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Extraire les vecteurs faciaux
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Niveau de gravité */}
            {signalement.statut === 'en_attente' && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <label className="block font-semibold text-gray-900 dark:text-white mb-2">
                  Niveau de gravité
                </label>
                <select
                  value={niveauGravite}
                  onChange={(e) => setNiveauGravite(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="pas_grave">Modéré</option>
                  <option value="grave">Grave</option>
                  <option value="tres_grave">Très Grave</option>
                </select>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Cette évaluation sera enregistrée lors de la validation
                </p>
              </div>
            )}

            {signalement.statut !== 'en_attente' && (
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
                <strong className="text-gray-700 dark:text-gray-300">Niveau de gravité:</strong>{' '}
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                  signalement.personne.niveau_gravite === 'tres_grave'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : signalement.personne.niveau_gravite === 'grave'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {signalement.personne.niveau_gravite === 'tres_grave' ? 'Très Grave' : signalement.personne.niveau_gravite === 'grave' ? 'Grave' : 'Modéré'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Détails engin volé */}
        {signalement.engin && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              Engin Volé
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Type:</span>
                <p className="text-gray-900 dark:text-white">{signalement.engin.type_engin}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Marque:</span>
                <p className="text-gray-900 dark:text-white">{signalement.engin.marque}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Modèle:</span>
                <p className="text-gray-900 dark:text-white">{signalement.engin.modele}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Couleur:</span>
                <p className="text-gray-900 dark:text-white">{signalement.engin.couleur}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Plaque:</span>
                <p className="text-gray-900 dark:text-white font-mono text-lg">{signalement.engin.plaque_immatriculation}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Date vol:</span>
                <p className="text-gray-900 dark:text-white">{new Date(signalement.engin.date_vol).toLocaleDateString('fr-FR')}</p>
              </div>
              {signalement.engin.lieu_vol && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Lieu du vol:</span>
                  <p className="text-gray-900 dark:text-white">{signalement.engin.lieu_vol}</p>
                </div>
              )}
              {signalement.engin.circonstances && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Circonstances:</span>
                  <p className="text-gray-900 dark:text-white mt-1">{signalement.engin.circonstances}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {signalement.statut === 'en_attente' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
            <button
              onClick={valider}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Valider le signalement
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Motif de rejet
              </label>
              <textarea
                value={motifRejet}
                onChange={(e) => setMotifRejet(e.target.value)}
                placeholder="Précisez la raison du rejet..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                rows={3}
              />
              <button
                onClick={rejeter}
                className="mt-3 w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Rejeter le signalement
              </button>
            </div>
          </div>
        )}

        {signalement.statut !== 'en_attente' && (
          <div className={`rounded-xl p-6 text-center font-semibold ${
            signalement.statut === 'valide'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {signalement.statut === 'valide'
              ? 'Ce signalement a été validé'
              : 'Ce signalement a été rejeté'}
          </div>
        )}
      </div>
    </>
  );
}
