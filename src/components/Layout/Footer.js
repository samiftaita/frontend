import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer
    style={{
      background: "linear-gradient(180deg,#0a1628 0%,#050d1a 100%)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Top wave */}
    <div style={{ lineHeight: 0, marginTop: -2 }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ width: "100%", height: 80, display: "block" }}
      >
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="#f0fdf9" />
      </svg>
    </div>

    {/* Ambient blobs */}
    <div
      style={{
        position: "absolute",
        top: 60,
        left: "10%",
        width: 300,
        height: 300,
        background:
          "radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 40,
        right: "10%",
        width: 250,
        height: 250,
        background:
          "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "clamp(40px, 6vw, 60px) clamp(16px, 4vw, 32px) 32px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
          gap: "clamp(24px, 4vw, 48px)",
          marginBottom: 56,
        }}
      >
        {/* Brand */}
        <div>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg,#14b8a6,#0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <path
                  d="M32 8C24 8 16 15 16 25C16 33 20 40 22 48C24 56 24 64 24 73C24 78 26 82 30 82C34 82 36 78 38 73C40 68 42 64 50 64C58 64 60 68 62 73C64 78 66 82 70 82C74 82 76 78 76 73C76 64 76 56 78 48C80 40 84 33 84 25C84 15 76 8 68 8C63 8 57 11 50 11C43 11 37 8 32 8Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                DENT<span style={{ color: "#14b8a6" }}>ORA</span>
              </div>
              <div
                style={{
                  fontSize: "0.58rem",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                DENTISTRY
              </div>
            </div>
          </Link>
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            Votre partenaire de confiance pour un sourire sain et éclatant.
            Expertise, modernité et bienveillance au cœur de nos soins.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {["facebook", "instagram", "twitter"].map((s) => (
              <button
                key={s}
                type="button"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "all 200ms",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(20,184,166,0.15)";
                  e.currentTarget.style.borderColor = "rgba(20,184,166,0.3)";
                  e.currentTarget.style.color = "#14b8a6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                <svg
                  width="15"
                  height="15"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {s === "facebook" && (
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  )}
                  {s === "instagram" && (
                    <>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path
                        d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="17.5"
                        y1="6.5"
                        x2="17.51"
                        y2="6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </>
                  )}
                  {s === "twitter" && (
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  )}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 20,
            }}
          >
            Navigation
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              { label: "Accueil", path: "/" },
              { label: "Services", path: "/services" },
              { label: "À propos", path: "/about" },
              { label: "Connexion", path: "/login" },
              { label: "Inscription", path: "/register" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "color 200ms",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#14b8a6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                  }
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#14b8a6",
                      flexShrink: 0,
                    }}
                  />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 20,
            }}
          >
            Contact
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                icon: (
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                ),
                text: "123 Avenue de la Santé, Casablanca",
              },
              {
                icon: (
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                ),
                text: "+212 522 00 00 00",
              },
              {
                icon: (
                  <>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </>
                ),
                text: "contact@dentora.ma",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(20,184,166,0.1)",
                    border: "1px solid rgba(20,184,166,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    {item.icon}
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.5,
                    paddingTop: 6,
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div>
          <h4
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 20,
            }}
          >
            Horaires
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 20,
            }}
          >
            {[
              { day: "Lun – Ven", hours: "09:00 – 19:00", open: true },
              { day: "Samedi", hours: "09:00 – 14:00", open: true },
              { day: "Dimanche", hours: "Fermé", open: false },
            ].map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {h.day}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: h.open ? "#14b8a6" : "#f87171",
                  }}
                >
                  {h.hours}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              background: "rgba(20,184,166,0.08)",
              border: "1px solid rgba(20,184,166,0.2)",
              borderRadius: 14,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#14b8a6",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#14b8a6",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Urgences 24h/24
              </span>
            </div>
            <p
              style={{
                margin: 0,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              +212 522 00 00 01
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          &copy; {new Date().getFullYear()} DENTORA. Tous droits réservés.
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Confidentialité", "Conditions", "Cookies"].map((item) => (
            <button
              key={item}
              type="button"
              style={{
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.3)",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "none",
                transition: "color 200ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#14b8a6")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
