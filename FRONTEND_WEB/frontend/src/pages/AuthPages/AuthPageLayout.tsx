import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        <div className="flex items-center justify-center w-full lg:w-1/2 p-6 sm:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <div className="mb-4">
                <img 
                    src="/images/logo_emble-removebg.png" 
                    alt="TogoSecureNet Logo" 
                    className="h-70 w-50 drop-shadow-lg"
                  />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">TogoSecureNet</h2>
              <p className="text-center text-gray-400 dark:text-white/60">
                Système de surveillance intelligente pour la sécurité nationale
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
