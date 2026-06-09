import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../../services/api";
import toast from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";

type Step = "email" | "otp" | "password";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/v1/auth/forgot-password", { email });
      toast.success("Code OTP envoyé");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Erreur");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/v1/auth/verify-reset-otp", { email, otp });
      setStep("password");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Code invalide");
    } finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("Mots de passe différents"); return; }
    setLoading(true);
    try {
      await api.post("/api/v1/auth/reset-password", { email, otp, new_password: newPassword, confirm_password: confirmPassword });
      toast.success("Mot de passe réinitialisé !");
      navigate("/signin");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Erreur");
    } finally { setLoading(false); }
  };

  const inputCls = "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none";
  const btnCls = "w-full py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 disabled:opacity-50 transition";

  return (
    <>
      <PageMeta title="Mot de passe oublié | TogoSecureNet" description="" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">

          {/* Indicateur d'étapes */}
          <div className="flex items-center gap-2 mb-8">
            {(["email", "otp", "password"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                  step === s ? "bg-brand-600 text-white" : 
                  (["email","otp","password"].indexOf(step) > i) ? "bg-brand-200 text-brand-700" : "bg-gray-200 text-gray-500"
                }`}>{i + 1}</div>
                {i < 2 && <div className={`flex-1 h-1 rounded ${["email","otp","password"].indexOf(step) > i ? "bg-brand-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {step === "email" && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Mot de passe oublié</h2>
                <p className="text-sm text-gray-500 mt-1">Entrez votre email pour recevoir un code</p>
              </div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.tg" className={inputCls} required autoFocus />
              <button type="submit" disabled={loading} className={btnCls}>{loading ? "Envoi..." : "Envoyer le code"}</button>
              <Link to="/signin" className="text-sm text-center text-gray-500 hover:text-gray-700">← Retour</Link>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Entrez le code OTP</h2>
                <p className="text-sm text-gray-500 mt-1">Code envoyé à <strong>{email}</strong></p>
              </div>
              <input
                type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full text-center text-2xl tracking-[1rem] font-bold px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required autoFocus
              />
              <button type="submit" disabled={loading || otp.length !== 6} className={btnCls}>{loading ? "Vérification..." : "Valider"}</button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleReset} className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Nouveau mot de passe</h2>
                <p className="text-sm text-gray-500 mt-1">Choisissez un mot de passe sécurisé</p>
              </div>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe (min. 6)" className={inputCls} required autoFocus />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmer le mot de passe" className={inputCls} required />
              <button type="submit" disabled={loading} className={btnCls}>{loading ? "Réinitialisation..." : "Réinitialiser"}</button>
            </form>
          )}

        </div>
      </div>
    </>
  );
}
