import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";

export default function ReportPerson() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "male",
    lastSeenLocation: "",
    lastSeenDate: "",
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: ""
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Logique d'envoi au backend à implémenter
      console.log("Signalement soumis:", { formData, photo });
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Signalement enregistré avec succès. Référence: #TSN" + Math.random().toString(36).substring(7).toUpperCase());
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
        title="Signaler une Personne Disparue | TogoSecureNet"
        description="Formulaire de signalement de personne disparue ou recherchée"
      />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
        {/* Header Simple */}
        <header className="bg-white shadow-sm border-b-2 border-green-600">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/images/logo_emble-removebg.png"
                  alt="TogoSecureNet Logo"
                  className="h-8 w-8"
                />
                <span className="font-bold text-green-800 text-lg">TogoSecureNet</span>
              </Link>
              <Link to="/" className="text-sm text-gray-600 hover:text-green-700 flex items-center gap-1">
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Signalement de Personne Disparue
                </h1>
                <p className="text-gray-600">
                  Remplissez ce formulaire avec le maximum de détails possibles
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations sur la personne */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Informations sur la personne
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom complet <span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Prénom et nom"
                        required
                      />
                    </div>

                    <div>
                      <Label>Âge approximatif <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Ex: 25"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Sexe <span className="text-red-500">*</span></Label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-sm border rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="male">Masculin</option>
                      <option value="female">Féminin</option>
                    </select>
                  </div>

                  <div>
                    <Label>Photo (si disponible)</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 text-sm border rounded-lg border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format accepté: JPG, PNG (max 5MB)</p>
                  </div>

                  <div>
                    <Label>Description physique <span className="text-red-500">*</span></Label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Taille, corpulence, signes distinctifs, vêtements portés lors de la disparition..."
                      className="w-full px-4 py-3 text-sm border rounded-lg border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Circonstances de la disparition */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Circonstances de la disparition
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Dernière localisation connue <span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="lastSeenLocation"
                        value={formData.lastSeenLocation}
                        onChange={handleChange}
                        placeholder="Ex: Lomé, Quartier X"
                        required
                      />
                    </div>

                    <div>
                      <Label>Date de disparition <span className="text-red-500">*</span></Label>
                      <Input
                        type="date"
                        name="lastSeenDate"
                        value={formData.lastSeenDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
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
                    className="flex-1 bg-green-600 hover:bg-green-700"
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
