import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";

const ForceChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("Le nouveau mot de passe doit être différent de l'ancien");
      return;
    }

    try {
      setLoading(true);
      await api.put("/api/v1/auth/settings/change-password", {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });

      toast.success("✅ Mot de passe modifié avec succès");
      
      // Rediriger vers le dashboard après 1 seconde
      setTimeout(() => {
        window.location.href = "/dashboard"; // Recharger complètement pour mettre à jour le contexte
      }, 1000);
    } catch (error: any) {
      console.error("Erreur changement mot de passe:", error);
      const errorMsg = error.response?.data?.detail || "Erreur lors du changement de mot de passe";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Changement de mot de passe obligatoire | TOGO-SecureNet"
        description="Veuillez changer votre mot de passe"
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="max-w-md w-full">
          {/* Alerte de sécurité */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-4 mb-6 flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 dark:text-yellow-300 mb-1">
                🔐 Changement de mot de passe requis
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                Votre compte a été créé par un administrateur. Pour des raisons de sécurité, 
                vous devez définir un nouveau mot de passe avant de continuer.
              </p>
            </div>
          </div>

          {/* Carte principale */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full mb-4">
                <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Nouveau mot de passe
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choisissez un mot de passe sécurisé que vous seul connaissez
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mot de passe actuel */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  required
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="Mot de passe fourni par l'admin"
                />
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="Minimum 6 caractères"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Utilisez un mot de passe fort avec lettres, chiffres et symboles
                </p>
              </div>

              {/* Confirmer mot de passe */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="Retapez le nouveau mot de passe"
                />
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Modification en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Modifier le mot de passe
                  </>
                )}
              </button>
            </form>

            {/* Conseils de sécurité */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                💡 Conseils de sécurité
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li>✓ Utilisez au moins 8 caractères</li>
                <li>✓ Mélangez majuscules, minuscules et chiffres</li>
                <li>✓ Ajoutez des caractères spéciaux (!@#$%)</li>
                <li>✓ N'utilisez pas d'informations personnelles</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
            🔒 Cette action est requise pour sécuriser votre compte
          </p>
        </div>
      </div>
    </>
  );
};

export default ForceChangePassword;
