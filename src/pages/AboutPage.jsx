import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import {
  ArrowPathIcon,
  BoltIcon,
  EyeIcon,
  HeartIcon,
  SparklesIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

const stats = [
  { value: "10K+", label: "Patients traités", color: "#374151" },
  { value: "15+", label: "Années d'expérience", color: "#374151" },
  { value: "98%", label: "Taux de satisfaction", color: "#374151" },
  { value: "24/7", label: "Support disponible", color: "#374151" },
];

const values = [
  {
    title: "Excellence",
    desc: "Chaque acte médical est réalisé avec rigueur et précision absolue.",
    icon: <SparklesIcon style={{ width: 20, height: 20 }} />,
  },
  {
    title: "Innovation",
    desc: "Technologies de pointe pour des diagnostics précis et des traitements modernes.",
    icon: <BoltIcon style={{ width: 20, height: 20 }} />,
  },
  {
    title: "Bienveillance",
    desc: "Un environnement serein et une écoute attentive pour chaque patient.",
    icon: <HeartIcon style={{ width: 20, height: 20 }} />,
  },
  {
    title: "Transparence",
    desc: "Diagnostics clairs, devis détaillés et communication ouverte à chaque étape.",
    icon: <EyeIcon style={{ width: 20, height: 20 }} />,
  },
  {
    title: "Accessibilité",
    desc: "Des soins de qualité accessibles à tous, avec des solutions de paiement flexibles.",
    icon: <HandThumbUpIcon style={{ width: 20, height: 20 }} />,
  },
  {
    title: "Continuité",
    desc: "Un suivi personnalisé sur le long terme pour préserver votre santé bucco-dentaire.",
    icon: <ArrowPathIcon style={{ width: 20, height: 20 }} />,
  },
];

const timeline = [
  {
    year: "2010",
    title: "Fondation du cabinet",
    desc: "Ouverture du premier cabinet DENTORA avec une équipe de 3 dentistes passionnés.",
  },
  {
    year: "2014",
    title: "Expansion des services",
    desc: "Introduction de la radiologie numérique et de l'orthodontie invisible.",
  },
  {
    year: "2018",
    title: "Certification ISO 9001",
    desc: "Obtention de la certification qualité internationale pour nos processus de soins.",
  },
  {
    year: "2022",
    title: "Plateforme digitale",
    desc: "Lancement de DENTORA en ligne — prise de RDV, dossiers médicaux et assistant IA.",
  },
];

const CheckItem = ({ text }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 12,
    }}
  >
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#14b8a6,#0ea5e9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 2,
      }}
    >
      <svg
        width="10"
        height="10"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <p
      style={{
        margin: 0,
        fontSize: "0.9rem",
        color: "#475569",
        lineHeight: 1.6,
      }}
    >
      {text}
    </p>
  </div>
);

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <Navbar />

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          minHeight: 480,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1800&q=80"
          alt="Cabinet"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 40%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, rgba(5,20,35,0.85) 0%, rgba(5,20,35,0.55) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            lineHeight: 0,
          }}
        >
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            style={{ width: "100%", height: 80, display: "block" }}
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "140px 32px 120px",
            width: "100%",
          }}
        >
          <p
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "1.3rem",
              color: "#5eead4",
              marginBottom: 12,
              fontStyle: "italic",
            }}
          >
            Dentora &amp; Cabinet Dentaire
          </p>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            À Propos de <span style={{ color: "#14b8a6" }}>DENTORA</span>
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.75)",
              maxWidth: 560,
              lineHeight: 1.7,
            }}
          >
            Depuis plus de 15 ans, nous transformons des sourires et améliorons
            des vies grâce à des soins dentaires d'excellence.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "60px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  padding: "32px 24px",
                  borderRadius: 20,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  transition: "all 250ms cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(17,24,39,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontSize: "2.8rem",
                    fontWeight: 900,
                    color: s.color,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section style={{ padding: "80px 0", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 72,
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: "1.2rem",
                  color: "#6b7280",
                  marginBottom: 10,
                  fontStyle: "italic",
                }}
              >
                Notre Mission
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 900,
                  color: "#0f172a",
                  margin: "0 0 20px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                Une dentisterie{" "}
                <span style={{ color: "#374151" }}>humaine</span> et moderne
              </h2>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#64748b",
                  lineHeight: 1.75,
                  marginBottom: 16,
                }}
              >
                Fondé en 2010, DENTORA est né de la volonté de créer un espace
                où la technologie de pointe rencontre l'empathie humaine. Nous
                croyons que chaque patient mérite une attention personnalisée
                dans un environnement serein.
              </p>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#64748b",
                  lineHeight: 1.75,
                  marginBottom: 28,
                }}
              >
                Notre équipe de spécialistes passionnés s'engage à vous offrir
                les meilleurs soins dentaires, en combinant expertise clinique
                et technologies innovantes pour des résultats durables.
              </p>
              <CheckItem text="Nos soins reposent sur les valeurs de bien-être, d'équilibre et d'intégrité." />
              <CheckItem text="Notre équipe valorise l'équilibre travail-vie personnelle, créant un environnement positif." />
              <CheckItem text="En tant que cabinet ancré dans la communauté, nous privilégions des liens authentiques." />
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  marginTop: 28,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    borderRadius: 999,
                    background: "#0077b6",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "none",
                    transition: "background 200ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#005f8e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0077b6";
                  }}
                >
                  Prendre Rendez-vous
                  <svg
                    width="14"
                    height="14"
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
                </button>
                <a
                  href="tel:+212522000000"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    borderRadius: 999,
                    border: "1.5px solid #e5e7eb",
                    color: "#374151",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    transition: "all 200ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  Nous appeler
                </a>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  borderRadius: 24,
                  overflow: "hidden",
                  boxShadow: "0 24px 60px rgba(15,23,42,0.15)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=700&q=80"
                  alt="Cabinet"
                  style={{
                    width: "100%",
                    height: 420,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: 24,
                  background: "#0077b6",
                  borderRadius: 16,
                  padding: "14px 20px",
                  color: "#fff",
                  boxShadow: "none",
                }}
              >
                <div
                  style={{ fontSize: "1.8rem", fontWeight: 900, lineHeight: 1 }}
                >
                  25+
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    opacity: 0.9,
                    marginTop: 2,
                  }}
                >
                  Années d'expérience
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1.2rem",
                color: "#6b7280",
                marginBottom: 8,
                fontStyle: "italic",
              }}
            >
              Nos Valeurs
            </p>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                color: "#0f172a",
                margin: "0 0 12px",
                letterSpacing: "-0.02em",
              }}
            >
              Ce qui nous <span style={{ color: "#374151" }}>définit</span>
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "1rem",
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              Les principes fondamentaux qui guident chacune de nos actions.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {values.map((v, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 24px",
                  borderRadius: 20,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  transition: "all 250ms",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(17,24,39,0.08)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    color: "#374151",
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "#64748b",
                    lineHeight: 1.65,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section
        style={{
          padding: "80px 0",
          background: "linear-gradient(135deg,#0a1628 0%,#0e3a5c 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 32px",
            position: "relative",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1.2rem",
                color: "#5eead4",
                marginBottom: 8,
                fontStyle: "italic",
              }}
            >
              Notre Parcours
            </p>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                color: "#fff",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Notre histoire
            </h2>
          </div>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: 0,
                bottom: 0,
                width: 2,
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              {timeline.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                    flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      textAlign: i % 2 === 0 ? "right" : "left",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        background: "rgba(255,255,255,0.07)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 16,
                        padding: "20px 24px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.5)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {item.year}
                      </p>
                      <h3
                        style={{
                          margin: "0 0 6px",
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: "1rem",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#fff",
                      border: "3px solid rgba(255,255,255,0.3)",
                      flexShrink: 0,
                      zIndex: 1,
                      boxShadow: "0 0 0 6px rgba(255,255,255,0.08)",
                    }}
                  />
                  <div style={{ flex: 1 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "0 32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 28,
              padding: "56px 40px",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="#374151"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M8 3C6 3 4 5 4 7.5C4 9.5 5 11 5.5 13C6 15 6 17 6 19C6 20.1 6.4 21 7.5 21C8.5 21 9 20 9.5 18.5C10 17 10.5 16 12 16C13.5 16 14 17 14.5 18.5C15 20 15.5 21 16.5 21C17.6 21 18 20.1 18 19C18 17 18 15 18.5 13C19 11 20 9.5 20 7.5C20 5 18 3 16 3C14.8 3 13.5 3.8 12 3.8C10.5 3.8 9.2 3 8 3Z" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: 900,
                color: "#0f172a",
                margin: "0 0 12px",
                letterSpacing: "-0.02em",
              }}
            >
              Prêt pour un sourire éclatant ?
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "1rem",
                marginBottom: 32,
                lineHeight: 1.7,
                maxWidth: 480,
                margin: "0 auto 32px",
              }}
            >
              Prenez rendez-vous dès aujourd'hui et découvrez l'expérience
              DENTORA — des soins d'excellence dans un cadre bienveillant.
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 32px",
                borderRadius: 999,
                background: "#0077b6",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "none",
                transition: "background 250ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#005f8e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0077b6";
              }}
            >
              Prendre Rendez-vous
              <svg
                width="16"
                height="16"
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
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
