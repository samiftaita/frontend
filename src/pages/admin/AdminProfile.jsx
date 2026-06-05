import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import AdminLoading from "../../components/admin/AdminLoading";
import AdminError from "../../components/admin/AdminError";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/profile", { suppressToast: true });
      setProfile(res.data?.data?.user || res.data?.user || null);
    } catch {
      setError("Impossible de charger le profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadProfile();
    setSuccess("Profil actualisé avec succès.");
    setTimeout(() => setSuccess(""), 3000);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) return <AdminLoading text="Chargement du profil..." />;
  if (error && !profile)
    return <AdminError message={error} onRetry={loadProfile} />;

  const initials =
    `${profile?.prenom?.[0] || ""}${profile?.nom?.[0] || ""}`.toUpperCase() ||
    "AD";
  const fullName =
    `${profile?.prenom || ""} ${profile?.nom || ""}`.trim() || "Administrateur";

  const fields = [
    { label: "Nom", value: profile?.nom },
    { label: "Prénom", value: profile?.prenom },
    { label: "Email", value: profile?.email },
    { label: "Téléphone", value: profile?.telephone },
    { label: "Rôle", value: profile?.role },
  ];

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
            Mon Profil
          </h1>
          <p
            style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "#9ca3af" }}
          >
            Informations du compte administrateur
          </p>
        </div>
      </div>

      {/* ── Messages ── */}
      {error && <div className="admin-message error">{error}</div>}
      {success && <div className="admin-message success">{success}</div>}

      {/* ── Carte profil ── */}
      <div
        className="animate-fadeInUp"
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          padding: "28px",
        }}
      >
        {/* Avatar + nom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            paddingBottom: 24,
            marginBottom: 24,
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#0ea5e9",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              {fullName}
            </h2>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#e0f2fe",
                color: "#0284c7",
                padding: "3px 10px",
                borderRadius: 999,
                fontSize: "0.72rem",
                fontWeight: 700,
                border: "1px solid rgba(14,165,233,0.25)",
                marginTop: 6,
              }}
            >
              Administrateur
            </span>
          </div>
        </div>

        {/* Grille des champs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px 32px",
            marginBottom: 28,
          }}
        >
          {fields.map(({ label, value }) => (
            <div key={label}>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  color: "#9ca3af",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: value ? "#111827" : "#d1d5db",
                }}
              >
                {value || "Non renseigné"}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ paddingTop: 20, borderTop: "1px solid #f3f4f6" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? "Actualisation..." : "Actualiser"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
