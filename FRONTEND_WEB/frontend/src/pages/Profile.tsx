import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageMeta from "../components/common/PageMeta";
import PageBreadCrumb from "../components/common/PageBreadCrumb";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/api/v1/users/me", formData);
      await refreshUser();
      toast.success("Profil mis à jour");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta 
        title="Profil" 
        description="Profil utilisateur"
      />
      
      <PageBreadCrumb pageTitle="Modifier le profil" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Informations personnelles
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prénom
                </label>
                <Input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom
                </label>
                <Input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+228 90 00 00 00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email (non modifiable)
              </label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
