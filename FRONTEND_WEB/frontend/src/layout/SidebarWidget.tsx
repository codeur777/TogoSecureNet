export default function SidebarWidget() {
  return (
    <div
      className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]"
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <img src="/images/logo_emble-removebg.png" alt="Logo" className="h-7 w-5" />
        TOGO-SecureNet
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Système de Surveillance Intelligente v1.0.0
      </p>
      <div className="flex items-center justify-center gap-2 p-2.5 font-medium text-success-700 bg-success-50 dark:bg-success-500/10 dark:text-success-400 rounded-lg text-xs">
        <span className="w-2.5 h-2.5 bg-success-500 rounded-full animate-pulse"></span>
        <span>Système Connecté</span>
      </div>
    </div>
  );
}
