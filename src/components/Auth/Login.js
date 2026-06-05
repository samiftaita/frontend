import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/* ── Eye toggle button ── */
const EyeBtn = ({ show, toggle }) => (
  <button
    type="button"
    onClick={toggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
      hover:text-slate-600 transition-colors p-1 bg-transparent border-none cursor-pointer"
  >
    <svg
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      {show ? (
        <>
          <path
            d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94
            M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19
            m-6.72-1.07a3 3 0 11-4.24-4.24"
          />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  </button>
);

/* ── Feature badge used in the right panel ── */
const Feature = ({ label, children }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="w-9 h-9 rounded-xl bg-white/10 border border-white/15
      flex items-center justify-content-center p-2"
    >
      {children}
    </div>
    <span className="text-[0.62rem] text-white/65 font-semibold text-center leading-tight">
      {label}
    </span>
  </div>
);

EyeBtn.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

EyeBtn.defaultProps = {
  show: false,
  toggle: () => {},
};

Feature.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    if (res.success) {
      const r = res.user?.role;
      navigate(
        r === "admin"
          ? "/admin/dashboard"
          : r === "dentiste"
            ? "/dentiste/dashboard"
            : "/patient/dashboard",
      );
    } else {
      setError(res.error || "Identifiants incorrects");
      setLoading(false);
    }
  };

  return (
    /* ══════════════════════════════════════════
       PAGE — gradient background
    ══════════════════════════════════════════ */
    <main
      className="min-h-screen flex items-center justify-center p-4
      bg-gradient-to-br from-[#caf0f8] via-[#e0f4ff] to-[#dbeeff]
      relative overflow-hidden font-[Outfit,Inter,sans-serif]"
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-14 -left-14 w-56 h-56 rounded-full
        bg-white/40 pointer-events-none"
      />
      <div
        className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full
        bg-white/30 pointer-events-none"
      />
      <div
        className="absolute top-[30%] right-[8%] w-12 h-12 rounded-xl
        bg-white/55 rotate-[20deg] pointer-events-none"
      />
      <div
        className="absolute bottom-[20%] left-[6%] w-8 h-8 rounded-lg
        bg-white/50 -rotate-[15deg] pointer-events-none"
      />

      {/* ══════════════════════════════════════════
          CARD
      ══════════════════════════════════════════ */}
      <div
        className="relative z-10 w-full max-w-[860px] flex flex-col md:flex-row
        rounded-3xl overflow-hidden
        shadow-[0_24px_80px_rgba(3,4,94,0.14),0_4px_16px_rgba(3,4,94,0.06)]
        bg-white"
      >
        {/* ══ FORM PANEL ══ */}
        <div
          className="w-full md:w-[44%] flex flex-col items-center
          px-6 py-10 sm:px-10 md:px-9 md:py-10"
        >
          {/* Logo — centered on mobile */}
          <Link
            to="/"
            className="flex items-center gap-2.5 no-underline mb-8 self-center"
          >
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

          {/* Heading — centered on mobile */}
          <div className="w-full max-w-sm text-center md:text-left mb-6">
            <h1 className="text-[1.75rem] font-black text-slate-900 tracking-tight mb-1.5">
              Bonjour !
            </h1>
            <p className="text-slate-500 text-[0.84rem] leading-relaxed">
              Renseignez votre email et mot de passe pour accéder à votre
              espace.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div
              role="alert"
              className="w-full max-w-sm flex items-center gap-2 px-3 py-2.5 mb-4
                bg-red-50 border border-red-200 rounded-xl text-red-600 text-[0.8rem]"
            >
              <svg
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 20 20"
                className="shrink-0"
              >
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

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full max-w-sm flex flex-col gap-3"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider"
              >
                Adresse email
              </label>
              <input
                id="login-email"
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

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  required
                  autoComplete="current-password"
                  className="w-full h-12 pl-4 pr-11 rounded-xl text-[0.875rem] text-slate-900
                    bg-slate-50 border-[1.5px] border-slate-200
                    outline-none transition-all duration-150
                    focus:border-[#0077b6] focus:bg-white
                    focus:shadow-[0_0_0_3px_rgba(0,119,182,0.10)]
                    placeholder:text-slate-400"
                />
                <EyeBtn show={showPwd} toggle={() => setShowPwd((p) => !p)} />
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link
                to="/forgot-password"
                className="text-[0.78rem] text-[#0077b6] font-semibold no-underline
                hover:underline transition-all"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit */}
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
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white/30
                    border-t-white animate-spin"
                  />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-5 text-center text-[0.82rem] text-slate-500">
            Pas de compte ?{" "}
            <Link
              to="/register"
              className="text-[#0077b6] font-bold no-underline
              hover:underline transition-all"
            >
              S'inscrire
            </Link>
          </p>
        </div>

        {/* ══ VISUAL PANEL — hidden on mobile ══ */}
        <div className="hidden md:flex flex-1 relative flex-col justify-end p-10 overflow-hidden">
          {/* Background photo */}
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80"
            alt="Dentiste et patient"
            className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(3,4,94,0.88) 0%, rgba(0,60,120,0.55) 45%, rgba(0,0,0,0.15) 100%)",
            }}
          />

          {/* Glass info card */}
          <div
            className="relative z-10 rounded-[18px] p-6
            bg-white/10 backdrop-blur-xl border border-white/18"
          >
            <h2
              className="text-[1.35rem] font-extrabold text-white leading-snug
              tracking-tight mb-2.5"
            >
              Votre sourire mérite
              <br />
              les meilleurs soins.
            </h2>
            <p className="text-[0.8rem] text-white/65 leading-relaxed">
              Gérez vos rendez-vous, consultez votre dossier médical et échangez
              avec votre dentiste en toute simplicité.
            </p>

            {/* Feature badges */}
            <div className="flex gap-4 mt-5">
              {[
                {
                  label: "RDV en ligne",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14
                      c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM7 12h5v5H7z"
                      />
                    </svg>
                  ),
                },
                {
                  label: "Dossier médical",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5
                      c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5
                      S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15
                      s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"
                      />
                    </svg>
                  ),
                },
                {
                  label: "Assistant IA",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6
                      c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12
                      c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12z
                      m-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13z
                      m7.5-1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z
                      M8 15h8v2H8v-2z"
                      />
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <Feature key={label} label={label}>
                  {icon}
                </Feature>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
