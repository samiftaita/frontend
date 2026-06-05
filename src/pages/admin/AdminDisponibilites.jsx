import React, { useEffect, useMemo, useState } from "react";
import { disponibiliteApi, dentisteApi } from "../../services/api";
import AdminLoading from "../../components/admin/AdminLoading";
import AdminError from "../../components/admin/AdminError";
import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminFormModal from "../../components/admin/AdminFormModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import {
  getApiErrorMessage,
  getDentisteLabel,
} from "../../components/admin/adminHelpers";

const JOURS = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

const emptyForm = {
  dentiste_id: "",
  jour_semaine: "lundi",
  heure_debut: "",
  heure_fin: "",
  est_disponible: true,
};

const AdminDisponibilites = () => {
  const [items, setItems] = useState([]);
  const [dentistes, setDentistes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [filters, setFilters] = useState({
    day: "",
    dentiste_id: "",
    availableOnly: false,
  });
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    dentisteApi
      .getAll()
      .then((res) => setDentistes(res.data?.data?.dentistes || []))
      .catch(() => {});
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await disponibiliteApi.getAll();
      setItems(res.data?.data?.disponibilites || []);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Impossible de charger les disponibilités."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (filters.day && item.jour_semaine !== filters.day) return false;
        if (
          filters.dentiste_id &&
          String(item.dentiste_id) !== filters.dentiste_id
        )
          return false;
        if (filters.availableOnly && !item.est_disponible) return false;
        return true;
      }),
    [filters, items],
  );

  const openCreate = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      dentiste_id: item.dentiste_id ?? "",
      jour_semaine: item.jour_semaine || "lundi",
      heure_debut: item.heure_debut ? String(item.heure_debut).slice(0, 5) : "",
      heure_fin: item.heure_fin ? String(item.heure_fin).slice(0, 5) : "",
      est_disponible: Boolean(item.est_disponible),
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = {
        ...formData,
        est_disponible: Boolean(formData.est_disponible),
      };
      if (editingItem) {
        await disponibiliteApi.update(editingItem.id, payload);
        setSuccess("Disponibilité modifiée avec succès.");
      } else {
        await disponibiliteApi.create(payload);
        setSuccess("Disponibilité ajoutée avec succès.");
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
      await disponibiliteApi.delete(deletingItem.id);
      setSuccess("Disponibilité supprimée avec succès.");
      setConfirmOpen(false);
      setDeletingItem(null);
      await loadItems();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de la suppression."));
    }
  };

  if (loading) return <AdminLoading text="Chargement des disponibilités..." />;
  if (error && !items.length)
    return <AdminError message={error} onRetry={loadItems} />;

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-page-title">Disponibilités</h2>
          <p className="admin-page-subtitle">
            Gérez les créneaux des dentistes.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + Ajouter une disponibilité
        </button>
      </div>

      {/* Filtres */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-search-row">
          <select
            className="admin-select"
            value={filters.day}
            onChange={(e) => setFilters({ ...filters, day: e.target.value })}
          >
            <option value="">Tous les jours</option>
            {JOURS.map((j) => (
              <option key={j} value={j}>
                {j.charAt(0).toUpperCase() + j.slice(1)}
              </option>
            ))}
          </select>

          <select
            className="admin-select"
            value={filters.dentiste_id}
            onChange={(e) =>
              setFilters({ ...filters, dentiste_id: e.target.value })
            }
          >
            <option value="">Tous les dentistes</option>
            {dentistes.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.user?.prenom} {d.user?.nom}
              </option>
            ))}
          </select>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) =>
                setFilters({ ...filters, availableOnly: e.target.checked })
              }
            />
            Seulement disponible
          </label>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() =>
              setFilters({ day: "", dentiste_id: "", availableOnly: false })
            }
          >
            Réinitialiser
          </button>
        </div>
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
        {filteredItems.length === 0 ? (
          <AdminEmptyState
            title="Aucune disponibilité"
            message="Aucun créneau ne correspond aux filtres."
            actionLabel="Ajouter une disponibilité"
            onAction={openCreate}
          />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Dentiste</th>
                <th>Spécialité</th>
                <th>Jour</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Disponible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{getDentisteLabel(item)}</td>
                  <td>{item.dentiste?.specialite || "—"}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {item.jour_semaine}
                  </td>
                  <td>{item.heure_debut}</td>
                  <td>{item.heure_fin}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        background: item.est_disponible ? "#ecfdf5" : "#fef2f2",
                        color: item.est_disponible ? "#065f46" : "#7f1d1d",
                        border: `1px solid ${item.est_disponible ? "#a7f3d0" : "#fecaca"}`,
                      }}
                    >
                      {item.est_disponible ? "Disponible" : "Indisponible"}
                    </span>
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
            ? "Modifier la disponibilité"
            : "Ajouter une disponibilité"
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
            <label htmlFor="dispo-dentiste">Dentiste</label>
            <select
              id="dispo-dentiste"
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
          <div className="admin-field">
            <label htmlFor="dispo-jour">Jour</label>
            <select
              id="dispo-jour"
              className="admin-select"
              value={formData.jour_semaine}
              onChange={(e) =>
                setFormData({ ...formData, jour_semaine: e.target.value })
              }
            >
              {JOURS.map((j) => (
                <option key={j} value={j}>
                  {j.charAt(0).toUpperCase() + j.slice(1)}
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
            <label htmlFor="dispo-debut">Heure de début</label>
            <input
              id="dispo-debut"
              type="time"
              className="admin-input"
              value={formData.heure_debut}
              onChange={(e) =>
                setFormData({ ...formData, heure_debut: e.target.value })
              }
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="dispo-fin">Heure de fin</label>
            <input
              id="dispo-fin"
              type="time"
              className="admin-input"
              value={formData.heure_fin}
              onChange={(e) =>
                setFormData({ ...formData, heure_fin: e.target.value })
              }
              required
            />
          </div>
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.est_disponible}
            onChange={(e) =>
              setFormData({ ...formData, est_disponible: e.target.checked })
            }
          />
          Créneau disponible
        </label>
      </AdminFormModal>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Supprimer la disponibilité"
        message={`Supprimer la disponibilité de ${getDentisteLabel(deletingItem)} ?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
      />
    </div>
  );
};

export default AdminDisponibilites;
