import PageMeta from "../../components/common/PageMeta";

const CitoyenDashboard = () => {
  return (
    <>
      <PageMeta
        title="Espace Citoyen | TOGO-SecureNet"
        description="Plateforme citoyenne de signalement"
      />
      
      <div className="mb-8">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur TogoSecureNet</h1>
          <p className="text-brand-100">
            Plateforme citoyenne de signalement et de recherche de personnes disparues et d'engins volés
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-xl">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">3</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Mes signalements</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-xl">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">1</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">2</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Validés</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-xl">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">5</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <a
              href="/report/person"
              className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/20 transition group"
            >
              <div className="bg-blue-500 p-3 rounded-lg group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Signaler une personne disparue</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Déclarez la disparition d'une personne</p>
              </div>
            </a>

            <a
              href="/report/vehicle"
              className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/20 transition group"
            >
              <div className="bg-orange-500 p-3 rounded-lg group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Signaler un engin volé</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Déclarez le vol d'un véhicule</p>
              </div>
            </a>

            <a
              href="/citoyen/mes-signalements"
              className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/20 transition group"
            >
              <div className="bg-green-500 p-3 rounded-lg group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Consulter mes signalements</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Suivez l'état de vos déclarations</p>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications récentes</h2>
          <div className="space-y-4">
            <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <div className="bg-blue-500 p-2 rounded-lg h-fit">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Signalement validé</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Votre signalement #123 a été validé par les autorités
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Il y a 2 heures</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <div className="bg-green-500 p-2 rounded-lg h-fit">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Personne retrouvée</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  La personne de votre signalement #120 a été retrouvée
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Il y a 1 jour</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
              <div className="bg-yellow-500 p-2 rounded-lg h-fit">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Information manquante</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Complétez les informations de votre signalement #124
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Il y a 2 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="bg-white/20 p-4 rounded-xl">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Ensemble pour plus de sécurité</h2>
            <p className="text-green-100">
              Votre contribution aide les autorités à retrouver les personnes disparues et les biens volés plus rapidement.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CitoyenDashboard;
