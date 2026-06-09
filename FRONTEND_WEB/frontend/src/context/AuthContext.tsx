import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";

export type UserRole = "admin" | "superviseur" | "agent" | "citoyen";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  two_factor_enabled: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ requires_otp: boolean }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setIsLoading(false); return; }
    try {
      const res = await api.get("/api/v1/auth/me");
      setUser(res.data);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
    setIsLoading(false);
  };

  useEffect(() => { loadUser(); }, []);

  const login = async (email: string, password: string): Promise<{ requires_otp: boolean }> => {
    const res = await api.post("/api/v1/auth/login", { email, password });
    if (res.data.requires_otp) {
      return { requires_otp: true };
    }
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
    const meRes = await api.get("/api/v1/auth/me");
    setUser(meRes.data);
    navigate(meRes.data.role === "citoyen" ? "/citoyen/dashboard" : "/dashboard");
    return { requires_otp: false };
  };

  const verifyOtp = async (email: string, otp: string) => {
    const res = await api.post("/api/v1/auth/verify-otp", { email, otp });
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
    const meRes = await api.get("/api/v1/auth/me");
    setUser(meRes.data);
    navigate(meRes.data.role === "citoyen" ? "/citoyen/dashboard" : "/dashboard");
  };

  const logout = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      if (refresh_token) await api.post("/api/v1/auth/logout", { refresh_token });
    } catch { /* ignore */ }
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/signin");
  };

  const hasRole = (roles: UserRole[]) => !!user && roles.includes(user.role);

  const refreshUser = async () => {
    const res = await api.get("/api/v1/auth/me");
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, verifyOtp, logout, hasRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
