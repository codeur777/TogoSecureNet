import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import api from "../../services/api";
import toast from "react-hot-toast";

type Step = "form" | "otp";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isChecked) {
      toast.error("Veuillez accepter les conditions");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/v1/auth/signup", {
        ...formData,
        role: "citoyen"
      });
      toast.success("Code de vérification envoyé !");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/v1/auth/signup/verify", {
        email: formData.email,
        otp
      });
      toast.success("Compte créé ! Connectez-vous.");
      navigate("/signin");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Code invalide");
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <>
        <div className="mb-5 sm:mb-8 text-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Vérifiez votre email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Code envoyé à <strong>{formData.email}</strong>
          </p>
        </div>
        
        <form onSubmit={handleOtpSubmit}>
          <div className="space-y-5">
            <div>
              <Label>Code OTP</Label>
              <Input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-bold"
                required
                autoFocus
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || otp.length !== 6}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Vérification..." : "Valider"}
            </button>

            <button 
              type="button"
              onClick={() => { setStep("form"); setOtp(""); }}
              className="text-sm text-gray-500 hover:text-gray-700 w-full text-center"
            >
              ← Retour
            </button>
          </div>
        </form>
      </>
    );
  }
  
  return (
    <>
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Inscription
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Créez votre compte
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Prénom */}
            <div className="sm:col-span-1">
              <Label>
                Prénom<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                id="fname"
                name="fname"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="Entrez votre prénom"
                required
              />
            </div>
            {/* Nom */}
            <div className="sm:col-span-1">
              <Label>
                Nom<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                id="lname"
                name="lname"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Entrez votre nom"
                required
              />
            </div>
          </div>
          
          {/* Email */}
          <div>
            <Label>
              E-mail<span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Entrez votre e-mail"
              required
            />
          </div>
          
          {/* Mot de passe */}
          <div>
            <Label>
              Mot de passe<span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Entrez votre mot de passe"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
          </div>
          
          {/* Checkbox */}
          <div className="flex items-center gap-3">
            <Checkbox
              className="w-5 h-5"
              checked={isChecked}
              onChange={setIsChecked}
            />
            <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
              En créant un compte, vous acceptez les{" "}
              <span className="text-gray-800 dark:text-white/90">
                Conditions Générales
              </span>{" "}
              et notre{" "}
              <span className="text-gray-800 dark:text-white">
                Politique de Confidentialité
              </span>
            </p>
          </div>
          
          {/* Bouton */}
          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-5">
        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
          Vous avez déjà un compte?{" "}
          <Link
            to="/signin"
            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </>
  );
}
