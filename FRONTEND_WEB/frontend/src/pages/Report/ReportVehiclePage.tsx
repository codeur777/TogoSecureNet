import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

type Step = 1 | 2 | 3;

interface FormData {
  // Étape 1: Informations déclarant
  declarant_nom: string;
  declarant_contact: string;
  
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
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    declarant_nom: '',
    declarant_contact: '',
    type_engin: 'voiture',
    marque: '',
    modele: '',
    couleur: '',
    plaque_immatriculation: '',
    date_vol: '',
    lieu_vol: '',
    circonstances: '',
  });

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
      // Créer le signalement
      const signalementResponse = await axios.post(`${API_BASE_URL}/signalements/`, {
        declarant_nom: formData.declarant_nom,
        declarant_contact: formData.declarant_contact,
        type_signalement: 'engin_vole',
      });

      const signalementId = signalementResponse.data.id;

      // Créer l'engin volé (endpoint public)
      await axios.post(`${API_BASE_URL}/signalements/engin`, {
        signalement_id: signalementId,
        type_engin: formData.type_engin,
        marque: formData.marque,
        modele: formData.modele,
        couleur: formData.couleur,
        plaque_immatriculation: formData.plaque_immatriculation,
        date_vol: formData.date_vol,
        lieu_vol: formData.lieu_vol,
        circonstances: formData.circonstances,
      });

      alert('Signalement enregistré avec succès ! Un superviseur sera notifié.');
      navigate('/');
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = () => {
    return formData.declarant_nom.trim() !== '' && formData.declarant_contact.trim() !== '';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Signalement d'Engin Volé
          </h1>
          <p className="text-gray-600">
            Déclarez le vol de votre véhicule ou engin
          </p>
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
                    Votre contact (téléphone ou email) *
                  </label>
                  <input
                    type="text"
                    name="declarant_contact"
                    value={formData.declarant_contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: +228 XX XX XX XX ou email@example.com"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Assurez-vous d'être le propriétaire légitime ou ayant-droit du véhicule.
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
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
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
