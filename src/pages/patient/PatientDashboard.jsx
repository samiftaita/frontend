import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { rendezVousApi, chatbotApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import PatientLoading from "../../components/patient/PatientLoading";
import PatientError from "../../components/patient/PatientError";
import StatusBadge from "../../components/patient/StatusBadge";

const getPatientId = (user) => user?.patient?.id || null;

/* ── Stat Card ── */
const StatCard = ({ title, value, icon, color, delay = 0 }) => {
  const colors = {
    blue: { bg: "#eff6ff", fg: "#2563eb" },
    amber: { bg: "#fffbeb", fg: "#d97706" },
    green: { bg: "#ecfdf5", fg: "#059669" },
    red: { bg: "#fef2f2", fg: "#ef4444" },
  };
  const c = colors[color] || colors.blue;
  return (
    <div
      className="animate-fadeInUp"
      style={{
        animationDelay: `${delay}ms`,
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        padding: "20px 22px",
        transition: "border-color 180ms, box-shadow 180ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#d1d5db";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.68rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            color: "#6b7280",
          }}
        >
          {title}
        </p>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: c.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "2rem",
          fontWeight: 800,
          color: "#111827",
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </div>
  );
};

/* ── Chatbot ── */
const InlineChatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Bonjour ! Je suis DentoraBot. Comment puis-je vous aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input;
    setMessages((p) => [...p, { type: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await chatbotApi.sendMessage(msg);
      const { data } = res.data;
      if (data?.message) {
        setMessages((p) => [...p, { type: "bot", text: data.message }]);
      } else throw new Error();
    } catch {
      setMessages((p) => [
        ...p,
        { type: "bot", text: "Désolé, une erreur est survenue." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
        minHeight: 380,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#0ea5e9",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              color: "#fff",
              fontSize: "0.9rem",
            }}
          >
            DentoraBot
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 1,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#bbf7d0",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              En ligne
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "#f9fafb",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.type === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "82%",
                padding: "9px 13px",
                borderRadius:
                  m.type === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                background: m.type === "user" ? "#0ea5e9" : "#fff",
                color: m.type === "user" ? "#fff" : "#111827",
                fontSize: "0.845rem",
                lineHeight: 1.55,
                fontWeight: 500,
                border: m.type === "bot" ? "1px solid #e5e7eb" : "none",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                background: "#fff",
                padding: "10px 14px",
                borderRadius: "16px 16px 16px 4px",
                border: "1px solid #e5e7eb",
                display: "flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#0ea5e9",
                    display: "inline-block",
                    animation: `bounce 1s ${d}ms infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px 14px",
          background: "#fff",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          type="text"
          placeholder="Posez votre question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && send()}
          disabled={loading}
          style={{
            flex: 1,
            padding: "9px 12px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            fontSize: "0.845rem",
            outline: "none",
            color: "#111827",
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "#0ea5e9",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            opacity: !input.trim() || loading ? 0.45 : 1,
            transition: "opacity 150ms",
          }}
        >
          <svg
            width="15"
            height="15"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/* ── Dashboard principal ── */
const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const patientId = getPatientId(user);

  const loadDashboard = useCallback(async () => {
    if (!patientId) {
      setError("Patient introuvable.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await rendezVousApi.getAll({ patient_id: patientId });
      setRendezVous(res.data?.data?.rendez_vous || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de charger les données.",
      );
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const total = rendezVous.length;
    const enAttente = rendezVous.filter(
      (r) => r.statut === "en_attente",
    ).length;
    const confirmes = rendezVous.filter((r) => r.statut === "confirme").length;
    const annules = rendezVous.filter((r) => r.statut === "annule").length;
    const now = new Date();
    const upcoming = rendezVous
      .filter((r) => r.statut !== "annule")
      .map((r) => ({ ...r, _dt: new Date(`${r.date_rdv}T${r.heure_debut}`) }))
      .filter((r) => !isNaN(r._dt) && r._dt >= now)
      .sort((a, b) => a._dt - b._dt)[0];
    return { total, enAttente, confirmes, annules, upcoming };
  }, [rendezVous]);

  if (loading)
    return <PatientLoading text="Chargement du tableau de bord..." />;
  if (error) return <PatientError message={error} onRetry={loadDashboard} />;

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ICONS = {
    calendar: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    clock: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="#d97706"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    check: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="#059669"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    cancel: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── En-tête ── */}
      <div
        className="animate-fadeInDown"
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.03em",
            }}
          >
            Tableau de bord
          </h1>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: "0.8rem",
              color: "#9ca3af",
              textTransform: "capitalize",
            }}
          >
            {today}
          </p>
        </div>
        <Link
          to="/patient/rendez-vous"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "#0ea5e9",
            color: "#fff",
            padding: "9px 18px",
            borderRadius: 10,
            fontSize: "0.845rem",
            fontWeight: 700,
            textDecoration: "none",
            transition: "background 150ms",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0284c7")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#0ea5e9")}
        >
          <svg
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouveau rendez-vous
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
        }}
      >
        <StatCard
          title="Total RDV"
          value={stats.total}
          icon={ICONS.calendar}
          color="blue"
          delay={0}
        />
        <StatCard
          title="En attente"
          value={stats.enAttente}
          icon={ICONS.clock}
          color="amber"
          delay={60}
        />
        <StatCard
          title="Confirmés"
          value={stats.confirmes}
          icon={ICONS.check}
          color="green"
          delay={120}
        />
        <StatCard
          title="Annulés"
          value={stats.annules}
          icon={ICONS.cancel}
          color="red"
          delay={180}
        />
      </div>

      {/* ── Prochain RDV + Chatbot ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 16,
        }}
      >
        {/* Prochain rendez-vous */}
        <div
          className="animate-fadeInUp"
          style={{
            animationDelay: "240ms",
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Prochain rendez-vous
            </h3>
            <Link
              to="/patient/rendez-vous"
              style={{
                fontSize: "0.78rem",
                color: "#0ea5e9",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Voir tous →
            </Link>
          </div>

          {!stats.upcoming ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "28px 0",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Aucun rendez-vous planifié
              </p>
              <Link
                to="/patient/rendez-vous"
                style={{
                  fontSize: "0.8rem",
                  color: "#0ea5e9",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Prendre un rendez-vous →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              {/* Date badge */}
              <div
                style={{
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: 12,
                  padding: "14px 18px",
                  textAlign: "center",
                  flexShrink: 0,
                  minWidth: 72,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#0284c7",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {new Date(stats.upcoming.date_rdv).toLocaleDateString(
                    "fr-FR",
                    { month: "short" },
                  )}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#0284c7",
                    lineHeight: 1,
                  }}
                >
                  {new Date(stats.upcoming.date_rdv).getDate()}
                </p>
              </div>

              {/* Détails */}
              <div
                style={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px 16px",
                }}
              >
                {[
                  {
                    label: "Service",
                    value: stats.upcoming.service?.nom || "—",
                  },
                  {
                    label: "Dentiste",
                    value: `Dr. ${stats.upcoming.dentiste?.user?.prenom || ""} ${stats.upcoming.dentiste?.user?.nom || ""}`,
                  },
                  {
                    label: "Heure",
                    value: `${stats.upcoming.heure_debut} – ${stats.upcoming.heure_fin}`,
                  },
                ].map((f) => (
                  <div key={f.label}>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {f.label}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        color: "#111827",
                        fontSize: "0.845rem",
                      }}
                    >
                      {f.value}
                    </p>
                  </div>
                ))}
                <div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Statut
                  </p>
                  <StatusBadge status={stats.upcoming.statut} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chatbot */}
        <div className="animate-fadeInUp" style={{ animationDelay: "280ms" }}>
          <InlineChatbot />
        </div>
      </div>

      {/* ── Derniers rendez-vous ── */}
      {rendezVous.length > 0 && (
        <div
          className="animate-fadeInUp"
          style={{
            animationDelay: "320ms",
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 22px",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Derniers rendez-vous
            </h3>
            <Link
              to="/patient/rendez-vous"
              style={{
                fontSize: "0.78rem",
                color: "#0ea5e9",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Voir tous →
            </Link>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.845rem",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  {["Service", "Dentiste", "Date", "Heure", "Statut"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px",
                          textAlign: "left",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "#0284c7",
                          background: "#f0f9ff",
                          whiteSpace: "nowrap",
                          borderBottom: "2px solid #bae6fd",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rendezVous.slice(0, 5).map((rdv, i) => (
                  <tr
                    key={rdv.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      transition: "background 150ms",
                      background: i % 2 === 1 ? "#fafbfc" : "#fff",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f9ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        i % 2 === 1 ? "#fafbfc" : "#fff")
                    }
                  >
                    <td
                      style={{
                        padding: "11px 16px",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {rdv.service?.nom || "—"}
                    </td>
                    <td style={{ padding: "11px 16px", color: "#374151" }}>
                      Dr. {rdv.dentiste?.user?.prenom} {rdv.dentiste?.user?.nom}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(rdv.date_rdv).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding: "11px 16px", color: "#374151" }}>
                      {rdv.heure_debut?.substring(0, 5)}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <StatusBadge status={rdv.statut} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
