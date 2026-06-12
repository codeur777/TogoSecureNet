import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface Signalement {
  id: string;
  numero_suivi: string;
  declarant_nom: string;
  declarant_contact: string;
  type_signalement: string;
  statut: string;
  date_declaration: string;
}

export default function GestionSignalements() {
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('en_attente');
  const [selectedSignalement, setSelectedSignalement] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [motifRejet, setMotifRejet] = useState('');
  const [niveauGravite, setNiveauGravite] = useState('grave');

  useEffect(() => {
    loadSignalements();
  }, [filter]);

  const loadSignalements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/signalements/?statut=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSignalements(response.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (signalement: Signalement) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/signalements/${signalement.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedSignalement(response.data);
      
      // Initialiser le niveau de gravité si personne disparue
      if (response.data.personne) {
        setNiveauGravite(response.data.personne.niveau_gravite || 'grave');
      }
      
      setShowModal(true);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const valider = async (signalementId: string) => {
    if (!confirm('Confirmer la validation de ce signalement ?')) return;

    try {
      const token = localStorage.getItem('token');
      
      // Préparer le body avec le niveau de gravité si personne disparue
      const body = selectedSignalement.personne 
        ? { niveau_gravite: niveauGravite }
        : {};
      
      await axios.patch(
        `${API_BASE_URL}/signalements/${signalementId}/valider`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Signalement validé avec succès');
      setShowModal(false);
      loadSignalements();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur lors de la validation');
    }
  };

  const rejeter = async (signalementId: string) => {
    if (!motifRejet.trim()) {
      alert('Veuillez indiquer un motif de rejet');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/signalements/${signalementId}/rejeter?motif=${encodeURIComponent(motifRejet)}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Signalement rejeté');
      setShowModal(false);
      setMotifRejet('');
      loadSignalements();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur lors du rejet');
    }
  };

  const getStatutBadge = (statut: string) => {
    const styles = {
      en_attente: 'bg-yellow-100 text-yellow-800',
      valide: 'bg-green-100 text-green-800',
      rejete: 'bg-red-100 text-red-800'
    };
    return styles[statut as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatutLabel = (statut: string) => {
    const labels = {
      en_attente: 'En attente',
      valide: 'Validé',
      rejete: 'Rejeté'
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Gestion des Signalements
      </h1>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('en_attente')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'en_attente'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('valide')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'valide'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Validés
          </button>
          <button
            onClick={() => setFilter('rejete')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'rejete'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Rejetés
          </button>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : signalements.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Aucun signalement trouvé
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  N° Suivi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Déclarant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {signalements.map((sig) => (
                <tr key={sig.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {sig.numero_suivi}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{sig.declarant_nom}</div>
                    <div className="text-sm text-gray-500">{sig.declarant_contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {sig.type_signalement === 'personne_disparue'
                      ? '👤 Personne'
                      : '🚗 Engin'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutBadge(
                        sig.statut
                      )}`}
                    >
                      {getStatutLabel(sig.statut)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sig.date_declaration).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => viewDetails(sig)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de détails */}
      {showModal && selectedSignalement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Détails du signalement
                  </h2>
                  <p className="text-gray-600 font-mono mt-1">
                    {selectedSignalement.id}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Info déclarant */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Déclarant</h3>
                <p className="text-sm">
                  <strong>Nom:</strong> {selectedSignalement.declarant_nom}
                </p>
                <p className="text-sm">
                  <strong>Contact:</strong> {selectedSignalement.declarant_contact}
                </p>
                <p className="text-sm">
                  <strong>Date:</strong>{' '}
                  {new Date(selectedSignalement.date_declaration).toLocaleString('fr-FR')}
                </p>
              </div>

              {/* Détails personne */}
              {selectedSignalement.personne && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Personne Disparue
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Nom:</strong> {selectedSignalement.personne.nom}
                    </div>
                    <div>
                      <strong>Prénoms:</strong> {selectedSignalement.personne.prenoms}
                    </div>
                    <div>
                      <strong>Âge:</strong> {selectedSignalement.personne.age}
                    </div>
                    <div>
                      <strong>Date disparition:</strong>{' '}
                      {selectedSignalement.personne.date_disparition}
                    </div>
                    <div className="col-span-2">
                      <strong>Lieu:</strong> {selectedSignalement.personne.lieu_disparition}
                    </div>
                    {selectedSignalement.personne.description && (
                      <div className="col-span-2">
                        <strong>Description:</strong>
                        <p className="mt-1">{selectedSignalement.personne.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Niveau de gravité (modifiable par admin) */}
                  {selectedSignalement.statut === 'en_attente' && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        🎯 Évaluer le niveau de gravité
                      </label>
                      <select
                        value={niveauGravite}
                        onChange={(e) => setNiveauGravite(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="pas_grave">Modéré</option>
                        <option value="grave">Grave</option>
                        <option value="tres_grave">Très Grave</option>
                      </select>
                      <p className="text-xs text-gray-600 mt-1">
                        Cette évaluation sera enregistrée lors de la validation
                      </p>
                    </div>
                  )}

                  {selectedSignalement.statut !== 'en_attente' && (
                    <div className="mt-4 p-3 bg-gray-100 rounded">
                      <strong>Niveau de gravité:</strong>{' '}
                      <span
                        className={`inline-flex px-2 py-1 rounded text-sm font-semibold ${
                          selectedSignalement.personne.niveau_gravite === 'tres_grave'
                            ? 'bg-red-100 text-red-800'
                            : selectedSignalement.personne.niveau_gravite === 'grave'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {selectedSignalement.personne.niveau_gravite === 'tres_grave'
                          ? 'Très Grave'
                          : selectedSignalement.personne.niveau_gravite === 'grave'
                          ? 'Grave'
                          : 'Modéré'}
                      </span>
                    </div>
                  )}

                  {/* Photos */}
                  {selectedSignalement.personne.photo &&
                    selectedSignalement.personne.photo.length > 0 && (
                      <div className="mt-4">
                        <strong className="block mb-2">Photos:</strong>
                        <div className="grid grid-cols-3 gap-3">
                          {selectedSignalement.personne.photo.map((url: string, idx: number) => (
                            <img
                              key={idx}
                              src={`${API_BASE_URL}${url}`}
                              alt={`Photo ${idx + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Détails engin */}
              {selectedSignalement.engin && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Engin Volé</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Type:</strong> {selectedSignalement.engin.type_engin}
                    </div>
                    <div>
                      <strong>Marque:</strong> {selectedSignalement.engin.marque}
                    </div>
                    <div>
                      <strong>Modèle:</strong> {selectedSignalement.engin.modele}
                    </div>
                    <div>
                      <strong>Couleur:</strong> {selectedSignalement.engin.couleur}
                    </div>
                    <div>
                      <strong>Plaque:</strong>{' '}
                      {selectedSignalement.engin.plaque_immatriculation}
                    </div>
                    <div>
                      <strong>Date vol:</strong> {selectedSignalement.engin.date_vol}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedSignalement.statut === 'en_attente' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => valider(selectedSignalement.id)}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      ✓ Valider le signalement
                    </button>
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motif de rejet (optionnel)
                    </label>
                    <textarea
                      value={motifRejet}
                      onChange={(e) => setMotifRejet(e.target.value)}
                      placeholder="Précisez la raison du rejet..."
                      className="w-full px-4 py-2 border rounded-lg resize-none"
                      rows={3}
                    />
                    <button
                      onClick={() => rejeter(selectedSignalement.id)}
                      className="mt-2 w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      ✗ Rejeter le signalement
                    </button>
                  </div>
                </div>
              )}

              {selectedSignalement.statut !== 'en_attente' && (
                <div
                  className={`p-4 rounded-lg text-center font-medium ${
                    selectedSignalement.statut === 'valide'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedSignalement.statut === 'valide'
                    ? '✓ Ce signalement a été validé'
                    : '✗ Ce signalement a été rejeté'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
