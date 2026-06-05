import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const useInView = (threshold = 0.1) => {
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

const services = [
  {
    num: "01",
    icon: (
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: "Consultation Générale",
    desc: "Bilan complet, diagnostic précis et conseils personnalisés pour maintenir une excellente santé bucco-dentaire.",
    tag: "Prévention",
  },
  {
    num: "02",
    icon: (
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    title: "Soins de Restauration",
    desc: "Traitements des caries, couronnes et restaurations de haute qualité utilisant les dernières technologies.",
    tag: "Restauration",
  },
  {
    num: "03",
    icon: (
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z" />
      </svg>
    ),
    title: "Esthétique Dentaire",
    desc: "Blanchiment professionnel, facettes et solutions d'alignement pour transformer votre sourire.",
    tag: "Esthétique",
  },
  {
    num: "04",
    icon: (
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M8 3C6 3 4 5 4 7.5C4 9.5 5 11 5.5 13C6 15 6 17 6 19C6 20.1 6.4 21 7.5 21C8.5 21 9 20 9.5 18.5C10 17 10.5 16 12 16C13.5 16 14 17 14.5 18.5C15 20 15.5 21 16.5 21C17.6 21 18 20.1 18 19C18 17 18 15 18.5 13C19 11 20 9.5 20 7.5C20 5 18 3 16 3C14.8 3 13.5 3.8 12 3.8C10.5 3.8 9.2 3 8 3Z" />
      </svg>
    ),
    title: "Implantologie",
    desc: "Implants dentaires de dernière génération pour remplacer les dents manquantes de façon durable.",
    tag: "Chirurgie",
  },
  {
    num: "05",
    icon: (
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 13s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    title: "Orthodontie",
    desc: "Alignement des dents avec des appareils modernes et discrets pour un sourire parfaitement aligné.",
    tag: "Alignement",
  },
  {
    num: "06",
    icon: (
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: "Assistant IA 24h/24",
    desc: "Notre chatbot intelligent répond à toutes vos questions et vous guide vers les meilleurs soins.",
    tag: "Innovation",
  },
];

const Features = () => {
  const [sectionRef, inView] = useInView();
  const [hovered, setHovered] = useState(null);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "clamp(60px, 8vw, 100px) 0",
        background: "#f8fafc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top wave */}
      <div
        style={{
          position: "absolute",
          top: -2,
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
          <path d="M0,40 C480,80 960,0 1440,40 L1440,0 L0,0 Z" fill="#ffffff" />
        </svg>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 32px)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 64,
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "all 700ms cubic-bezier(0.16,1,0.3,1)",
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
            Nos Services
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "#0f172a",
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            LÀ OÙ CHAQUE TRAITEMENT
            <br />
            <span style={{ color: "#0f172a" }}>COMMENCE PAR LA </span>
            <span style={{ color: "#14b8a6" }}>CONFIANCE.</span>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#64748b",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Une gamme complète de soins dentaires pour répondre à tous vos
            besoins, des soins préventifs aux transformations esthétiques.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginBottom: 56,
          }}
        >
          {services.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "32px 28px",
                border: `1px solid ${hovered === i ? "#bae6fd" : "#e5e7eb"}`,
                boxShadow:
                  hovered === i
                    ? "0 12px 40px rgba(14,165,233,0.10)"
                    : "0 2px 12px rgba(15,23,42,0.04)",
                transition: "all 280ms cubic-bezier(0.16,1,0.3,1)",
                transform: hovered === i ? "translateY(-5px)" : "translateY(0)",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
                opacity: inView ? 1 : 0,
                animation: inView
                  ? `fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`
                  : "none",
              }}
            >
              {/* Number watermark */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 20,
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  color: hovered === i ? "#e0f2fe" : "#f1f5f9",
                  lineHeight: 1,
                  userSelect: "none",
                  transition: "color 280ms",
                }}
              >
                {s.num}
              </div>

              {/* Icon — gris clair, sky blue au hover */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: hovered === i ? "#e0f2fe" : "#f1f5f9",
                  color: hovered === i ? "#0284c7" : "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  transition: "all 280ms cubic-bezier(0.16,1,0.3,1)",
                  transform: hovered === i ? "scale(1.08)" : "scale(1)",
                }}
              >
                {s.icon}
              </div>

              {/* Tag */}
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: hovered === i ? "#e0f2fe" : "#f1f5f9",
                  color: hovered === i ? "#0284c7" : "#6b7280",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: 12,
                  transition: "all 280ms",
                }}
              >
                {s.tag}
              </span>

              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: hovered === i ? "#0284c7" : "#111827",
                  transition: "color 280ms",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  lineHeight: 1.65,
                }}
              >
                {s.desc}
              </p>

              {/* Hover arrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 20,
                  color: "#0284c7",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  opacity: hovered === i ? 1 : 0,
                  transform:
                    hovered === i ? "translateX(0)" : "translateX(-8px)",
                  transition: "all 250ms",
                }}
              >
                En savoir plus
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
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            textAlign: "center",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "all 700ms 500ms",
          }}
        >
          <Link
            to="/services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 32px",
              borderRadius: 999,
              background: "#0077b6",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
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
            Voir Tous Nos Services
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
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
