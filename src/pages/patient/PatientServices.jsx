import React, { useEffect, useMemo, useState } from "react";
import { serviceApi } from "../../services/api";
import PatientLoading from "../../components/patient/PatientLoading";
import PatientError from "../../components/patient/PatientError";
import PatientEmptyState from "../../components/patient/PatientEmptyState";
import PatientCard from "../../components/patient/PatientCard";
import {
  Cog6ToothIcon,
  SparklesIcon,
  BeakerIcon,
  FaceSmileIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const serviceIcons = [
  <Cog6ToothIcon className="w-6 h-6" />,
  <Cog6ToothIcon className="w-6 h-6" />,
  <SparklesIcon className="w-6 h-6" />,
  <BeakerIcon className="w-6 h-6" />,
  <FaceSmileIcon className="w-6 h-6" />,
  <StarIcon className="w-6 h-6" />,
  <StarIcon className="w-6 h-6" />,
  <BeakerIcon className="w-6 h-6" />,
];
const serviceColors = [
  "blue",
  "teal",
  "violet",
  "green",
  "amber",
  "blue",
  "teal",
  "violet",
];

const PatientServices = () => {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await serviceApi.getAll();
      setServices(response.data?.data?.services || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de charger les services.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return services;
    return services.filter((service) => {
      const nom = (service.nom || "").toLowerCase();
      const description = (service.description || "").toLowerCase();
      return nom.includes(term) || description.includes(term);
    });
  }, [services, query]);

  if (loading) return <PatientLoading text="Chargement des services..." />;
  if (error) return <PatientError message={error} onRetry={loadServices} />;

  return (
    <div className="animate-fadeIn">
      <div className="patient-page-header animate-fadeInDown">
        <h2 className="patient-page-title">Services dentaires</h2>
        <input
          className="patient-search"
          placeholder="Rechercher par nom ou description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: 280 }}
        />
      </div>

      {filteredServices.length === 0 ? (
        <PatientEmptyState
          title="Aucun service trouvé"
          message="Aucun service ne correspond à votre recherche."
        />
      ) : (
        <div className="patient-grid">
          {filteredServices.map((service, i) => (
            <PatientCard
              key={service.id}
              title={service.nom}
              icon={serviceIcons[i % serviceIcons.length]}
              color={serviceColors[i % serviceColors.length]}
              delay={i * 70}
            >
              {service.description && (
                <p
                  style={{
                    color: "var(--color-gray-500)",
                    fontSize: "0.85rem",
                    marginBottom: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {service.description}
                </p>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(14,165,233,0.08)",
                    color: "#0369a1",
                    border: "1px solid rgba(14,165,233,0.2)",
                    borderRadius: 999,
                    padding: "3px 10px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  <CurrencyDollarIcon className="w-4 h-4" />{" "}
                  {Number(service.prix).toFixed(2)} MAD
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(20,184,166,0.08)",
                    color: "#0d9488",
                    border: "1px solid rgba(20,184,166,0.2)",
                    borderRadius: 999,
                    padding: "3px 10px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  <ClockIcon className="w-4 h-4" /> {service.duree} min
                </span>
              </div>
            </PatientCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientServices;
