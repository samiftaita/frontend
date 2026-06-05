import React, { useEffect, useState } from "react";
import { dossierMedicalApi } from "../../services/api";
import AdminLoading from "../../components/admin/AdminLoading";
import AdminError from "../../components/admin/AdminError";
import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminFormModal from "../../components/admin/AdminFormModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import {
  getApiErrorMessage,
  getPersonName,
} from "../../components/admin/adminHelpers";

const emptyForm = {
  patient_id: "",
  allergies: "",
  antecedents: "",
  remarques: "",
};

const AdminDossiersMedicaux = () => {
  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await dossierMedicalApi.getAll();
      const dossiersList = res.data?.data?.dossiers_medicaux || [];
      setItems(dossiersList);
      // Extraire les patients uniques depuis les dossiers
      const patientMap = new Map();
      dossiersList.forEach((d) => {
        if (d.patient && d.patient_id && !patientMap.has(d.patient_id)) {
          patientMap.set(d.patient_id, {
            id: d.patient_id,
            user: d.patient?.user,
          });
        }
      });
      setPatients([...patientMap.values()]);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Impossible de charger les dossiers médicaux."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      patient_id: item.patient_id ?? "",
      allergies: item.allergies || "",
      antecedents: item.antecedents || "",
      remarques: item.remarques || "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingItem) {
        await dossierMedicalApi.update(editingItem.id, formData);
        setSuccess("Dossier médical modifié avec succès.");
      } else {
        await dossierMedicalApi.create(formData);
        setSuccess("Dossier médical créé avec succès.");
      }
      setFormOpen(false);
      await loadItems();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l'enregistrement."));
    }
  };

  const askDelete = (item) => {
    setDeletingItem(item);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await dossierMedicalApi.delete(deletingItem.id);
      setSuccess("Dossier médical supprimé avec succès.");
      setConfirmOpen(false);
      setDeletingItem(null);
      await loadItems();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de la suppression."));
    }
  };

  if (loading)
    return <AdminLoading text="Chargement des dossiers médicaux..." />;
  if (error && !items.length)
    return <AdminError message={error} onRetry={loadItems} />;

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-page-title">Dossiers médicaux</h2>
          <p className="admin-page-subtitle">
            Gestion complète des dossiers patients.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + Ajouter un dossier
        </button>
      </div>

      {success && (
        <div className="admin-message success" style={{ marginBottom: 16 }}>
          {success}
        </div>
      )}
      {error && (
        <div className="admin-message error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div className="admin-table-wrapper">
        {items.length === 0 ? (
          <AdminEmptyState
            title="Aucun dossier médical"
            message="Aucun dossier n'est enregistré."
            actionLabel="Ajouter un dossier"
            onAction={openCreate}
          />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Allergies</th>
                <th>Antécédents</th>
                <th>Remarques</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{getPersonName(item.patient)}</td>
                  <td>{item.allergies || "—"}</td>
                  <td>{item.antecedents || "—"}</td>
                  <td>{item.remarques || "—"}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => openEdit(item)}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => askDelete(item)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminFormModal
        isOpen={formOpen}
        title={
          editingItem
            ? "Modifier le dossier médical"
            : "Ajouter un dossier médical"
        }
        submitLabel={editingItem ? "Modifier" : "Ajouter"}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="admin-field">
          <label htmlFor="dossier-patient">Patient</label>
          <select
            id="dossier-patient"
            className="admin-select"
            value={formData.patient_id}
            onChange={(e) =>
              setFormData({ ...formData, patient_id: e.target.value })
            }
            required
          >
            <option value="">Sélectionner un patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.user?.prenom} {p.user?.nom}
              </option>
            ))}
          </select>
        </div>
        <div
          className="admin-grid"
          style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}
        >
          <div className="admin-field">
            <label htmlFor="dossier-allergies">Allergies</label>
            <textarea
              id="dossier-allergies"
              className="admin-textarea"
              value={formData.allergies}
              onChange={(e) =>
                setFormData({ ...formData, allergies: e.target.value })
              }
              style={{ minHeight: 80 }}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="dossier-antecedents">Antécédents</label>
            <textarea
              id="dossier-antecedents"
              className="admin-textarea"
              value={formData.antecedents}
              onChange={(e) =>
                setFormData({ ...formData, antecedents: e.target.value })
              }
              style={{ minHeight: 80 }}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="dossier-remarques">Remarques</label>
            <textarea
              id="dossier-remarques"
              className="admin-textarea"
              value={formData.remarques}
              onChange={(e) =>
                setFormData({ ...formData, remarques: e.target.value })
              }
              style={{ minHeight: 80 }}
            />
          </div>
        </div>
      </AdminFormModal>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Supprimer le dossier médical"
        message={`Confirmez-vous la suppression du dossier de ${getPersonName(deletingItem?.patient)} ?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
      />
    </div>
  );
};

export default AdminDossiersMedicaux;
