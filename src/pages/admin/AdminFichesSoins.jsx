import React, { useEffect, useState } from "react";
import {
  ficheSoinApi,
  dentisteApi,
  dossierMedicalApi,
} from "../../services/api";
import AdminLoading from "../../components/admin/AdminLoading";
import AdminError from "../../components/admin/AdminError";
import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminFormModal from "../../components/admin/AdminFormModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import {
  getApiErrorMessage,
  getPersonName,
  getDentisteLabel,
} from "../../components/admin/adminHelpers";

const emptyForm = {
  dossier_medical_id: "",
  dentiste_id: "",
  date_soin: "",
  description: "",
  observation: "",
  prix: "",
};

const AdminFichesSoins = () => {
  const [items, setItems] = useState([]);
  const [dentistes, setDentistes] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    Promise.all([dentisteApi.getAll(), dossierMedicalApi.getAll()])
      .then(([dRes, dosRes]) => {
        setDentistes(dRes.data?.data?.dentistes || []);
        setDossiers(dosRes.data?.data?.dossiers_medicaux || []);
      })
      .catch(() => {});
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ficheSoinApi.getAll();
      setItems(res.data?.data?.fiches_soins || []);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Impossible de charger les fiches de soins."),
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
      dossier_medical_id: item.dossier_medical_id ?? "",
      dentiste_id: item.dentiste_id ?? "",
      date_soin: item.date_soin ?? "",
      description: item.description || "",
      observation: item.observation || "",
      prix: item.prix ?? "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingItem) {
        await ficheSoinApi.update(editingItem.id, formData);
        setSuccess("Fiche de soin modifiée avec succès.");
      } else {
        await ficheSoinApi.create(formData);
        setSuccess("Fiche de soin créée avec succès.");
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
      await ficheSoinApi.delete(deletingItem.id);
      setSuccess("Fiche de soin supprimée avec succès.");
      setConfirmOpen(false);
      setDeletingItem(null);
      await loadItems();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de la suppression."));
    }
  };

  /* Label dossier : "Prénom Nom" */
  const getDossierLabel = (dossier) => {
    if (!dossier) return "—";
    const prenom = dossier.patient?.user?.prenom || "";
    const nom = dossier.patient?.user?.nom || "";
    const full = `${prenom} ${nom}`.trim();
    return full || `Dossier #${dossier.id}`;
  };

  if (loading) return <AdminLoading text="Chargement des fiches de soins..." />;
  if (error && !items.length)
    return <AdminError message={error} onRetry={loadItems} />;

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-page-title">Fiches de soins</h2>
          <p className="admin-page-subtitle">
            Suivi des soins réalisés au cabinet.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + Ajouter une fiche
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
            title="Aucune fiche de soin"
            message="Aucune fiche n'est enregistrée."
            actionLabel="Ajouter une fiche"
            onAction={openCreate}
          />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Dentiste</th>
                <th>Date soin</th>
                <th>Description</th>
                <th>Observation</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{getPersonName(item.dossier_medical?.patient)}</td>
                  <td>{getDentisteLabel(item)}</td>
                  <td>{item.date_soin}</td>
                  <td>{item.description}</td>
                  <td>{item.observation || "—"}</td>
                  <td>
                    {item.prix ? `${Number(item.prix).toFixed(2)} DH` : "—"}
                  </td>
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
            ? "Modifier la fiche de soin"
            : "Ajouter une fiche de soin"
        }
        submitLabel={editingItem ? "Modifier" : "Ajouter"}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      >
        <div
          className="admin-grid"
          style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))" }}
        >
          <div className="admin-field">
            <label htmlFor="fiche-dossier">Dossier médical (patient)</label>
            <select
              id="fiche-dossier"
              className="admin-select"
              value={formData.dossier_medical_id}
              onChange={(e) =>
                setFormData({ ...formData, dossier_medical_id: e.target.value })
              }
              required
            >
              <option value="">Sélectionner un dossier</option>
              {dossiers.map((d) => (
                <option key={d.id} value={d.id}>
                  {getDossierLabel(d)}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="fiche-dentiste">Dentiste</label>
            <select
              id="fiche-dentiste"
              className="admin-select"
              value={formData.dentiste_id}
              onChange={(e) =>
                setFormData({ ...formData, dentiste_id: e.target.value })
              }
              required
            >
              <option value="">Sélectionner un dentiste</option>
              {dentistes.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.user?.prenom} {d.user?.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className="admin-grid"
          style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))" }}
        >
          <div className="admin-field">
            <label htmlFor="fiche-date">Date du soin</label>
            <input
              id="fiche-date"
              type="date"
              className="admin-input"
              value={formData.date_soin}
              onChange={(e) =>
                setFormData({ ...formData, date_soin: e.target.value })
              }
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="fiche-prix">Prix (DH)</label>
            <input
              id="fiche-prix"
              type="number"
              min="0"
              step="0.01"
              className="admin-input"
              value={formData.prix}
              onChange={(e) =>
                setFormData({ ...formData, prix: e.target.value })
              }
            />
          </div>
        </div>
        <div
          className="admin-grid"
          style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10 }}
        >
          <div className="admin-field">
            <label htmlFor="fiche-description">Description</label>
            <textarea
              id="fiche-description"
              className="admin-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              style={{ minHeight: 70 }}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="fiche-observation">Observation</label>
            <textarea
              id="fiche-observation"
              className="admin-textarea"
              value={formData.observation}
              onChange={(e) =>
                setFormData({ ...formData, observation: e.target.value })
              }
              style={{ minHeight: 70 }}
            />
          </div>
        </div>
      </AdminFormModal>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Supprimer la fiche de soin"
        message={`Confirmez-vous la suppression de la fiche de ${getPersonName(deletingItem?.dossier_medical?.patient)} ?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
      />
    </div>
  );
};

export default AdminFichesSoins;
