import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages TogoSecureNet
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Dashboard/Home";
import Alertes from "./pages/Alertes";
import Cameras from "./pages/Cameras";
import Personnes from "./pages/Personnes";
import Calendrier from "./pages/Calendrier";
import Statistiques from "./pages/Statistiques";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Support from "./pages/Support";

// Nouvelles pages Admin/Superviseur
import PersonnesDisparues from "./pages/PersonnesDisparues";
import EnginsVoles from "./pages/EnginsVoles";
import Notifications from "./pages/Notifications";
import Signalements from "./pages/Signalements";
import Detections from "./pages/Detections";
import Utilisateurs from "./pages/Utilisateurs";
import Audit from "./pages/Audit";
import PortraitRobot from "./pages/PortraitRobot";

// Pages Citoyen
import CitoyenDashboard from "./pages/Citoyen/Dashboard";
import CitoyenMesSignalements from "./pages/Citoyen/MesSignalements";
import CitoyenPersonnesDisparues from "./pages/Citoyen/PersonnesDisparues";
import CitoyenEnginsVoles from "./pages/Citoyen/EnginsVoles";
import CitoyenNotifications from "./pages/Citoyen/Notifications";

// Signalements publics
import ReportPerson from "./pages/ReportPerson";
import ReportVehicle from "./pages/ReportVehicle";

// Auth & Fallback
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import NotFound from "./pages/OtherPage/NotFound";

// Pages légales
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

export default function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Page d'accueil publique */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Pages légales publiques */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            
            {/* Pages de signalement publiques */}
            <Route path="/report/person" element={<ReportPerson />} />
            <Route path="/report/vehicle" element={<ReportVehicle />} />

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Dashboard Admin/Superviseur (protégé) */}
            <Route element={
              <ProtectedRoute allowedRoles={['admin', 'superviseur', 'agent']}>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/personnes-disparues" element={<PersonnesDisparues />} />
              <Route path="/engins-voles" element={<EnginsVoles />} />
              <Route path="/cameras" element={<Cameras />} />
              <Route path="/alertes" element={<Alertes />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/signalements" element={<Signalements />} />
              <Route path="/detections" element={<Detections />} />
              <Route path="/portrait-robot" element={<PortraitRobot />} />
              <Route path="/statistiques" element={<Statistiques />} />
              
              {/* Anciennes pages (à garder pour compatibilité) */}
              <Route path="/personnes" element={<Personnes />} />
              <Route path="/calendrier" element={<Calendrier />} />
              
              {/* Profil & Settings */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<Support />} />
            </Route>

            {/* Admin uniquement */}
            <Route element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/utilisateurs" element={<Utilisateurs />} />
              <Route path="/audit" element={<Audit />} />
            </Route>

            {/* Dashboard Citoyen (protégé) */}
            <Route element={
              <ProtectedRoute allowedRoles={['citoyen']}>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/citoyen/dashboard" element={<CitoyenDashboard />} />
              <Route path="/citoyen/mes-signalements" element={<CitoyenMesSignalements />} />
              <Route path="/citoyen/personnes-disparues" element={<CitoyenPersonnesDisparues />} />
              <Route path="/citoyen/engins-voles" element={<CitoyenEnginsVoles />} />
              <Route path="/citoyen/notifications" element={<CitoyenNotifications />} />
              <Route path="/citoyen/profile" element={<Profile />} />
              <Route path="/citoyen/settings" element={<Settings />} />
              <Route path="/citoyen/support" element={<Support />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
