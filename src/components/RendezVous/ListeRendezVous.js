import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
import { rendezVousApi } from "../../services/api";
import StatutBadge from "../Common/StatutBadge";
import ConfirmationModal from "../Common/ConfirmationModal";
import { useAuth } from "../../contexts/AuthContext";

const ListeRendezVous = forwardRef((props, ref) => {
  const { user } = useAuth();
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);

  // Définir l'ordre et le label des statuts
  const statutConfig = {
    en_attente: {
      label: "En attente",
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: "hourglass",
    },
    confirme: {
      label: "Confirmé",
      color: "bg-green-50",
      borderColor: "border-green-200",
      icon: "check",
    },
    reporte: {
      label: "Reporté",
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: "calendar",
    },
    annule: {
      label: "Annulé",
      color: "bg-red-50",
      borderColor: "border-red-200",
      icon: "close",
    },
  };

  const StatutIcon = ({ name, size = 22 }) => {
    const icons = {
      hourglass: (
        <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 2v6l2 2-2 2v6h12v-6l-2-2 2-2V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5-4-4V4h8v3.5l-4 4z" />
        </svg>
      ),
      check: (
        <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      ),
      calendar: (
        <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM7 12h5v5H7z" />
        </svg>
      ),
      close: (
        <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      ),
    };
    return icons[name] || null;
  };

  StatutIcon.propTypes = {
    name: PropTypes.string,
    size: PropTypes.number,
  };

  StatutIcon.defaultProps = {
    name: "",
    size: 22,
  };

  const loadRendezVous = useCallback(async () => {
    try {
      const patientId = user?.patient?.id || user?.id;
      const response = await rendezVousApi.getAll(
        patientId ? { patient_id: patientId } : {},
      );
      setRendezVous(response.data?.data?.rendez_vous || []);
    } catch (error) {
      console.error("Erreur chargement rendez-vous:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Exposer la méthode reloadRendezVous via le ref
  useImperativeHandle(ref, () => ({
    reloadRendezVous: loadRendezVous,
  }));

  useEffect(() => {
    loadRendezVous();
  }, [loadRendezVous]);

  const handleAnnuler = async () => {
    try {
      const response = await rendezVousApi.delete(selectedRdv.id);
      await loadRendezVous();
      setModalOpen(false);
      alert(response.data.message || "Rendez-vous annulé avec succès");
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de l'annulation";
      console.error("Erreur annulation:", error);
      alert(message);
    }
  };

  // Grouper les rendez-vous par statut
  const groupedByStatut = Object.keys(statutConfig).reduce((acc, statut) => {
    acc[statut] = rendezVous.filter((rdv) => rdv.statut === statut);
    return acc;
  }, {});

  if (loading) return <div className="text-center py-10">Chargement...</div>;

  const totalRdv = rendezVous.length;

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statutConfig).map(([statut, config]) => (
          <div
            key={statut}
            className={`${config.color} border ${config.borderColor} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">
                  {config.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {groupedByStatut[statut].length}
                </p>
              </div>
              <StatutIcon name={config.icon} size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Sections par statut */}
      {totalRdv === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-12 text-gray-500 text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <p>Aucun rendez-vous trouvé</p>
          </div>
        </div>
      ) : (
        Object.entries(statutConfig).map(([statut, config]) => {
          const rdvParStatut = groupedByStatut[statut];

          if (rdvParStatut.length === 0) return null;

          return (
            <div
              key={statut}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div
                className={`${config.color} ${config.borderColor} border-b px-8 py-4 flex items-center gap-3`}
              >
                <span className="text-gray-600">
                  <StatutIcon name={config.icon} size={20} />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">{config.label}</h3>
                  <p className="text-xs text-gray-600">
                    {rdvParStatut.length} rendez-vous
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {rdvParStatut
                  .sort((a, b) => new Date(b.date_rdv) - new Date(a.date_rdv))
                  .map((rdv) => (
                    <div
                      key={rdv.id}
                      className="px-8 py-6 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-1">
                            {rdv.motif}
                          </p>
                          <p className="text-sm font-medium text-primary-600 mb-2">
                            {rdv.service?.nom} - {rdv.service?.prix}€
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                              {new Date(rdv.date_rdv).toLocaleDateString(
                                "fr-FR",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                              {rdv.heure_debut}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                ></path>
                              </svg>
                              Dr. {rdv.dentiste?.user?.prenom}{" "}
                              {rdv.dentiste?.user?.nom}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-3 ml-4">
                          <StatutBadge statut={rdv.statut} />
                          {rdv.statut === "en_attente" &&
                            user?.role === "patient" && (
                              <button
                                onClick={() => {
                                  setSelectedRdv(rdv);
                                  setModalOpen(true);
                                }}
                                className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline transition-all"
                              >
                                Annuler
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleAnnuler}
        title="Annuler le rendez-vous"
        message="Êtes-vous sûr de vouloir annuler ce rendez-vous ?"
      />
    </div>
  );
});

ListeRendezVous.displayName = "ListeRendezVous";

ListeRendezVous.propTypes = {};

ListeRendezVous.defaultProps = {};

export default ListeRendezVous;
