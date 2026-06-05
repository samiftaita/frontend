import React, { useCallback, useEffect, useState } from "react";
import { rendezVousApi, dossierMedicalApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import DentisteLoading from "../../components/dentiste/DentisteLoading";
import DentisteError from "../../components/dentiste/DentisteError";
import DentisteEmptyState from "../../components/dentiste/DentisteEmptyState";
import ConfirmModal from "../../components/dentiste/ConfirmModal";
import {
  getApiMessage,
  notifyError,
  notifySuccess,
} from "../../utils/notifications";

const getDentisteId = (user) => user?.dentiste?.id || null;

const getPatientDisplayName = (patient) => {
  const source = patient?.user || patient;
  const prenom = source?.prenom || source?.first_name || "";
  const nom = source?.nom || source?.last_name || "";

  return `${prenom} ${nom}`.trim() || "Patient inconnu";
};

const DentisteDossiersMedicaux = () => {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState([]);
  const [patientsOfDentiste, setPatientsOfDentiste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: "",
    allergies: "",
    antecedents: "",
    remarques: "",
  });
  const [confirmModal, setConfirmModal] = useState(null);

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
      const rdvResponse = await rendezVousApi.getAll({
        dentiste_id: dentisteId,
      });
      const rdvList = rdvResponse.data?.data?.rendez_vous || [];

      const patientMap = new Map();
      rdvList.forEach((rdv) => {
        if (rdv.patient && !patientMap.has(rdv.patient_id)) {
          patientMap.set(rdv.patient_id, rdv.patient);
        }
      });
      const uniquePatients = Array.from(patientMap.values());
      setPatientsOfDentiste(uniquePatients);

      const dossiersResponse = await dossierMedicalApi.getAll();
      const allDossiers = dossiersResponse.data?.data?.dossiers_medicaux || [];

      const filteredDossiers = allDossiers.filter((d) =>
        patientMap.has(d.patient_id),
      );
      setDossiers(filteredDossiers);
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de charger les dossiers.",
      );
    } finally {
      setLoading(false);
    }
  }, [dentisteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddForm = () => {
    setFormData({
      patient_id: "",
      allergies: "",
      antecedents: "",
      remarques: "",
    });
    setEditingId(null);
    setFormVisible(true);
  };

  const handleEditForm = (dossier) => {
    setFormData({
      patient_id: dossier.patient_id,
      allergies: dossier.allergies || "",
      antecedents: dossier.antecedents || "",
      remarques: dossier.remarques || "",
    });
    setEditingId(dossier.id);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingId(null);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.patient_id) {
      notifyError("Veuillez sélectionner un patient");
      return;
    }

    try {
      if (editingId) {
        await dossierMedicalApi.update(editingId, formData, {
          suppressToast: true,
        });
        notifySuccess("Dossier modifié avec succès");
      } else {
        await dossierMedicalApi.create(formData, { suppressToast: true });
        notifySuccess("Dossier créé avec succès");
      }
      handleCloseForm();
      loadData();
    } catch (err) {
      notifyError(
        getApiMessage(err.response?.data, "Erreur lors de l'opération"),
      );
    }
  };

  const handleDeleteClick = (dossier) => {
    setConfirmModal({
      dossier,
      title: "Supprimer le dossier",
      message: "Êtes-vous sûr de vouloir supprimer ce dossier médical ?",
    });
  };

  const confirmDelete = async () => {
    try {
      await dossierMedicalApi.delete(confirmModal.dossier.id, {
        suppressToast: true,
      });
      notifySuccess("Dossier supprimé avec succès");
      setConfirmModal(null);
      loadData();
    } catch (err) {
      notifyError("Erreur lors de la suppression");
    }
  };

  if (loading) return <DentisteLoading text="Chargement des dossiers..." />;
  if (error) return <DentisteError message={error} onRetry={loadData} />;

  return (
    <div className="dentiste-dossiers animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary-900">
          Dossiers Médicaux
        </h2>
        {!formVisible && (
          <button
            className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 flex items-center gap-2"
            onClick={handleAddForm}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouveau dossier
          </button>
        )}
      </div>

      {formVisible && (
        <div className="bg-white p-8 rounded-[2rem] border border-primary-100 shadow-xl mb-8 animate-slide-up">
          <h3 className="text-xl font-bold text-primary-900 mb-6">
            {editingId ? "Modifier le dossier" : "Ajouter un nouveau dossier"}
          </h3>
          <form
            onSubmit={handleSubmitForm}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="dentiste-dossier-patient"
                className="text-xs font-bold text-primary-500 uppercase tracking-widest"
              >
                Patient *
              </label>
              <select
                id="dentiste-dossier-patient"
                className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.patient_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    patient_id: parseInt(e.target.value),
                  })
                }
                disabled={editingId !== null}
                required
              >
                <option value="">Sélectionnez un patient</option>
                {patientsOfDentiste.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {getPatientDisplayName(patient)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dentiste-allergies"
                className="text-xs font-bold text-primary-500 uppercase tracking-widest"
              >
                Allergies
              </label>
              <textarea
                id="dentiste-allergies"
                className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.allergies}
                onChange={(e) =>
                  setFormData({ ...formData, allergies: e.target.value })
                }
                placeholder="Détaillez les allergies..."
                rows="3"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dentiste-antecedents"
                className="text-xs font-bold text-primary-500 uppercase tracking-widest"
              >
                Antécédents
              </label>
              <textarea
                id="dentiste-antecedents"
                className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.antecedents}
                onChange={(e) =>
                  setFormData({ ...formData, antecedents: e.target.value })
                }
                placeholder="Historique médical..."
                rows="3"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="dentiste-remarques"
                className="text-xs font-bold text-primary-500 uppercase tracking-widest"
              >
                Remarques
              </label>
              <textarea
                id="dentiste-remarques"
                className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.remarques}
                onChange={(e) =>
                  setFormData({ ...formData, remarques: e.target.value })
                }
                placeholder="Observations supplémentaires..."
                rows="3"
              />
            </div>

            <div className="flex gap-4 md:col-span-2 justify-end mt-4">
              <button
                type="button"
                className="px-8 py-3 bg-primary-100 text-primary-700 rounded-xl font-bold hover:bg-primary-200 transition-all"
                onClick={handleCloseForm}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100"
              >
                {editingId ? "Mettre à jour" : "Créer le dossier"}
              </button>
            </div>
          </form>
        </div>
      )}

      {dossiers.length === 0 ? (
        <DentisteEmptyState
          title="Aucun dossier trouvé"
          description="Vous n'avez pas encore de dossiers médicaux pour vos patients."
          icon="folder"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dossiers.map((dossier) => {
            const patient =
              patientsOfDentiste.find((p) => p.id === dossier.patient_id) ||
              dossier.patient;
            return (
              <div
                key={dossier.id}
                className="bg-white p-8 rounded-[2rem] border border-primary-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-primary-900 group-hover:text-brand-600 transition-colors">
                      {patient
                        ? getPatientDisplayName(patient)
                        : `Patient #${dossier.patient_id}`}
                    </h4>
                    <p className="text-xs text-primary-400 uppercase tracking-widest mt-1">
                      Dossier Médical
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-primary-400 hover:text-brand-600 transition-colors"
                      onClick={() => handleEditForm(dossier)}
                      title="Modifier"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-primary-400 hover:text-red-500 transition-colors"
                      onClick={() => handleDeleteClick(dossier)}
                      title="Supprimer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                      Allergies
                    </p>
                    <p className="text-sm text-primary-700 leading-relaxed bg-primary-50 p-3 rounded-xl border border-primary-100">
                      {dossier.allergies || "Aucune allergie connue"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                      Antécédents
                    </p>
                    <p className="text-sm text-primary-700 leading-relaxed bg-primary-50 p-3 rounded-xl border border-primary-100">
                      {dossier.antecedents ||
                        "Aucun antécédent médical important"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                      Remarques
                    </p>
                    <p className="text-sm text-primary-600 italic">
                      {dossier.remarques || "Patient en bon état général"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText="Supprimer"
          cancelText="Annuler"
          isDangerous={true}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
};

export default DentisteDossiersMedicaux;
