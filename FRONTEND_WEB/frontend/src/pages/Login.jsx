import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (localStorage.getItem('access_token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // OAuth2 form data
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await api.post('/api/v1/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      localStorage.setItem('access_token', response.data.access_token);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (error) {
      console.error('Login error', error);
      toast.error('Échec de la connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] relative overflow-hidden font-['Outfit']">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px]"></div>
      
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md p-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] z-10 transition-all duration-500 hover:border-white/20">
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-3xl mb-6 shadow-[0_12px_40px_-8px_rgba(147,51,234,0.4)] group overflow-hidden">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            SecureNet
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">SURVEILLANCE INTELLIGENTE · TOGO</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-7">
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Email Professionnel</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all duration-300"
                placeholder="admin@togosecurenet.tg"
                required
              />
            </div>
          </div>
          
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Mot de Passe</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 bg-white text-black font-bold rounded-2xl shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)] transform transition-all hover:bg-slate-100 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vérification...
              </span>
            ) : 'Accéder au Terminal'}
          </button>
        </form>
        
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-600 font-medium tracking-tighter leading-relaxed">
            SYSTÈME SÉCURISÉ · TOUTE TENTATIVE D'ACCÈS NON AUTORISÉE SERA ENREGISTRÉE ET SIGNALÉE AUX AUTORITÉS COMPÉTENTES.
          </p>
        </div>
      </div>
      
      {/* Subtle footer decorative element */}
      <div className="absolute bottom-8 text-slate-800 text-[10px] font-black tracking-[0.5em] uppercase">
        Republic of Togo · Security Intelligence Division
      </div>
    </div>
  );
};

export default Login;
