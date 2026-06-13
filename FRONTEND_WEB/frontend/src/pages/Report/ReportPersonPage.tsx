import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  // Étape 2: Informations personne
  nom: string;
  prenoms: string;
  age: string;
  
  // Étape 3: Détails disparition + photos
  date_disparition: string;
  lieu_disparition: string;
  description: string;
  photoFiles: File[];  // Fichiers photos (pas URLs)
}

export default function ReportPersonPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    declarant_nom: '',
    declarant_email: '',
    declarant_phone: '',
    nom: '',
    prenoms: '',
    age: '',
    date_disparition: '',
    lieu_disparition: '',
    description: '',
    photoFiles: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      photoFiles: [...prev.photoFiles, ...newFiles]
    }));

    toast.success(`${newFiles.length} photo(s) ajoutée(s)`);
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photoFiles: prev.photoFiles.filter((_, i) => i !== index)
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
    
    if (currentStep !== 3) {
      toast.error('Veuillez compléter toutes les étapes');
      return;
    }

    if (formData.photoFiles.length === 0) {
      toast.error('Au moins une photo est obligatoire');
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer FormData pour l'API atomique
      const submitData = new FormData();
      submitData.append('declarant_nom', formData.declarant_nom);
      if (formData.declarant_email) submitData.append('declarant_email', formData.declarant_email);
      if (formData.declarant_phone) submitData.append('declarant_phone', formData.declarant_phone);
      submitData.append('nom', formData.nom);
      submitData.append('prenoms', formData.prenoms);
      submitData.append('age', formData.age);
      submitData.append('date_disparition', formData.date_disparition);
      submitData.append('lieu_disparition', formData.lieu_disparition);
      if (formData.description) submitData.append('description', formData.description);
      
      // Ajouter les fichiers photos
      formData.photoFiles.forEach((file) => {
        submitData.append('photos', file);
      });

      const response = await api.post(`${API_BASE_URL}/signalements/personne-complete`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(`Signalement enregistré!\nNuméro de suivi: ${response.data.numero_suivi}`, {
        duration: 6000,
      });
      setTimeout(() => navigate('/'), 2000);
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
    return formData.nom.trim() !== '' && formData.prenoms.trim() !== '' && formData.age.trim() !== '';
  };

  const isStep3Valid = () => {
    return formData.date_disparition !== '' && formData.lieu_disparition.trim() !== '' && formData.photoFiles.length > 0;
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
                    Votre email
                  </label>
                  <input
                    type="email"
                    name="declarant_email"
                    value={formData.declarant_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    <strong>Note:</strong> Au moins un moyen de contact (email ou téléphone) est requis.
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
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    
                    {formData.photoFiles.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {formData.photoFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
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
                    
                    {formData.photoFiles.length === 0 && (
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
                    <p><strong>Photos:</strong> {formData.photoFiles.length} photo(s) uploadée(s)</p>
                    <p><strong>Déclarant:</strong> {formData.declarant_nom} ({formData.declarant_email || formData.declarant_phone})</p>
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
                  disabled={isSubmitting || !isStep3Valid()}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? 'Envoi en cours...' : '✓ Envoyer le signalement'}
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
