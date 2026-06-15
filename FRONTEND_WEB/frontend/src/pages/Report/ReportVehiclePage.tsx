import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PhoneInput from '../../components/form/PhoneInput';
import api from '../../services/api';
import toast from 'react-hot-toast';

const API_BASE_URL = '/api/v1';

type Step = 1 | 2 | 3;

interface FormData {
  // Étape 1: Informations déclarant
  declarant_nom: string;
  declarant_email: string;
  declarant_phone: string;
  
  // Étape 2: Informations engin
  type_engin: string;
  marque: string;
  modele: string;
  couleur: string;
  plaque_immatriculation: string;
  
  // Étape 3: Détails vol
  date_vol: string;
  lieu_vol: string;
  circonstances: string;
}

export default function ReportVehiclePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    declarant_nom: '',
    declarant_email: '',
    declarant_phone: '',
    type_engin: 'voiture',
    marque: '',
    modele: '',
    couleur: '',
    plaque_immatriculation: '',
    date_vol: '',
    lieu_vol: '',
    circonstances: '',
  });

  // Charger les données existantes si mode édition
  useEffect(() => {
    if (editId) {
      loadSignalementData(editId);
    }
  }, [editId]);

  const loadSignalementData = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/v1/signalements/${id}`);
      const data = res.data;

      // Vérifier que c'est bien un engin volé
      if (data.type_signalement !== 'engin_vole') {
        toast.error('Ce signalement n\'est pas un engin volé');
        navigate('/mes-signalements');
        return;
      }

      // Vérifier que le statut permet la modification
      if (data.statut !== 'en_attente') {
        toast.error('Ce signalement ne peut plus être modifié (déjà examiné)');
        navigate('/mes-signalements');
        return;
      }

      // Remplir le formulaire avec les données existantes
      setFormData({
        declarant_nom: data.declarant_nom || '',
        declarant_email: data.declarant_email || '',
        declarant_phone: data.declarant_phone || '',
        type_engin: data.engin?.type_engin || 'voiture',
        marque: data.engin?.marque || '',
        modele: data.engin?.modele || '',
        couleur: data.engin?.couleur || '',
        plaque_immatriculation: data.engin?.plaque_immatriculation || '',
        date_vol: data.engin?.date_vol?.split('T')[0] || '',
        lieu_vol: data.engin?.lieu_vol || '',
        circonstances: data.engin?.circonstances || '',
      });

      setIsEditMode(true);
      toast.success('Données chargées. Vous pouvez modifier le signalement.');
    } catch (error: any) {
      console.error(error);
      toast.error('Erreur lors du chargement du signalement');
      navigate('/mes-signalements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('declarant_nom', formData.declarant_nom);
      if (formData.declarant_email) submitData.append('declarant_email', formData.declarant_email);
      if (formData.declarant_phone) submitData.append('declarant_phone', formData.declarant_phone);
      submitData.append('type_engin', formData.type_engin);
      submitData.append('marque', formData.marque);
      submitData.append('modele', formData.modele);
      submitData.append('plaque_immatriculation', formData.plaque_immatriculation);
      if (formData.couleur) submitData.append('couleur', formData.couleur);
      submitData.append('date_vol', formData.date_vol);
      if (formData.lieu_vol) submitData.append('lieu_vol', formData.lieu_vol);
      if (formData.circonstances) submitData.append('circonstances', formData.circonstances);

      if (isEditMode && editId) {
        // Mode édition
        await api.put(`${API_BASE_URL}/signalements/${editId}/update-engin`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        toast.success('Signalement modifié avec succès!', { duration: 4000 });
        setTimeout(() => navigate('/mes-signalements'), 1500);
      } else {
        // Mode création
        const response = await api.post(`${API_BASE_URL}/signalements/engin-complete`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        toast.success(`Signalement enregistré!\nNuméro de suivi: ${response.data.numero_suivi}`, { 
          duration: 6000 
        });
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = () => {
    return formData.declarant_nom.trim() !== '' && 
           (formData.declarant_email.trim() !== '' || formData.declarant_phone.trim() !== '');
  };

  const isStep2Valid = () => {
    return (
      formData.marque.trim() !== '' &&
      formData.modele.trim() !== '' &&
      formData.plaque_immatriculation.trim() !== ''
    );
  };

  const isStep3Valid = () => {
    return formData.date_vol !== '' && formData.lieu_vol.trim() !== '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Modifier le Signalement' : 'Signalement d\'Engin Volé'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Modifiez les informations de votre signalement' : 'Déclarez le vol de votre véhicule ou engin'}
          </p>
          {isEditMode && (
            <div className="mt-3 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm">
              ℹ️ Mode édition - Vous pouvez modifier les informations
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step === currentStep
                      ? 'bg-blue-600 text-white scale-110'
                      : step < currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Déclarant</span>
            <span>Engin</span>
            <span>Vol</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Étape 1: Informations du déclarant */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Vos Informations
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre nom complet *
                  </label>
                  <input
                    type="text"
                    name="declarant_nom"
                    value={formData.declarant_nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Jean Dupont"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre email
                  </label>
                  <input
                    type="email"
                    name="declarant_email"
                    value={formData.declarant_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre téléphone
                  </label>
                  <PhoneInput
                    value={formData.declarant_phone}
                    onChange={(val) => setFormData({ ...formData, declarant_phone: val || '' })}
                    placeholder="Numéro de téléphone"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Assurez-vous d'être le propriétaire légitime ou ayant-droit du véhicule. Au moins un moyen de contact est requis.
                  </p>
                </div>
              </div>
            )}

            {/* Étape 2: Informations engin */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Informations de l'Engin
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'engin *
                  </label>
                  <select
                    name="type_engin"
                    value={formData.type_engin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="voiture">Voiture</option>
                    <option value="moto">Moto</option>
                    <option value="camion">Camion</option>
                    <option value="bus">Bus</option>
                    <option value="scooter">Scooter</option>
                    <option value="vehicule_utilitaire">Véhicule utilitaire</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marque *
                    </label>
                    <input
                      type="text"
                      name="marque"
                      value={formData.marque}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Toyota"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modèle *
                    </label>
                    <input
                      type="text"
                      name="modele"
                      value={formData.modele}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Corolla"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur
                  </label>
                  <input
                    type="text"
                    name="couleur"
                    value={formData.couleur}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Blanc, Noir, Gris métallisé"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plaque d'immatriculation *
                  </label>
                  <input
                    type="text"
                    name="plaque_immatriculation"
                    value={formData.plaque_immatriculation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="Ex: TG-XXXX-XX"
                    required
                  />
                </div>
              </div>
            )}

            {/* Étape 3: Détails du vol */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Détails du Vol
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date du vol *
                  </label>
                  <input
                    type="date"
                    name="date_vol"
                    value={formData.date_vol}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu du vol *
                  </label>
                  <input
                    type="text"
                    name="lieu_vol"
                    value={formData.lieu_vol}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Lomé, Quartier Adidogomé"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Circonstances du vol
                  </label>
                  <textarea
                    name="circonstances"
                    value={formData.circonstances}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez les circonstances: heure approximative, endroit précis (parking, rue), signes particuliers du véhicule, objets laissés à l'intérieur..."
                  />
                </div>

                {/* Résumé */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Résumé</h3>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>Engin:</strong> {formData.marque} {formData.modele} ({formData.type_engin})</p>
                    <p><strong>Plaque:</strong> {formData.plaque_immatriculation.toUpperCase()}</p>
                    <p><strong>Couleur:</strong> {formData.couleur || 'Non spécifiée'}</p>
                    <p><strong>Vol le:</strong> {formData.date_vol}</p>
                    <p><strong>À:</strong> {formData.lieu_vol}</p>
                    <p><strong>Déclarant:</strong> {formData.declarant_nom}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Assurez-vous d'avoir déposé plainte auprès des autorités compétentes.
                    Ce signalement complète votre démarche officielle.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ← Précédent
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !isStep1Valid()) ||
                    (currentStep === 2 && !isStep2Valid())
                  }
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    (currentStep === 1 && !isStep1Valid()) ||
                    (currentStep === 2 && !isStep2Valid())
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Suivant →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !isStep3Valid()}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all"
                >
                  {isSubmitting ? 'Envoi en cours...' : (isEditMode ? '✓ Enregistrer les modifications' : 'Envoyer le signalement')}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Confidentialité:</strong> Vos informations sont sécurisées. Un superviseur examinera votre signalement
            et le système de reconnaissance faciale sera activé pour retrouver votre véhicule.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
