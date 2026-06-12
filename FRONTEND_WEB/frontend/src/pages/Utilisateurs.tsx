import { useState, useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";
import toast from "react-hot-toast";

interface Utilisateur {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'superviseur' | 'agent' | 'citoyen';
  status: 'actif' | 'inactif' | 'suspendu';
  created_at: string;
  last_login: string;
}

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'tous' | 'admin' | 'superviseur' | 'agent' | 'citoyen'>('tous');
  
  // Form state pour nouvel utilisateur
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    role: '',
    password: ''
  });

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/users");
      setUtilisateurs(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.prenom || !formData.nom || !formData.email || !formData.role || !formData.password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      await api.post("/api/v1/users/", {
        first_name: formData.prenom,
        last_name: formData.nom,
        email: formData.email,
        phone: formData.telephone,
        role: formData.role,
        password: formData.password
      });
      
      toast.success("✅ Utilisateur créé avec succès");
      setShowModal(false);
      setFormData({ prenom: '', nom: '', email: '', telephone: '', role: '', password: '' });
      
      // Recharger la liste des utilisateurs
      await fetchUtilisateurs();
    } catch (error: any) {
      console.error("Erreur création utilisateur:", error);
      const errorMsg = error.response?.data?.detail || "Erreur lors de la création de l'utilisateur";
      toast.error(errorMsg);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    
    try {
      await api.delete(`/api/v1/users/${id}`);
      toast.success("Utilisateur supprimé");
      fetchUtilisateurs();
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Impossible de supprimer l'utilisateur");
    }
  };



  const filteredUtilisateurs = utilisateurs.filter(u =>
    filter === 'tous' ? true : u.role === filter
  );

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      superviseur: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      agent: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      citoyen: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    };
    return badges[role as keyof typeof badges] || badges.citoyen;
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: "Administrateur",
      superviseur: "Superviseur",
      agent: "Agent de police",
      citoyen: "Citoyen"
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      actif: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      inactif: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      suspendu: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    return badges[statut as keyof typeof badges] || badges.inactif;
  };

  return (
    <>
      <PageMeta
        title="Utilisateurs | TOGO-SecureNet"
        description="Gestion des utilisateurs de la plateforme"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Gestion des utilisateurs
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Administrez les comptes utilisateurs de la plateforme
        </p>
      </div>
      
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('tous')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'tous'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Tous ({utilisateurs.length})
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'admin'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Admins ({utilisateurs.filter(u => u.role === 'admin').length})
          </button>
          <button
            onClick={() => setFilter('superviseur')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'superviseur'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Superviseurs ({utilisateurs.filter(u => u.role === 'superviseur').length})
          </button>
          <button
            onClick={() => setFilter('agent')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'agent'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Agents ({utilisateurs.filter(u => u.role === 'agent').length})
          </button>
          <button
            onClick={() => setFilter('citoyen')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'citoyen'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Citoyens ({utilisateurs.filter(u => u.role === 'citoyen').length})
          </button>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouvel utilisateur
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUtilisateurs.map((utilisateur) => (
                  <tr key={utilisateur.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center font-semibold text-brand-700 dark:text-brand-300">
                          {utilisateur.first_name?.charAt(0)}{utilisateur.last_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {utilisateur.full_name || `${utilisateur.first_name} ${utilisateur.last_name}`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: #{utilisateur.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white">{utilisateur.email}</p>
                        <p className="text-gray-500 dark:text-gray-400">{utilisateur.phone || "—"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(utilisateur.role)}`}>
                        {getRoleLabel(utilisateur.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(utilisateur.status)}`}>
                        {utilisateur.status.charAt(0).toUpperCase() + utilisateur.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {utilisateur.last_login ? new Date(utilisateur.last_login).toLocaleString('fr-FR') : 'Jamais'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {/* TODO: Ouvrir modal edit */}}
                          className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(utilisateur.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredUtilisateurs.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl mt-6">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun utilisateur trouvé</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aucun résultat pour ce filtre.
          </p>
        </div>
      )}

      {/* Modal Nouvel utilisateur */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nouvel utilisateur
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Prénom"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
                />
                <select 
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="superviseur">Superviseur</option>
                  <option value="agent">Agent de police</option>
                </select>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition"
                >
                  Créer l'utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Utilisateurs;
