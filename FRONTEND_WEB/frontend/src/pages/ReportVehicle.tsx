import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";

export default function ReportVehicle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleType: "car",
    brand: "",
    model: "",
    color: "",
    plateNumber: "",
    yearManufacture: "",
    theftLocation: "",
    theftDate: "",
    theftTime: "",
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    policeReportNumber: ""
  });
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Logique d'envoi au backend à implémenter
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Signalement enregistré avec succès. Référence: #TSV" + Math.random().toString(36).substring(7).toUpperCase());
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error("Erreur lors de l'envoi du signalement");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <PageMeta
        title="Signaler un Véhicule Volé | TogoSecureNet"
        description="Formulaire de signalement de véhicule ou engin volé"
      />

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        {/* Header Simple */}
        <header className="bg-white shadow-sm border-b-2 border-yellow-600">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/images/logo_emble-removebg.png" 
                  alt="TogoSecureNet Logo" 
                  className="h-8 w-8"
                />
                <span className="font-bold text-yellow-800 text-lg">TogoSecureNet</span>
              </Link>
              <Link to="/" className="text-sm text-gray-600 hover:text-yellow-700 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </header>

        {/* Formulaire */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Signalement de Véhicule Volé
                </h1>
                <p className="text-gray-600">
                  Fournissez le maximum de détails sur le véhicule volé
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type et caractéristiques du véhicule */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Caractéristiques du véhicule
                  </h2>

                  <div>
                    <Label>Type de véhicule <span className="text-red-500">*</span></Label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-sm border rounded-lg border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    >
                      <option value="car">Voiture</option>
                      <option value="motorcycle">Moto</option>
                      <option value="truck">Camion</option>
                      <option value="bus">Bus</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Marque <span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Ex: Toyota, Honda, Mercedes..."
                        required
                      />
                    </div>

                    <div>
                      <Label>Modèle <span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="Ex: Corolla, Civic, C-Class..."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Couleur <span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="Ex: Noir, Blanc..."
                        required
                      />
                    </div>

                    <div>
                      <Label>Immatriculation <span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="plateNumber"
                        value={formData.plateNumber}
                        onChange={handleChange}
                        placeholder="Ex: TG-XXXX-XX"
                        required
                      />
                    </div>

                    <div>
                      <Label>Année de fabrication</Label>
                      <Input
                        type="number"
                        name="yearManufacture"
                        value={formData.yearManufacture}
                        onChange={handleChange}
                        placeholder="Ex: 2020"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Photos du véhicule (si disponibles)</Label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setPhotos(e.target.files)}
                      className="w-full px-4 py-3 text-sm border rounded-lg border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG (max 5MB par photo)</p>
                  </div>

                  <div>
                    <Label>Signes distinctifs ou dommages</Label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Décrivez tout signe distinctif, rayure, accessoire particulier..."
                      className="w-full px-4 py-3 text-sm border rounded-lg border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                {/* Circonstances du vol */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Circonstances du vol
                  </h2>

                  <div>
                    <Label>Lieu du vol <span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      name="theftLocation"
                      value={formData.theftLocation}
                      onChange={handleChange}
                      placeholder="Ex: Lomé, Rue X, devant la boutique Y..."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Date du vol <span className="text-red-500">*</span></Label>
                      <Input
                        type="date"
                        name="theftDate"
                        value={formData.theftDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <Label>Heure approximative</Label>
                      <Input
                        type="time"
                        name="theftTime"
                        value={formData.theftTime}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Numéro du dépôt de plainte (si déjà effectué)</Label>
                    <Input
                      type="text"
                      name="policeReportNumber"
                      value={formData.policeReportNumber}
                      onChange={handleChange}
                      placeholder="Numéro de référence du commissariat"
                    />
                  </div>
                </div>

                {/* Informations de contact */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Vos informations de contact
                  </h2>

                  <div>
                    <Label>Votre nom complet <span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Téléphone <span className="text-red-500">*</span></Label>
                      <Input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="+228 XX XX XX XX"
                        required
                      />
                    </div>

                    <div>
                      <Label>E-mail</Label>
                      <Input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                  >
                    {loading ? "Envoi en cours..." : "Envoyer le signalement"}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Les informations fournies seront traitées de manière confidentielle conformément à la législation en vigueur.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
