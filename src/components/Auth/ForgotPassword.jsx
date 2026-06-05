import { useState } from "react";
import { Link } from "react-router-dom";
import axiosPublic from "../../services/axiosPublic";

export default function ForgotPassword() {
  const [email, setEmail]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [tempPassword, setTempPassword] = useState(null);
  const [copied, setCopied]           = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosPublic.post("/forgot-password", { email });
      setTempPassword(res.data?.data?.temp_password);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4
      bg-gradient-to-br from-[#caf0f8] via-[#e0f4ff] to-[#dbeeff]
      relative overflow-hidden font-[Outfit,Inter,sans-serif]"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-14 -left-14 w-56 h-56 rounded-full bg-white/40 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/30 pointer-events-none" />

      <div
        className="relative z-10 w-full max-w-[460px] rounded-3xl overflow-hidden
        shadow-[0_24px_80px_rgba(3,4,94,0.14),0_4px_16px_rgba(3,4,94,0.06)]
        bg-white px-8 py-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline mb-8 justify-center">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
            bg-gradient-to-br from-[#0077b6] to-[#00b4d8]
            shadow-[0_3px_10px_rgba(0,119,182,0.30)]"
          >
            <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
              <path
                d="M32 8C24 8 16 15 16 25C16 33 20 40 22 48C24 56 24 64 24 73
                C24 78 26 82 30 82C34 82 36 78 38 73C40 68 42 64 50 64
                C58 64 60 68 62 73C64 78 66 82 70 82C74 82 76 78 76 73
                C76 64 76 56 78 48C80 40 84 33 84 25C84 15 76 8 68 8
                C63 8 57 11 50 11C43 11 37 8 32 8Z"
                fill="white"
              />
              <path
                d="M36 20C40 26 44 28 50 28C56 28 60 26 64 20"
                stroke="rgba(144,224,239,0.9)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[1rem] font-black tracking-tight text-slate-900">
            DENT<span className="text-[#0077b6]">ORA</span>
          </span>
        </Link>

        {tempPassword ? (
          /* ── Mot de passe généré ── */
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full bg-emerald-100 flex items-center
              justify-center mx-auto mb-5"
            >
              <svg width="30" height="30" fill="none" stroke="#059669" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h2 className="text-[1.4rem] font-black text-slate-900 mb-1.5">
              Mot de passe généré !
            </h2>
            <p className="text-slate-500 text-[0.84rem] leading-relaxed mb-5">
              Copiez ce mot de passe temporaire et utilisez-le pour vous
              connecter. Pensez à le changer ensuite depuis votre profil.
            </p>

            {/* Bloc mot de passe + bouton copier */}
            <div
              className="flex items-center justify-between gap-3 px-4 py-3
              bg-slate-50 border-[1.5px] border-slate-200 rounded-xl mb-2"
            >
              <span className="font-mono text-[1.05rem] font-bold text-slate-800 tracking-widest select-all">
                {tempPassword}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copier le mot de passe"
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  text-[0.75rem] font-bold border-none cursor-pointer transition-all duration-150
                  ${copied
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-[#0077b6] text-white hover:bg-[#005f8e]"
                  }`}
              >
                {copied ? (
                  <>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Copié !
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copier
                  </>
                )}
              </button>
            </div>

            <p className="text-[0.75rem] text-amber-600 bg-amber-50 border border-amber-200
              rounded-lg px-3 py-2 mb-6 text-left leading-relaxed">
              ⚠️ Notez ce mot de passe maintenant — il ne sera plus affiché après avoir quitté cette page.
            </p>

            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full h-12
              rounded-xl bg-slate-900 text-white font-bold text-[0.875rem] no-underline
              hover:bg-[#0077b6] transition-colors
              shadow-[0_4px_16px_rgba(15,23,42,0.25)]"
            >
              Se connecter
            </Link>
          </div>
        ) : (
          /* ── Formulaire email ── */
          <>
            <div className="text-center mb-6">
              <div
                className="w-14 h-14 rounded-2xl bg-[#e0f4ff] flex items-center
                justify-center mx-auto mb-4"
              >
                <svg width="26" height="26" fill="none" stroke="#0077b6" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 className="text-[1.6rem] font-black text-slate-900 tracking-tight mb-1.5">
                Mot de passe oublié ?
              </h1>
              <p className="text-slate-500 text-[0.84rem] leading-relaxed">
                Entrez votre email, nous allons générer un mot de passe
                temporaire que vous pourrez copier.
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 px-3 py-2.5 mb-4
                  bg-red-50 border border-red-200 rounded-xl text-red-600 text-[0.8rem]"
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" className="shrink-0">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0
                    11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="forgot-email"
                  className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider"
                >
                  Adresse email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean.dupont@exemple.com"
                  required
                  autoComplete="email"
                  className="w-full h-12 px-4 rounded-xl text-[0.875rem] text-slate-900
                    bg-slate-50 border-[1.5px] border-slate-200
                    outline-none transition-all duration-150
                    focus:border-[#0077b6] focus:bg-white
                    focus:shadow-[0_0_0_3px_rgba(0,119,182,0.10)]
                    placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 mt-1 rounded-xl font-bold text-[0.875rem]
                  text-white tracking-wide border-none cursor-pointer
                  flex items-center justify-center gap-2
                  transition-all duration-150
                  ${
                    loading
                      ? "bg-slate-400 cursor-not-allowed shadow-none"
                      : "bg-slate-900 shadow-[0_4px_16px_rgba(15,23,42,0.25)] hover:bg-[#0077b6] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,119,182,0.40)]"
                  }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Génération...
                  </>
                ) : (
                  "Générer un mot de passe"
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-[0.82rem] text-slate-500">
              <Link
                to="/login"
                className="text-[#0077b6] font-bold no-underline hover:underline transition-all"
              >
                ← Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
