import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import PageBreadCrumb from "../components/common/PageBreadCrumb";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import toast from "react-hot-toast";

export default function Support() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("technique");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi du ticket de support
    toast.success("Votre demande de support a été envoyée avec succès");
    setSubject("");
    setMessage("");
  };

  return (
    <>
      <PageMeta
        title="Support | TogoSecureNet"
        description="Contactez le support TogoSecureNet"
      />
      <PageBreadCrumb pageName="Support" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de contact */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Contactez le support technique
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Catégorie</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 text-sm border rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="technique">Problème technique</option>
                  <option value="compte">Compte et accès</option>
                  <option value="camera">Configuration caméra</option>
                  <option value="alerte">Gestion des alertes</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <Label>Sujet</Label>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Décrivez brièvement votre problème"
                  required
                />
              </div>
              <div>
                <Label>Message</Label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre problème en détail..."
                  rows={6}
                  className="w-full px-4 py-3 text-sm border rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <Button type="submit" size="sm">
                Envoyer la demande
              </Button>
            </form>
          </div>
        </div>

        {/* Informations de contact */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Informations de contact
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">E-mail</p>
                <p className="text-gray-800 dark:text-white">support@togosecurenet.tg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Téléphone</p>
                <p className="text-gray-800 dark:text-white">+228 XX XX XX XX</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Heures d'ouverture</p>
                <p className="text-gray-800 dark:text-white">Lun - Ven: 8h00 - 18h00</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              FAQ
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">
                  Comment ajouter une caméra ?
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allez dans la section Caméras et cliquez sur "Ajouter une caméra"
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">
                  Comment gérer les alertes ?
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consultez la section Alertes en direct pour voir et gérer toutes les alertes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
