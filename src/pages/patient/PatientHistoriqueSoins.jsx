import React, { useCallback, useEffect, useMemo, useState } from "react";
import { dossierMedicalApi, ficheSoinApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import PatientLoading from "../../components/patient/PatientLoading";
import PatientError from "../../components/patient/PatientError";

const getPatientId = (user) => user?.patient?.id || null;

const PatientHistoriqueSoins = () => {
  const { user } = useAuth();
  const patientId = getPatientId(user);
  const [dossiers, setDossiers] = useState([]);
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistorique = useCallback(async () => {
    if (!patientId) {
      setError("Patient introuvable.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [dRes, fRes] = await Promise.all([
        dossierMedicalApi.getAll(),
        ficheSoinApi.getAll(),
      ]);
      setDossiers(dRes.data?.data?.dossiers_medicaux || []);
      setFiches(fRes.data?.data?.fiches_soins || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de charger l'historique.",
      );
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadHistorique();
  }, [loadHistorique]);

  const dossierPatient = useMemo(
    () => dossiers.find((d) => d.patient_id === patientId) || null,
    [dossiers, patientId],
  );

  const soinsPatient = useMemo(() => {
    if (!dossierPatient) return [];
    return fiches
      .filter((f) => f.dossier_medical_id === dossierPatient.id)
      .sort((a, b) => new Date(b.date_soin) - new Date(a.date_soin));
  }, [fiches, dossierPatient]);

  if (loading)
    return <PatientLoading text="Chargement de l'historique des soins..." />;
  if (error) return <PatientError message={error} onRetry={loadHistorique} />;

  const totalPrix = soinsPatient.reduce((s, f) => s + (Number(f.prix) || 0), 0);

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
            Historique des soins
          </h1>
          <p
            style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "#9ca3af" }}
          >
            Actes et traitements réalisés au cabinet
          </p>
        </div>
        {soinsPatient.length > 0 && (
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                background: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderRadius: 10,
                padding: "8px 16px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "#0284c7",
                }}
              >
                {soinsPatient.length}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.68rem",
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Soins
              </p>
            </div>
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 10,
                padding: "8px 16px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "#059669",
                }}
              >
                {totalPrix.toFixed(2)} DH
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.68rem",
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Total
              </p>
            </div>
          </div>
        )}
      </div>

      {!dossierPatient ? (
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
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
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
            Impossible d'afficher l'historique sans dossier médical.
          </p>
        </div>
      ) : soinsPatient.length === 0 ? (
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
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
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
            Aucun soin enregistré
          </p>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "0.875rem",
              color: "#9ca3af",
            }}
          >
            Aucune fiche de soin n'est encore associée à votre dossier.
          </p>
        </div>
      ) : (
        <div
          className="animate-fadeInUp"
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.845rem",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Date",
                    "Dentiste",
                    "Description",
                    "Observation",
                    "Prix",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.09em",
                        color: "#0284c7",
                        background: "#f0f9ff",
                        borderBottom: "2px solid #bae6fd",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {soinsPatient.map((item, i) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      background: i % 2 === 1 ? "#fafbfc" : "#fff",
                      transition: "background 150ms",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f9ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        i % 2 === 1 ? "#fafbfc" : "#fff")
                    }
                  >
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "#f0f9ff",
                            border: "1px solid #bae6fd",
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
                            stroke="#0284c7"
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
                        </div>
                        <span style={{ fontWeight: 600, color: "#111827" }}>
                          {new Date(item.date_soin).toLocaleDateString(
                            "fr-FR",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#374151",
                        fontWeight: 500,
                      }}
                    >
                      Dr. {item.dentiste?.user?.prenom || ""}{" "}
                      {item.dentiste?.user?.nom || ""}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#374151",
                        maxWidth: 240,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.description}
                      </p>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: item.observation ? "#374151" : "#9ca3af",
                      }}
                    >
                      {item.observation || "Non renseignée"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          background: "#f0fdf4",
                          color: "#059669",
                          border: "1px solid #bbf7d0",
                          borderRadius: 999,
                          padding: "3px 10px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                        }}
                      >
                        {Number(item.prix ?? 0).toFixed(2)} DH
                      </span>
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

export default PatientHistoriqueSoins;
