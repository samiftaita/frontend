import React, { useCallback, useEffect, useState } from "react";
import { disponibiliteApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import DentisteLoading from "../../components/dentiste/DentisteLoading";
import DentisteError from "../../components/dentiste/DentisteError";
import DentisteEmptyState from "../../components/dentiste/DentisteEmptyState";
import { CheckIcon, XCircleIcon } from "../../components/Common/Icons";

const getDentisteId = (user) => user?.dentiste?.id || null;

const DentisteDisponibilites = () => {
  const { user } = useAuth();
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dentisteId = getDentisteId(user);

  const loadData = useCallback(async () => {
    if (!dentisteId) {
      setError("Dentiste introuvable pour cet utilisateur.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await disponibiliteApi.getAll();
      const allDisponibilites = response.data?.data?.disponibilites || [];
      // Filtrer pour afficher seulement les disponibilités du dentiste
      const filteredDisponibilites = allDisponibilites.filter(
        (d) => d.dentiste_id === dentisteId,
      );
      setDisponibilites(filteredDisponibilites);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de charger les disponibilités.",
      );
    } finally {
      setLoading(false);
    }
  }, [dentisteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getJourLabel = (jour) => {
    const jours = {
      lundi: "Lundi",
      mardi: "Mardi",
      mercredi: "Mercredi",
      jeudi: "Jeudi",
      vendredi: "Vendredi",
      samedi: "Samedi",
      dimanche: "Dimanche",
    };
    return jours[jour?.toLowerCase()] || jour;
  };

  if (loading)
    return <DentisteLoading text="Chargement des disponibilités..." />;
  if (error) return <DentisteError message={error} onRetry={loadData} />;

  return (
    <div className="dentiste-disponibilites">
      <h2 className="dentiste-page-title">Mes Disponibilités</h2>

      <div className="info-box">
        <p>
          Pour modifier vos disponibilités, veuillez contacter l'administrateur
          du cabinet.
        </p>
      </div>

      {disponibilites.length === 0 ? (
        <DentisteEmptyState
          title="Aucune disponibilité trouvée"
          description="Vous n'avez pas encore de disponibilités configurées."
          icon="clock"
        />
      ) : (
        <div className="dentiste-table-container">
          <table className="dentiste-table">
            <thead>
              <tr>
                <th>Jour</th>
                <th>Heure de début</th>
                <th>Heure de fin</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {disponibilites.map((disp, index) => (
                <tr key={disp.id || index}>
                  <td>
                    <strong>{getJourLabel(disp.jour_semaine)}</strong>
                  </td>
                  <td>{disp.heure_debut}</td>
                  <td>{disp.heure_fin}</td>
                  <td>
                    <span
                      className={`availability-badge ${
                        disp.est_disponible ? "available" : "unavailable"
                      }`}
                    >
                      {disp.est_disponible ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>{" "}
                          Disponible
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                          </svg>{" "}
                          Indisponible
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DentisteDisponibilites;
