import PageMeta from "../components/common/PageMeta";

export default function Statistiques() {
  return (
    <>
      <PageMeta
        title="Statistiques | TOGO-SecureNet"
        description="Analyses des détections et rapports de sécurité TogoSecureNet"
      />

      <div className="space-y-6">
        {/* En-tête */}
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Statistiques Analytiques
            </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Indicateurs clés de performance et rapports sur l'activité des caméras et de la reconnaissance faciale.
          </p>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Taux de Reconnaissance Moyen</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-gray-800 dark:text-white/95">94.8%</span>
              <span className="rounded-lg p-2 bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Caméra la Plus Active</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-gray-800 dark:text-white/95">LOM-MARCHE-01</span>
              <span className="rounded-lg p-1.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-sm">📹</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Temps Moyen de Réponse</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-gray-800 dark:text-white/95">1.4 sec</span>
              <span className="rounded-lg p-2 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">⚡</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Évolution temporelle des alertes */}
          <div className="col-span-12 lg:col-span-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Alertes par Jour (Semaine)
              </h3>
              <p className="text-xs text-gray-400 mt-1">Comparatif des détections quotidiennes résolues vs critiques</p>
            </div>
            
            <div className="mt-6 h-64 flex items-end gap-3 sm:gap-6 border-b border-l border-gray-100 dark:border-gray-800 p-4">
              {/* Lundi */}
              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{ height: "45%" }} title="Alertes: 12"></div>
                  <div className="w-3 sm:w-4 bg-red-500 rounded-t" style={{ height: "15%" }} title="Critiques: 4"></div>
                </div>
                <span className="text-[10px] text-gray-400">Lun</span>
              </div>
              {/* Mardi */}
              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{ height: "60%" }} title="Alertes: 18"></div>
                  <div className="w-3 sm:w-4 bg-red-500 rounded-t" style={{ height: "25%" }} title="Critiques: 7"></div>
                </div>
                <span className="text-[10px] text-gray-400">Mar</span>
              </div>
              {/* Mercredi */}
              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{ height: "35%" }} title="Alertes: 9"></div>
                  <div className="w-3 sm:w-4 bg-red-500 rounded-t" style={{ height: "10%" }} title="Critiques: 2"></div>
                </div>
                <span className="text-[10px] text-gray-400">Mer</span>
              </div>
              {/* Jeudi */}
              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{ height: "85%" }} title="Alertes: 26"></div>
                  <div className="w-3 sm:w-4 bg-red-500 rounded-t" style={{ height: "40%" }} title="Critiques: 12"></div>
                </div>
                <span className="text-[10px] text-gray-400">Jeu</span>
              </div>
              {/* Vendredi */}
              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{ height: "70%" }} title="Alertes: 21"></div>
                  <div className="w-3 sm:w-4 bg-red-500 rounded-t" style={{ height: "30%" }} title="Critiques: 9"></div>
                </div>
                <span className="text-[10px] text-gray-400">Ven</span>
              </div>
              {/* Samedi */}
              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{ height: "30%" }} title="Alertes: 8"></div>
                  <div className="w-3 sm:w-4 bg-red-500 rounded-t" style={{ height: "5%" }} title="Critiques: 1"></div>
                </div>
                <span className="text-[10px] text-gray-400">Sam</span>
              </div>
              {/* Dimanche */}
              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{ height: "15%" }} title="Alertes: 4"></div>
                  <div className="w-3 sm:w-4 bg-red-500 rounded-t" style={{ height: "0%" }} title="Critiques: 0"></div>
                </div>
                <span className="text-[10px] text-gray-400">Dim</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Alertes Générales
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-500 rounded-sm"></span> Cas Critiques (Urgents)
              </div>
            </div>
          </div>

          {/* Top caméras actives */}
          <div className="col-span-12 lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="font-semibold text-gray-800 dark:text-white/90">📹 Top Caméras Actives</h3>
            <p className="text-xs text-gray-400 mt-1">Nombre d'alertes générées par caméra</p>

            <div className="mt-6 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  <span>LOM-MARCHE-01 (Lomé)</span>
                  <span>42 alertes</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  <span>LOM-AERO-04 (Lomé)</span>
                  <span>28 alertes</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-success-500 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  <span>LOM-PORT-02 (Lomé)</span>
                  <span>14 alertes</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-warning-500 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  <span>ATAK-ROUTE-01 (Atakpamé)</span>
                  <span>5 alertes</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "12%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
