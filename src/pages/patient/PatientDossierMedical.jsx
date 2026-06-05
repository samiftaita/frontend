import React, { useCallback, useEffect, useMemo, useState } from "react";
import { dossierMedicalApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import PatientLoading from "../../components/patient/PatientLoading";
import PatientError from "../../components/patient/PatientError";

const getPatientId = (user) => user?.patient?.id || null;
const display = (v) =>
  v === null || v === undefined || v === "" ? "Non renseigné" : v;

const Field = ({ label, value, icon }) => (
  <div
    style={{
      background: "#f9fafb",
      borderRadius: 12,
      padding: "16px 18px",
      border: "1px solid #f3f4f6",
    }}
  >
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "#e0f2fe",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
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
        {label}
      </p>
    </div>
    <p
      style={{
        margin: 0,
        fontSize: "0.9rem",
        color: value ? "#111827" : "#9ca3af",
        fontWeight: value ? 500 : 400,
        lineHeight: 1.6,
      }}
    >
      {display(value)}
    </p>
  </div>
);

const PatientDossierMedical = () => {
  const { user } = useAuth();
  const patientId = getPatientId(user);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDossier = useCallback(async () => {
    if (!patientId) {
      setError("Patient introuvable.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await dossierMedicalApi.getAll();
      setDossiers(res.data?.data?.dossiers_medicaux || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de charger le dossier médical.",
      );
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadDossier();
  }, [loadDossier]);

  const dossier = useMemo(
    () => dossiers.find((d) => d.patient_id === patientId) || null,
    [dossiers, patientId],
  );

  if (loading)
    return <PatientLoading text="Chargement du dossier médical..." />;
  if (error) return <PatientError message={error} onRetry={loadDossier} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* En-tête */}
      <div
        className="animate-fadeInDown"
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          padding: "20px 24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.03em",
          }}
        >
          Dossier médical
        </h1>
        <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "#9ca3af" }}>
          Votre historique médical et informations de santé
        </p>
      </div>

      {!dossier ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              width="26"
              height="26"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 700,
              color: "#374151",
            }}
          >
            Aucun dossier médical
          </p>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "0.875rem",
              color: "#9ca3af",
            }}
          >
            Votre dossier médical n'est pas encore disponible.
          </p>
        </div>
      ) : (
        <div
          className="animate-fadeInUp"
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            padding: "24px",
          }}
        >
          {/* Badge dossier */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#e0f2fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {user?.prenom} {user?.nom}
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "0.78rem",
                  color: "#9ca3af",
                }}
              >
                Dossier #{dossier.id} · Mis à jour le{" "}
                {new Date(
                  dossier.updated_at || dossier.created_at,
                ).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          {/* Champs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            <Field
              label="Allergies"
              value={dossier.allergies}
              icon={
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              }
            />
            <Field
              label="Antécédents médicaux"
              value={dossier.antecedents}
              icon={
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="16" x2="13" y2="16" />
                </svg>
              }
            />
            <Field
              label="Remarques"
              value={dossier.remarques}
              icon={
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDossierMedical;
