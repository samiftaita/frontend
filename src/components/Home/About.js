import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const CheckItem = ({ text }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 14,
    }}
  >
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#14b8a6,#0ea5e9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 1,
      }}
    >
      <svg
        width="12"
        height="12"
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

CheckItem.propTypes = {
  text: PropTypes.string,
};

const About = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sectionRef, inView] = useInView();

  const handleAppointment = () => {
    if (user?.role === "patient") navigate("/patient/rendez-vous");
    else navigate("/login");
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "clamp(60px, 8vw, 100px) 0",
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 32px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: "clamp(32px, 6vw, 80px)",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-40px)",
              transition: "all 900ms cubic-bezier(0.16,1,0.3,1)",
              paddingBottom: 40,
            }}
          >
            <div
              style={{
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 24px 60px rgba(15,23,42,0.15)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=700&q=80"
                alt="Dentiste au travail"
                style={{
                  width: "100%",
                  height: "clamp(260px, 40vw, 420px)",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: "clamp(-20px, -3vw, -40px)",
                width: "clamp(140px, 20vw, 220px)",
                height: "clamp(110px, 16vw, 180px)",
                borderRadius: 20,
                overflow: "hidden",
                border: "5px solid #fff",
                boxShadow: "0 12px 40px rgba(15,23,42,0.18)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80"
                alt="Consultation dentaire"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 24,
                background: "#0077b6",
                borderRadius: 16,
                padding: "12px 18px",
                color: "#fff",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                25+
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  opacity: 0.9,
                  marginTop: 2,
                }}
              >
                Années d'expérience
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: -20,
                left: -20,
                width: 80,
                height: 80,
                borderRadius: 16,
                background: "rgba(20,184,166,0.12)",
                border: "2px solid rgba(20,184,166,0.2)",
                zIndex: -1,
              }}
            />
          </div>
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(40px)",
              transition: "all 900ms cubic-bezier(0.16,1,0.3,1) 150ms",
            }}
          >
            <p
              style={{
                fontFamily: "'Dancing Script', cursive, serif",
                fontSize: "1.2rem",
                color: "#14b8a6",
                marginBottom: 10,
                fontStyle: "italic",
              }}
            >
              Dentora &amp; Cabinet Dentaire
            </p>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "#0f172a",
                lineHeight: 1.1,
                margin: "0 0 20px",
                letterSpacing: "-0.02em",
              }}
            >
              POURQUOI CHOISIR
              <br />
              <span style={{ color: "#0f172a" }}>DENTORA</span>
              <span style={{ color: "#14b8a6" }}>.</span>
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748b",
                lineHeight: 1.75,
                marginBottom: 16,
              }}
            >
              Chez Dentora, nous croyons fermement que votre santé
              bucco-dentaire est indissociable de votre bien-être général. Notre
              approche holistique prend en charge chaque patient, des enfants
              aux seniors.
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748b",
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              Que ce soit pour un bilan de routine ou une transformation
              complète, notre équipe met un point d'honneur à offrir les
              dernières avancées technologiques dans nos 5 salles de soins
              ultramodernes.
            </p>
            <div style={{ marginBottom: 32 }}>
              <CheckItem text="Nos soins reposent sur les valeurs de bien-être, d'équilibre et d'intégrité." />
              <CheckItem text="Notre équipe valorise l'équilibre travail-vie personnelle, créant un environnement positif et durable." />
              <CheckItem text="En tant que cabinet ancré dans la communauté, nous privilégions des liens authentiques avec nos patients." />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleAppointment}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "13px 26px",
                  borderRadius: 999,
                  background: "#0077b6",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Prendre Rendez-vous
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
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
                </span>
              </button>
              <a
                href="tel:+212522000000"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "rgba(20,184,166,0.1)",
                    border: "1px solid rgba(20,184,166,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                    }}
                  >
                    Appelez-nous
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      color: "#0f172a",
                      fontWeight: 700,
                    }}
                  >
                    +212 522 00 00 00
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
