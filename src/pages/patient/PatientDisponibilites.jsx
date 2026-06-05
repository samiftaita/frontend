import React, { useEffect, useMemo, useState } from "react";
import { disponibiliteApi } from "../../services/api";
import PatientLoading from "../../components/patient/PatientLoading";
import PatientError from "../../components/patient/PatientError";
import PatientEmptyState from "../../components/patient/PatientEmptyState";

const PatientDisponibilites = () => {
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [jourFilter, setJourFilter] = useState("");
  const [dentisteFilter, setDentisteFilter] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const loadDisponibilites = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await disponibiliteApi.getAll();
      setDisponibilites(response.data?.data?.disponibilites || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de charger les disponibilites.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisponibilites();
  }, []);

  const dentistes = useMemo(() => {
    const map = new Map();
    disponibilites.forEach((item) => {
      const id = item.dentiste_id;
      if (!map.has(id)) {
        map.set(id, {
          id,
          nom: item.dentiste?.user?.nom || "",
          prenom: item.dentiste?.user?.prenom || "",
        });
      }
    });
    return [...map.values()];
  }, [disponibilites]);

  const jours = useMemo(() => {
    return [...new Set(disponibilites.map((item) => item.jour_semaine))];
  }, [disponibilites]);

  const filtered = useMemo(() => {
    return disponibilites.filter((item) => {
      if (jourFilter && item.jour_semaine !== jourFilter) return false;
      if (dentisteFilter && String(item.dentiste_id) !== dentisteFilter)
        return false;
      if (onlyAvailable && !item.est_disponible) return false;
      return true;
    });
  }, [disponibilites, jourFilter, dentisteFilter, onlyAvailable]);

  if (loading)
    return <PatientLoading text="Chargement des disponibilites..." />;
  if (error)
    return <PatientError message={error} onRetry={loadDisponibilites} />;

  return (
    <div>
      <h2 className="patient-page-title">Disponibilites des dentistes</h2>

      <div className="patient-filters">
        <select
          value={jourFilter}
          onChange={(e) => setJourFilter(e.target.value)}
        >
          <option value="">Tous les jours</option>
          {jours.map((jour) => (
            <option key={jour} value={jour}>
              {jour}
            </option>
          ))}
        </select>

        <select
          value={dentisteFilter}
          onChange={(e) => setDentisteFilter(e.target.value)}
        >
          <option value="">Tous les dentistes</option>
          {dentistes.map((dentiste) => (
            <option key={dentiste.id} value={dentiste.id}>
              Dr. {dentiste.prenom} {dentiste.nom}
            </option>
          ))}
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          Seulement disponibles
        </label>
      </div>

      {filtered.length === 0 ? (
        <PatientEmptyState
          title="Aucune disponibilite"
          message="Aucun creneau ne correspond aux filtres selectionnes."
        />
      ) : (
        <div className="patient-table-wrapper">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Dentiste</th>
                <th>Specialite</th>
                <th>Jour</th>
                <th>Heure debut</th>
                <th>Heure fin</th>
                <th>Disponibilite</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    Dr. {item.dentiste?.user?.prenom} {item.dentiste?.user?.nom}
                  </td>
                  <td>{item.dentiste?.specialite || "Non renseignee"}</td>
                  <td>{item.jour_semaine}</td>
                  <td>{item.heure_debut}</td>
                  <td>{item.heure_fin}</td>
                  <td>{item.est_disponible ? "Disponible" : "Indisponible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientDisponibilites;
