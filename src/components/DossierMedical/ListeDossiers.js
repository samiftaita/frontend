import React, { useEffect, useMemo, useState } from "react";
import { dossierMedicalApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmationModal from "../Common/ConfirmationModal";

const emptyForm = {
  patient_id: "",
  allergies: "",
  antecedents: "",
  remarques: "",
};

const ListeDossiers = () => {
  const { user, hasRole } = useAuth();
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const isAdmin = hasRole("admin");

  const dossiersVisibles = useMemo(() => {
    if (hasRole(["admin", "dentiste"])) {
      return dossiers;
    }

    return dossiers.filter((dossier) => {
      const patientUserId = dossier?.patient?.user?.id;
      const patientId = dossier?.patient_id;
      return patientUserId === user?.id || patientId === user?.patient?.id;
    });
  }, [dossiers, hasRole, user]);

  useEffect(() => {
    loadDossiers();
  }, []);

  const loadDossiers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await dossierMedicalApi.getAll();
      setDossiers(response.data?.data?.dossiers_medicaux || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de charger les dossiers medicaux",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setSelectedDossier(null);
    setFormOpen(false);
  };

  const handleEdit = (dossier) => {
    setSelectedDossier(dossier);
    setFormData({
      patient_id: dossier.patient_id || "",
      allergies: dossier.allergies || "",
      antecedents: dossier.antecedents || "",
      remarques: dossier.remarques || "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (selectedDossier) {
        await dossierMedicalApi.update(selectedDossier.id, formData);
      } else {
        await dossierMedicalApi.create(formData);
      }
      await loadDossiers();
      resetForm();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const details = Object.values(apiErrors).flat().join(" | ");
        setError(details);
      } else {
        setError(
          err.response?.data?.message ||
            "Erreur lors de la sauvegarde du dossier",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDossier) return;

    setSaving(true);
    setError("");
    try {
      await dossierMedicalApi.delete(selectedDossier.id);
      setDeleteOpen(false);
      setSelectedDossier(null);
      await loadDossiers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {dossiersVisibles.length} dossier(s) trouve(s)
        </p>
        {isAdmin && (
          <button
            onClick={() => {
              setSelectedDossier(null);
              setFormData(emptyForm);
              setFormOpen(true);
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Nouveau dossier
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {dossiersVisibles.length === 0 ? (
            <div className="p-6 text-gray-500">
              Aucun dossier medical disponible.
            </div>
          ) : (
            dossiersVisibles.map((dossier) => (
              <div key={dossier.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {dossier.patient?.user?.prenom}{" "}
                      {dossier.patient?.user?.nom}
                    </p>
                    <p className="text-sm text-gray-600">
                      Allergies: {dossier.allergies || "Aucune information"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Antecedents: {dossier.antecedents || "Aucune information"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Remarques: {dossier.remarques || "Aucune information"}
                    </p>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(dossier)}
                        className="text-sm text-primary-700 hover:text-primary-900"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDossier(dossier);
                          setDeleteOpen(true);
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-gray-900/50"
              onClick={resetForm}
              onKeyDown={(e) => e.key === "Escape" && resetForm()}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedDossier
                  ? "Modifier dossier medical"
                  : "Creer dossier medical"}
              </h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="dossier-id-patient"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    ID patient
                  </label>
                  <input
                    id="dossier-id-patient"
                    type="number"
                    value={formData.patient_id}
                    onChange={(e) =>
                      setFormData({ ...formData, patient_id: e.target.value })
                    }
                    required
                    disabled={Boolean(selectedDossier)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pour creer un dossier, utiliser un identifiant patient
                    valide de la base.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="dossier-allergies"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Allergies
                  </label>
                  <textarea
                    id="dossier-allergies"
                    rows="2"
                    value={formData.allergies}
                    onChange={(e) =>
                      setFormData({ ...formData, allergies: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dossier-antecedents"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Antecedents
                  </label>
                  <textarea
                    id="dossier-antecedents"
                    rows="2"
                    value={formData.antecedents}
                    onChange={(e) =>
                      setFormData({ ...formData, antecedents: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dossier-remarques"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Remarques
                  </label>
                  <textarea
                    id="dossier-remarques"
                    rows="2"
                    value={formData.remarques}
                    onChange={(e) =>
                      setFormData({ ...formData, remarques: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le dossier"
        message="Confirmer la suppression definitive de ce dossier medical ?"
      />
    </div>
  );
};

export default ListeDossiers;
