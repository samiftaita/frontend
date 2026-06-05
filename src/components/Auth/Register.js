import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/* ── password strength ── */
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "#e2e8f0" };
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return [
    { score: 0, label: "", color: "#e2e8f0" },
    { score: 1, label: "Faible", color: "#ef4444" },
    { score: 2, label: "Moyen", color: "#f59e0b" },
    { score: 3, label: "Bon", color: "#3b82f6" },
    { score: 4, label: "Fort", color: "#22c55e" },
  ][s];
};

const EyeBtn = ({ show, toggle }) => (
  <button
    type="button"
    onClick={toggle}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#94a3b8",
      padding: "4px",
      lineHeight: 0,
      flexShrink: 0,
    }}
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
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
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

EyeBtn.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

EyeBtn.defaultProps = {
  show: false,
  toggle: () => {},
};

export default function Register() {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    password_confirmation: "",
    telephone: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = useMemo(() => getStrength(form.password), [form.password]);
  const pwdMatch =
    form.password_confirmation && form.password === form.password_confirmation;
  const pwdBad =
    form.password_confirmation && form.password !== form.password_confirmation;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await register({ ...form, role: "patient" });
    if (res.success) navigate("/patient/dashboard");
    else {
      setError(res.error || "Erreur lors de l'inscription");
      setLoading(false);
    }
  };

  /* shared input style */
  const inp = (extra = {}) => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1.5px solid #e8edf2",
    borderRadius: 9,
    background: "#f7f9fb",
    fontSize: "0.82rem",
    color: "#0f172a",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 180ms, box-shadow 180ms, background 180ms",
    ...extra,
  });
  const onFocus = (e) => {
    e.target.style.borderColor = "#0077b6";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,119,182,0.10)";
    e.target.style.background = "#fff";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "#e8edf2";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#f7f9fb";
  };

  return (
    <main
      style={{
        height: "100vh",
        background:
          "linear-gradient(135deg,#caf0f8 0%,#e0f4ff 50%,#dbeeff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "'Outfit','Inter',sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* bg shapes */}
      <div
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.45)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.35)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "25%",
          right: "7%",
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "rgba(255,255,255,0.55)",
          transform: "rotate(20deg)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "5%",
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "rgba(255,255,255,0.50)",
          transform: "rotate(-15deg)",
          pointerEvents: "none",
        }}
      />

      {/* ── floating card ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          maxWidth: 960,
          minHeight: "min(calc(100vh - 32px), 640px)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow:
            "0 24px 80px rgba(3,4,94,0.14), 0 4px 16px rgba(3,4,94,0.06)",
          background: "#fff",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ══ LEFT — photo panel ══ */}
        <div
          className="register-left-panel"
          style={{
            flex: "0 0 40%",
            minWidth: 0,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "28px",
          }}
        >
          {/* photo — remplace src par "/assets/register-bg.jpg" après avoir copié ton image */}
          <img
            src="https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Dentistes en salle d'opération"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
          />
          {/* gradient overlay — lighter at top, dark at bottom */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(3,4,94,0.90) 0%, rgba(0,60,120,0.50) 40%, rgba(0,0,0,0.10) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* bottom glass card */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 14,
              padding: "16px 18px",
            }}
          >
            <h2
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.3,
                margin: "0 0 6px",
                letterSpacing: "-0.02em",
              }}
            >
              Rejoignez Dentora
              <br />
              et prenez soin de votre sourire.
            </h2>
            <p
              style={{
                fontSize: "0.73rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.5,
                margin: "0 0 12px",
              }}
            >
              Créez votre dossier patient en quelques secondes.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                {
                  label: "RDV en ligne",
                  svg: (
                    <svg
                      width="16"
                      height="16"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM7 12h5v5H7z" />
                    </svg>
                  ),
                },
                {
                  label: "Dossier médical",
                  svg: (
                    <svg
                      width="16"
                      height="16"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                    </svg>
                  ),
                },
                {
                  label: "Assistant IA",
                  svg: (
                    <svg
                      width="16"
                      height="16"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm7.5-1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM8 15h8v2H8v-2z" />
                    </svg>
                  ),
                },
              ].map(({ label, svg }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {svg}
                  </div>
                  <span
                    style={{
                      fontSize: "0.58rem",
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 600,
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT — form ══ */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            padding: "clamp(16px, 3vw, 24px) clamp(16px, 4vw, 36px)",
            justifyContent: "space-between",
            overflow: "auto",
          }}
        >
          {/* heading */}
          <div>
            {/* Logo */}
            <Link
              to="/"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#0077b6,#00b4d8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 3px 10px rgba(0,119,182,0.30)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
                  <path
                    d="M32 8C24 8 16 15 16 25C16 33 20 40 22 48C24 56 24 64 24 73C24 78 26 82 30 82C34 82 36 78 38 73C40 68 42 64 50 64C58 64 60 68 62 73C64 78 66 82 70 82C74 82 76 78 76 73C76 64 76 56 78 48C80 40 84 33 84 25C84 15 76 8 68 8C63 8 57 11 50 11C43 11 37 8 32 8Z"
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
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: "#0f172a",
                }}
              >
                DENT<span style={{ color: "#0077b6" }}>ORA</span>
              </span>
            </Link>

            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                color: "#0f172a",
                margin: "0 0 4px",
                letterSpacing: "-0.03em",
              }}
            >
              Créer un compte
            </h1>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.8rem",
                lineHeight: 1.5,
                margin: "0 0 16px",
              }}
            >
              Renseignez vos informations pour rejoindre Dentora.
            </p>

            {/* error */}
            {error && (
              <div
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  marginBottom: 12,
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                  color: "#dc2626",
                  fontSize: "0.78rem",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {/* Prénom + Nom */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
                  gap: 10,
                }}
              >
                <div>
                  <label
                    htmlFor="register-prenom"
                    style={{
                      display: "block",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#475569",
                      marginBottom: 4,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Prénom
                  </label>
                  <input
                    id="register-prenom"
                    name="prenom"
                    type="text"
                    value={form.prenom}
                    onChange={handleChange}
                    placeholder="Jean"
                    required
                    autoComplete="given-name"
                    style={inp()}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                <div>
                  <label
                    htmlFor="register-nom"
                    style={{
                      display: "block",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#475569",
                      marginBottom: 4,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Nom
                  </label>
                  <input
                    id="register-nom"
                    name="nom"
                    type="text"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Dupont"
                    required
                    autoComplete="family-name"
                    style={inp()}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  style={{
                    display: "block",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#475569",
                    marginBottom: 4,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Adresse email
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jean.dupont@exemple.com"
                  required
                  autoComplete="email"
                  style={inp()}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Téléphone */}
              <div>
                <label
                  htmlFor="register-telephone"
                  style={{
                    display: "block",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#475569",
                    marginBottom: 4,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Téléphone
                </label>
                <input
                  id="register-telephone"
                  name="telephone"
                  type="tel"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="+212 6 00 00 00 00"
                  required
                  autoComplete="tel"
                  style={inp()}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Password + Confirm side by side */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
                  gap: 10,
                }}
              >
                <div>
                  <label
                    htmlFor="register-password"
                    style={{
                      display: "block",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#475569",
                      marginBottom: 4,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Mot de passe
                  </label>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      id="register-password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 8 caractères"
                      required
                      autoComplete="new-password"
                      style={inp({ paddingRight: 38 })}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    <span style={{ position: "absolute", right: 8 }}>
                      <EyeBtn
                        show={showPwd}
                        toggle={() => setShowPwd((p) => !p)}
                      />
                    </span>
                  </div>
                  {form.password && (
                    <div style={{ marginTop: 5 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: 2.5,
                              borderRadius: 999,
                              background:
                                i <= strength.score
                                  ? strength.color
                                  : "#e2e8f0",
                              transition: "background 300ms",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: strength.color,
                        }}
                      >
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="register-password-confirmation"
                    style={{
                      display: "block",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#475569",
                      marginBottom: 4,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Confirmer
                  </label>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      id="register-password-confirmation"
                      name="password_confirmation"
                      type={showPwd ? "text" : "password"}
                      value={form.password_confirmation}
                      onChange={handleChange}
                      placeholder="Répétez"
                      required
                      autoComplete="new-password"
                      style={inp({
                        paddingRight: 38,
                        borderColor: pwdBad
                          ? "#fca5a5"
                          : pwdMatch
                            ? "#86efac"
                            : "#e8edf2",
                      })}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    <span style={{ position: "absolute", right: 8 }}>
                      <EyeBtn
                        show={showPwd}
                        toggle={() => setShowPwd((p) => !p)}
                      />
                    </span>
                  </div>
                  {(pwdMatch || pwdBad) && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 5,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: pwdMatch ? "#22c55e" : "#ef4444",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        {pwdMatch ? (
                          <polyline points="20 6 9 17 4 12" />
                        ) : (
                          <>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </>
                        )}
                      </svg>
                      {pwdMatch ? "Correspondent" : "Ne correspondent pas"}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: 2,
                  borderRadius: 10,
                  border: "none",
                  background: loading ? "#94a3b8" : "#0f172a",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition:
                    "background 180ms, transform 150ms, box-shadow 150ms",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 16px rgba(15,23,42,0.25)",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "#0077b6";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(0,119,182,0.40)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = loading
                    ? "#94a3b8"
                    : "#0f172a";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = loading
                    ? "none"
                    : "0 4px 16px rgba(15,23,42,0.25)";
                }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin .7s linear infinite",
                      }}
                    />{" "}
                    Inscription...
                  </>
                ) : (
                  <>
                    S'inscrire gratuitement{" "}
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p
              style={{
                marginTop: 12,
                textAlign: "center",
                fontSize: "0.78rem",
                color: "#64748b",
              }}
            >
              Déjà un compte ?{" "}
              <Link
                to="/login"
                style={{
                  color: "#0077b6",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .register-left-panel { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
      `}</style>
    </main>
  );
}
