import React, { useCallback, useEffect, useState } from "react";
import {
  ficheSoinApi,
  dossierMedicalApi,
  rendezVousApi,
} from "../../services/api";
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

const DentisteFichesSoins = () => {
  const { user } = useAuth();
  const [fichesSoins, setFichesSoins] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [patientsOfDentiste, setPatientsOfDentiste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    dossier_medical_id: "",
    date_soin: "",
    description: "",
    observation: "",
    prix: "",
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
      setPatientsOfDentiste(Array.from(patientMap.values()));

      const dossiersResponse = await dossierMedicalApi.getAll();
      setDossiers(dossiersResponse.data?.data?.dossiers_medicaux || []);

      const fichesResponse = await ficheSoinApi.getAll();
      const allFiches = fichesResponse.data?.data?.fiches_soins || [];
      setFichesSoins(allFiches.filter((f) => f.dentiste_id === dentisteId));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de charger les fiches de soins.",
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
      dossier_medical_id: "",
      date_soin: new Date().toISOString().split("T")[0],
      description: "",
      observation: "",
      prix: "",
    });
    setEditingId(null);
    setFormVisible(true);
  };

  const handleEditForm = (fiche) => {
    setFormData({
      dossier_medical_id: fiche.dossier_medical_id,
      date_soin: fiche.date_soin,
      description: fiche.description || "",
      observation: fiche.observation || "",
      prix: fiche.prix || "",
    });
    setEditingId(fiche.id);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingId(null);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (
      !formData.dossier_medical_id ||
      !formData.date_soin ||
      !formData.description
    ) {
      notifyError("Veuillez remplir les champs obligatoires");
      return;
    }

    const submitData = {
      ...formData,
      dentiste_id: dentisteId,
      dossier_medical_id: parseInt(formData.dossier_medical_id),
      prix: formData.prix ? parseFloat(formData.prix) : null,
    };

    try {
      if (editingId) {
        await ficheSoinApi.update(editingId, submitData, {
          suppressToast: true,
        });
        notifySuccess("Fiche modifiée avec succès");
      } else {
        await ficheSoinApi.create(submitData, { suppressToast: true });
        notifySuccess("Fiche créée avec succès");
      }
      handleCloseForm();
      loadData();
    } catch (err) {
      notifyError(
        getApiMessage(err.response?.data, "Erreur lors de l'opération"),
      );
    }
  };

  const handleDeleteClick = (fiche) => {
    setConfirmModal({
      fiche,
      title: "Supprimer la fiche",
      message: "Êtes-vous sûr de vouloir supprimer cette fiche de soin ?",
    });
  };

  const confirmDelete = async () => {
    try {
      await ficheSoinApi.delete(confirmModal.fiche.id, { suppressToast: true });
      notifySuccess("Fiche supprimée avec succès");
      setConfirmModal(null);
      loadData();
    } catch (err) {
      notifyError("Erreur lors de la suppression");
    }
  };

  if (loading) return <DentisteLoading text="Chargement des fiches..." />;
  if (error) return <DentisteError message={error} onRetry={loadData} />;

  return (
    <div className="dentiste-fiches animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary-900">Fiches de Soins</h2>
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
            Nouvelle fiche
          </button>
        )}
      </div>

      {formVisible && (
        <div className="bg-white p-8 rounded-[2rem] border border-primary-100 shadow-xl mb-8 animate-slide-up">
          <h3 className="text-xl font-bold text-primary-900 mb-6">
            {editingId
              ? "Modifier la fiche de soin"
              : "Ajouter une nouvelle fiche de soin"}
          </h3>
          <form
            onSubmit={handleSubmitForm}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary-500 uppercase tracking-widest">
                Dossier médical (Patient) *
              </label>
              <select
                className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.dossier_medical_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dossier_medical_id: e.target.value,
                  })
                }
                disabled={editingId !== null}
                required
              >
                <option value="">Sélectionnez un dossier</option>
                {dossiers.map((dossier) => {
                  const patient =
                    patientsOfDentiste.find(
                      (p) => p.id === dossier.patient_id,
                    ) || dossier.patient;
                  return (
                    <option key={dossier.id} value={dossier.id}>
                      {patient
                        ? getPatientDisplayName(patient)
                        : `Patient #${dossier.patient_id}`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dentiste-fiche-date"
                className="text-xs font-bold text-primary-500 uppercase tracking-widest"
              >
                Date du soin *
              </label>
              <input
                id="dentiste-fiche-date"
                type="date"
                className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.date_soin}
                onChange={(e) =>
                  setFormData({ ...formData, date_soin: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="dentiste-fiche-description"
                className="text-xs font-bold text-primary-500 uppercase tracking-widest"
              >
                Description du soin *
              </label>
              <textarea
                id="dentiste-fiche-description"
                className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Détaillez l'acte médical effectué..."
                rows="3"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dentiste-fiche-observation"
                className="text-xs font-bold text-primary-500 uppercase tracking-widest"
              >
                Observations
              </label>
              <textarea
                id="dentiste-fiche-observation"
                className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.observation}
                onChange={(e) =>
                  setFormData({ ...formData, observation: e.target.value })
                }
                placeholder="Remarques complémentaires..."
                rows="2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dentiste-fiche-prix"
                className="text-xs font-bold text-primary-500 uppercase tracking-widest"
              >
                Prix (MAD)
              </label>
              <div className="relative">
                <input
                  id="dentiste-fiche-prix"
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none pr-12"
                  value={formData.prix}
                  onChange={(e) =>
                    setFormData({ ...formData, prix: e.target.value })
                  }
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 font-bold text-sm">
                  MAD
                </span>
              </div>
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
                {editingId ? "Mettre à jour" : "Enregistrer la fiche"}
              </button>
            </div>
          </form>
        </div>
      )}

      {fichesSoins.length === 0 ? (
        <DentisteEmptyState
          title="Aucune fiche de soin"
          description="Commencez par créer une fiche de soin pour l'un de vos patients."
          icon="clipboard"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fichesSoins.map((fiche) => {
            const dossier = dossiers.find(
              (d) => d.id === fiche.dossier_medical_id,
            );
            const patient =
              patientsOfDentiste.find((p) => p.id === dossier?.patient_id) ||
              dossier?.patient;
            return (
              <div
                key={fiche.id}
                className="bg-white rounded-[2rem] border border-primary-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col"
              >
                <div className="bg-primary-50 px-6 py-4 flex justify-between items-center border-b border-primary-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <svg
                        className="w-5 h-5 text-brand-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <span className="font-bold text-primary-900">
                      {new Date(fiche.date_soin).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="p-2 text-primary-400 hover:text-brand-600 transition-colors"
                      onClick={() => handleEditForm(fiche)}
                    >
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-primary-400 hover:text-red-500 transition-colors"
                      onClick={() => handleDeleteClick(fiche)}
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-1">
                      Patient
                    </p>
                    <p className="font-bold text-primary-900">
                      {patient
                        ? getPatientDisplayName(patient)
                        : `Patient #${dossier?.patient_id || "N/A"}`}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-1">
                      Description
                    </p>
                    <p className="text-sm text-primary-700 leading-relaxed line-clamp-3">
                      {fiche.description}
                    </p>
                  </div>

                  {fiche.observation && (
                    <div>
                      <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-1">
                        Observation
                      </p>
                      <p className="text-sm text-primary-500 italic">
                        {fiche.observation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-primary-50/50 border-t border-primary-50 flex justify-between items-center">
                  <span className="text-xs text-primary-400 font-medium">
                    Prix du soin
                  </span>
                  <span className="text-lg font-black text-brand-600">
                    {fiche.prix
                      ? `${parseFloat(fiche.prix).toFixed(2)} MAD`
                      : "-- MAD"}
                  </span>
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

export default DentisteFichesSoins;
