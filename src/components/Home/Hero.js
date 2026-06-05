import React from "react";

const Hero = () => {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Full-screen background photo ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1800&q=85"
          alt="Cabinet dentaire"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
          }}
        />
        {/* Dark overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, rgba(5,20,35,0.82) 0%, rgba(5,20,35,0.65) 50%, rgba(5,20,35,0.35) 100%)",
          }}
        />
        {/* Bottom wave mask */}
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
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{ width: "100%", height: 120, display: "block" }}
          >
            <path
              d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          alignItems: "center",
          maxWidth: 1280,
          margin: "0 auto",
          padding:
            "clamp(100px, 14vw, 140px) clamp(16px, 4vw, 32px) clamp(100px, 14vw, 160px)",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: 640, width: "100%" }}>
          {/* Eyebrow */}
          <p
            className="animate-fadeInUp"
            style={{
              fontFamily: "'Dancing Script', cursive, serif",
              fontSize: "1.3rem",
              color: "#5eead4",
              marginBottom: 12,
              fontStyle: "italic",
              animationDelay: "0ms",
            }}
          >
            Dentora &amp; Cabinet Dentaire
          </p>

          {/* Headline */}
          <h1
            className="animate-fadeInUp"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#fff",
              margin: "0 0 20px",
              letterSpacing: "-0.02em",
              animationDelay: "80ms",
            }}
          >
            VOTRE SOURIRE,
            <br />
            VOTRE BIEN-ÊTRE,
            <br />
            NOTRE <span style={{ color: "#14b8a6" }}>PRIORITÉ</span>
          </h1>

          {/* Description */}
          <p
            className="animate-fadeInUp"
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 500,
              animationDelay: "160ms",
            }}
          >
            Dentora a été fondé pour ce moment spécial où les patients se
            sentent vraiment chez eux. Une équipe passionnée, des soins
            personnalisés et une technologie de pointe pour un sourire éclatant.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
