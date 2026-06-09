import { useState, useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";
import toast from "react-hot-toast";

interface PortraitOptions {
  face_shapes: string[];
  skin_tones: string[];
  hair_colors: string[];
  hair_styles: string[];
  hair_lengths: string[];
  eye_colors: string[];
  eye_shapes: string[];
  nose_shapes: string[];
  mouth_shapes: string[];
  facial_hair: string[];
  ethnicities: string[];
}

interface PortraitDescription {
  name?: string;
  age?: number;
  gender?: string;
  ethnicity?: string;
  face_shape?: string;
  skin_tone?: string;
  hair_color?: string;
  hair_style?: string;
  hair_length?: string;
  eye_color?: string;
  eye_shape?: string;
  nose_shape?: string;
  mouth_shape?: string;
  facial_hair?: string;
  distinctive_features?: string;
  additional_description?: string;
}

const PortraitRobot = () => {
  const [step, setStep] = useState<'form' | 'preview' | 'refine' | 'save'>("form");
  const [options, setOptions] = useState<PortraitOptions | null>(null);
  const [description, setDescription] = useState<PortraitDescription>({
    gender: "M",
    age: 30,
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [refineFeedback, setRefineFeedback] = useState("");
  const [saveData, setSaveData] = useState({
    last_location: "",
    circumstances: ""
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await api.get("/api/v1/portrait-robot/options");
      setOptions(response.data);
    } catch (error) {
      console.error("Erreur chargement options:", error);
      toast.error("Impossible de charger les options");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/v1/portrait-robot/generate", description);
      setGeneratedPrompt(response.data.prompt);
      setGeneratedImage(response.data.image_url);
      toast.success("Portrait généré avec succès!");
      setStep("preview");
    } catch (error: any) {
      console.error("Erreur génération:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de la génération");
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!refineFeedback.trim()) {
      toast.error("Veuillez décrire les modifications souhaitées");
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post("/api/v1/portrait-robot/refine", {
        original_prompt: generatedPrompt,
        feedback: refineFeedback
      });
      setGeneratedPrompt(response.data.refined_prompt);
      toast.success("Prompt affiné. Regénérez l'image.");
      setRefineFeedback("");
    } catch (error: any) {
      console.error("Erreur affinement:", error);
      toast.error("Erreur lors de l'affinement");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!saveData.last_location || !saveData.circumstances) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/api/v1/portrait-robot/save", {
        description,
        image_base64: generatedImage,
        last_location: saveData.last_location,
        circumstances: saveData.circumstances
      });
      toast.success("Portrait sauvegardé comme personne recherchée!");
      // Réinitialiser
      setStep("form");
      setDescription({ gender: "M", age: 30 });
      setGeneratedImage(null);
      setSaveData({ last_location: "", circumstances: "" });
    } catch (error: any) {
      console.error("Erreur sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Portrait-Robot | TOGO-SecureNet"
        description="Génération de portrait-robot par IA"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Génération de Portrait-Robot par IA
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Créez un portrait-robot détaillé à partir d'une description
        </p>
      </div>

      {/* Étapes */}
      <div className="mb-6 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step === 'form' ? 'text-brand-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'form' ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              1
            </div>
            <span>Description</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
          <div className={`flex items-center gap-2 ${step === 'preview' ? 'text-brand-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'preview' ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              2
            </div>
            <span>Aperçu</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
          <div className={`flex items-center gap-2 ${step === 'save' ? 'text-brand-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'save' ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              3
            </div>
            <span>Sauvegarde</span>
          </div>
        </div>
      </div>

      {/* Formulaire de description */}
      {step === 'form' && options && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Description détaillée de la personne
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Informations générales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom / Alias (optionnel)
              </label>
              <input
                type="text"
                value={description.name || ""}
                onChange={(e) => setDescription({...description, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-white"
                placeholder="Ex: Jean Dupont"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Âge approximatif
              </label>
              <input
                type="number"
                value={description.age || ""}
                onChange={(e) => setDescription({...description, age: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-white"
                placeholder="Ex: 30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Genre
              </label>
              <select
                value={description.gender || ""}
                onChange={(e) => setDescription({...description, gender: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-white"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            
            <SelectField label="Ethnie" value={description.ethnicity} onChange={(v) => setDescription({...description, ethnicity: v})} options={options.ethnicities} />
            <SelectField label="Forme du visage" value={description.face_shape} onChange={(v) => setDescription({...description, face_shape: v})} options={options.face_shapes} />
            <SelectField label="Teint de peau" value={description.skin_tone} onChange={(v) => setDescription({...description, skin_tone: v})} options={options.skin_tones} />
            <SelectField label="Couleur cheveux" value={description.hair_color} onChange={(v) => setDescription({...description, hair_color: v})} options={options.hair_colors} />
            <SelectField label="Style cheveux" value={description.hair_style} onChange={(v) => setDescription({...description, hair_style: v})} options={options.hair_styles} />
            <SelectField label="Longueur cheveux" value={description.hair_length} onChange={(v) => setDescription({...description, hair_length: v})} options={options.hair_lengths} />
            <SelectField label="Couleur yeux" value={description.eye_color} onChange={(v) => setDescription({...description, eye_color: v})} options={options.eye_colors} />
            <SelectField label="Forme yeux" value={description.eye_shape} onChange={(v) => setDescription({...description, eye_shape: v})} options={options.eye_shapes} />
            <SelectField label="Forme nez" value={description.nose_shape} onChange={(v) => setDescription({...description, nose_shape: v})} options={options.nose_shapes} />
            <SelectField label="Forme bouche" value={description.mouth_shape} onChange={(v) => setDescription({...description, mouth_shape: v})} options={options.mouth_shapes} />
            <SelectField label="Pilosité faciale" value={description.facial_hair} onChange={(v) => setDescription({...description, facial_hair: v})} options={options.facial_hair} />
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Signes distinctifs (cicatrices, tatouages, etc.)
            </label>
            <textarea
              value={description.distinctive_features || ""}
              onChange={(e) => setDescription({...description, distinctive_features: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-white"
              rows={3}
              placeholder="Ex: Cicatrice sur la joue gauche, tatouage au cou..."
            />
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description additionnelle
            </label>
            <textarea
              value={description.additional_description || ""}
              onChange={(e) => setDescription({...description, additional_description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-white"
              rows={4}
              placeholder="Autres détails importants..."
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Générer le portrait
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Aperçu du portrait */}
      {step === 'preview' && generatedImage && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Portrait généré
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img
                src={generatedImage}
                alt="Portrait généré"
                className="w-full h-auto rounded-lg border-2 border-gray-200 dark:border-gray-700"
              />
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Le portrait correspond-il à la description ?
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => setStep('save')}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  ✓ Oui, ce portrait est correct
                </button>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Sinon, décrivez les modifications à apporter :
                  </p>
                  <textarea
                    value={refineFeedback}
                    onChange={(e) => setRefineFeedback(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-white"
                    rows={4}
                    placeholder="Ex: Le nez devrait être plus large, les cheveux plus courts..."
                  />
                  <button
                    onClick={handleRefine}
                    disabled={loading}
                    className="mt-3 w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                  >
                    {loading ? "Affinement..." : "Affiner et regénérer"}
                  </button>
                </div>
                
                <button
                  onClick={() => setStep('form')}
                  className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  ← Recommencer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sauvegarde */}
      {step === 'save' && generatedImage && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Enregistrer comme personne recherchée
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img
                src={generatedImage}
                alt="Portrait final"
                className="w-full h-auto rounded-lg border-2 border-gray-200 dark:border-gray-700"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dernière localisation connue *
                </label>
                <input
                  type="text"
                  value={saveData.last_location}
                  onChange={(e) => setSaveData({...saveData, last_location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-white"
                  placeholder="Ex: Lomé, Bè-Kpota"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Circonstances / Contexte *
                </label>
                <textarea
                  value={saveData.circumstances}
                  onChange={(e) => setSaveData({...saveData, circumstances: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-white"
                  rows={5}
                  placeholder="Décrivez le contexte : délit, victime, témoin recherché..."
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('preview')}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? "Sauvegarde..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Composant helper pour les select
const SelectField = ({ label, value, onChange, options }: { label: string; value?: string; onChange: (v: string) => void; options: string[] }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-white"
    >
      <option value="">Sélectionner...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default PortraitRobot;
