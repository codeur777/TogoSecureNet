import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Persons from './pages/Persons';
import Cameras from './pages/Cameras';
import Alerts from './pages/Alerts';
import Statistics from './pages/Statistics';
import Login from './pages/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import useWebSocket from './hooks/useWebSocket';

function App() {
  useWebSocket();
  
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Route publique de connexion */}
        <Route path="/login" element={<Login />} />
        
        {/* Toutes les autres routes sont protégées */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/persons" element={<Persons />} />
                  <Route path="/cameras" element={<Cameras />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/stats" element={<Statistics />} />
                  {/* Redirection par défaut vers le dashboard si route inconnue */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
