import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

type Step = 1 | 2 | 3;

interface FormData {
  // Étape 1: Informations déclarant
  declarant_nom: string;
  declarant_contact: string;
  
  // Étape 2: Informations personne
  nom: string;
  prenoms: string;
  age: string;
  
  // Étape 3: Détails disparition + photos
  date_disparition: string;
  lieu_disparition: string;
  description: string;
  photos: string[];  // URLs des photos
}

export default function ReportPersonPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    declarant_nom: '',
    declarant_contact: '',
    nom: '',
    prenoms: '',
    age: '',
    date_disparition: '',
    lieu_disparition: '',
    description: '',
    photos: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const response = await axios.post(`${API_BASE_URL}/signalements/upload-photo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        uploadedUrls.push(response.data.url);
      }

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls]
      }));

      alert(`${uploadedUrls.length} photo(s) uploadée(s) avec succès`);
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload des photos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
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
    
    // Vérifier qu'on est bien à la dernière étape
    if (currentStep !== 3) {
      alert('Veuillez compléter toutes les étapes');
      return;
    }

    // Vérifier qu'au moins une photo est uploadée
    if (formData.photos.length === 0) {
      alert('Au moins une photo est obligatoire');
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer le signalement
      const signalementResponse = await axios.post(`${API_BASE_URL}/signalements/`, {
        declarant_nom: formData.declarant_nom,
        declarant_contact: formData.declarant_contact,
        type_signalement: 'personne_disparue',
      });

      const signalementId = signalementResponse.data.id;

      // Créer la personne disparue (endpoint public) - sans niveau_gravite
      const personneResponse = await axios.post(`${API_BASE_URL}/signalements/personne`, {
        signalement_id: signalementId,
        nom: formData.nom,
        prenoms: formData.prenoms,
        age: formData.age,
        date_disparition: formData.date_disparition,
        lieu_disparition: formData.lieu_disparition,
        description: formData.description,
        photos: formData.photos,
      });

      alert('Signalement enregistré avec succès !\nNuméro de suivi: ' + personneResponse.data.numero_suivi + '\nConservez ce numéro pour suivre votre demande.');
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
    return formData.nom.trim() !== '' && formData.prenoms.trim() !== '' && formData.age.trim() !== '';
  };

  const isStep3Valid = () => {
    return formData.date_disparition !== '' && formData.lieu_disparition.trim() !== '' && formData.photos.length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Signalement de Personne Disparue
          </h1>
          <p className="text-gray-600">
            Aidez-nous à retrouver une personne disparue
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
                      ? 'bg-green-600 text-white scale-110'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Vos informations</span>
            <span>La personne</span>
            <span>Détails & Photos</span>
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: +228 XX XX XX XX ou email@example.com"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Ces informations nous permettront de vous contacter si nécessaire.
                  </p>
                </div>
              </div>
            )}

            {/* Étape 2: Informations personne */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Informations de la Personne
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nom de famille"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom(s) *
                  </label>
                  <input
                    type="text"
                    name="prenoms"
                    value={formData.prenoms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Prénom(s)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Âge approximatif *
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 25 ans, 10-15 ans, environ 30 ans"
                    required
                  />
                </div>
              </div>
            )}

            {/* Étape 3: Détails de la disparition */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Détails de la Disparition
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de disparition *
                  </label>
                  <input
                    type="date"
                    name="date_disparition"
                    value={formData.date_disparition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu de disparition *
                  </label>
                  <input
                    type="text"
                    name="lieu_disparition"
                    value={formData.lieu_disparition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Lomé, Quartier Agbalépédogan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Décrivez la personne: taille, corpulence, signes distinctifs, vêtements portés, circonstances de la disparition..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos de la personne disparue * (minimum 1 photo)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhotos}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    
                    {uploadingPhotos && (
                      <p className="text-sm text-blue-600">Upload en cours...</p>
                    )}
                    
                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {formData.photos.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={`${API_BASE_URL}${url}`}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {formData.photos.length === 0 && (
                      <div className="border-2 border-dashed border-red-300 rounded-lg p-4 text-center bg-red-50">
                        <p className="text-sm text-red-600">
                          ⚠️ Au moins une photo est obligatoire
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Résumé */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">📋 Résumé de votre signalement</h3>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>Personne:</strong> {formData.prenoms} {formData.nom}, {formData.age}</p>
                    <p><strong>Disparu(e) le:</strong> {formData.date_disparition || '(Non renseigné)'}</p>
                    <p><strong>Lieu:</strong> {formData.lieu_disparition || '(Non renseigné)'}</p>
                    <p><strong>Photos:</strong> {formData.photos.length} photo(s) uploadée(s)</p>
                    <p><strong>Déclarant:</strong> {formData.declarant_nom} ({formData.declarant_contact})</p>
                  </div>
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
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Suivant →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !isStep3Valid() || uploadingPhotos}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? 'Envoi en cours...' : uploadingPhotos ? 'Upload photos...' : '✓ Envoyer le signalement'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Confidentialité:</strong> Vos informations sont sécurisées et seront utilisées uniquement dans le cadre de cette recherche.
            Un superviseur examinera votre signalement rapidement.
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
