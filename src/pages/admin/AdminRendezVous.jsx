import React, { useCallback, useEffect, useMemo, useState } from "react";
import { rendezVousApi, dentisteApi, serviceApi } from "../../services/api";
import AdminLoading from "../../components/admin/AdminLoading";
import AdminError from "../../components/admin/AdminError";
import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminFormModal from "../../components/admin/AdminFormModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import StatusBadge from "../../components/admin/StatusBadge";
import {
  getApiErrorMessage,
  getPersonName,
  getDentisteLabel,
} from "../../components/admin/adminHelpers";
import useAutoRefresh from "../../hooks/useAutoRefresh";

const emptyForm = {
  patient_id: "",
  dentiste_id: "",
  service_id: "",
  date_rdv: "",
  heure_debut: "",
  heure_fin: "",
  statut: "en_attente",
  motif: "",
};

const AdminRendezVous = () => {
  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dentistes, setDentistes] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    patient_id: "",
    dentiste_id: "",
    date_rdv: "",
    statut: "",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  /* Charger les listes de référence */
  useEffect(() => {
    Promise.all([
      rendezVousApi.getAll(), // pour extraire les patients uniques
      dentisteApi.getAll(),
      serviceApi.getAll(),
    ])
      .then(([rdvRes, dRes, sRes]) => {
        // Extraire les patients uniques depuis les rendez-vous
        const rdvList = rdvRes.data?.data?.rendez_vous || [];
        const patientMap = new Map();
        rdvList.forEach((r) => {
          if (r.patient && r.patient_id && !patientMap.has(r.patient_id)) {
            patientMap.set(r.patient_id, {
              id: r.patient_id,
              user: r.patient?.user,
            });
          }
        });
        setPatients([...patientMap.values()]);
        setDentistes(dRes.data?.data?.dentistes || []);
        setServices(sRes.data?.data?.services || []);
      })
      .catch(() => {});
  }, []);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== "") params[k] = v;
      });
      const res = await rendezVousApi.getAll(params);
      setItems(res.data?.data?.rendez_vous || []);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Impossible de charger les rendez-vous."),
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);
  useAutoRefresh(loadItems, 30000);

  const openCreate = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      patient_id: item.patient_id ?? "",
      dentiste_id: item.dentiste_id ?? "",
      service_id: item.service_id ?? "",
      date_rdv: item.date_rdv ?? "",
      heure_debut: item.heure_debut ? String(item.heure_debut).slice(0, 5) : "",
      heure_fin: item.heure_fin ? String(item.heure_fin).slice(0, 5) : "",
      statut: item.statut || "en_attente",
      motif: item.motif || "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingItem) {
        await rendezVousApi.update(editingItem.id, formData);
        setSuccess("Rendez-vous modifié avec succès.");
      } else {
        await rendezVousApi.create(formData);
        setSuccess("Rendez-vous créé avec succès.");
      }
      setFormOpen(false);
      await loadItems();
    } catch (err) {
      setError(
        err.response?.status === 409
          ? err.response?.data?.message || "Conflit de créneau."
          : getApiErrorMessage(err, "Erreur lors de l'enregistrement."),
      );
    }
  };

  const askDelete = (item) => {
    setDeletingItem(item);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await rendezVousApi.delete(deletingItem.id);
      setItems((p) => p.filter((i) => i.id !== deletingItem.id));
      setSuccess("Rendez-vous supprimé avec succès.");
      setConfirmOpen(false);
      setDeletingItem(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de la suppression."));
    }
  };

  if (loading) return <AdminLoading text="Chargement des rendez-vous..." />;
  if (error && !items.length)
    return <AdminError message={error} onRetry={loadItems} />;

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-page-title">Rendez-vous</h2>
          <p className="admin-page-subtitle">
            Consulter, ajouter et modifier les rendez-vous du cabinet.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + Ajouter un rendez-vous
        </button>
      </div>

      {/* Filtres */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-search-row">
          {/* Filtre patient par nom */}
          <select
            className="admin-select"
            value={filters.patient_id}
            onChange={(e) =>
              setFilters({ ...filters, patient_id: e.target.value })
            }
          >
            <option value="">Tous les patients</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.user?.prenom} {p.user?.nom}
              </option>
            ))}
          </select>

          {/* Filtre dentiste par nom */}
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

          <input
            className="admin-search"
            type="date"
            value={filters.date_rdv}
            onChange={(e) =>
              setFilters({ ...filters, date_rdv: e.target.value })
            }
          />

          <select
            className="admin-select"
            value={filters.statut}
            onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="confirme">Confirmé</option>
            <option value="annule">Annulé</option>
            <option value="reporte">Reporté</option>
          </select>
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
        {items.length === 0 ? (
          <AdminEmptyState
            title="Aucun rendez-vous"
            message="Aucun rendez-vous ne correspond aux critères."
            actionLabel="Ajouter un rendez-vous"
            onAction={openCreate}
          />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Dentiste</th>
                <th>Service</th>
                <th>Date</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Motif</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{getPersonName(item.patient)}</td>
                  <td>{getDentisteLabel(item)}</td>
                  <td>{item.service?.nom || "—"}</td>
                  <td>{item.date_rdv}</td>
                  <td>{item.heure_debut}</td>
                  <td>{item.heure_fin}</td>
                  <td>
                    <StatusBadge status={item.statut} />
                  </td>
                  <td>{item.motif || "—"}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => openEdit(item)}
                      >
                        Modifier
                      </button>
                      {(item.statut === "en_attente" ||
                        item.statut === "annule") && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => askDelete(item)}
                        >
                          Supprimer
                        </button>
                      )}
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
          editingItem ? "Modifier le rendez-vous" : "Ajouter un rendez-vous"
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
            <label htmlFor="rdv-patient">Patient</label>
            <select
              id="rdv-patient"
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
          <div className="admin-field">
            <label htmlFor="rdv-dentiste">Dentiste</label>
            <select
              id="rdv-dentiste"
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
            <label htmlFor="rdv-service">Service</label>
            <select
              id="rdv-service"
              className="admin-select"
              value={formData.service_id}
              onChange={(e) =>
                setFormData({ ...formData, service_id: e.target.value })
              }
              required
            >
              <option value="">Sélectionner un service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="rdv-date">Date du rendez-vous</label>
            <input
              id="rdv-date"
              type="date"
              className="admin-input"
              value={formData.date_rdv}
              onChange={(e) =>
                setFormData({ ...formData, date_rdv: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div
          className="admin-grid"
          style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))" }}
        >
          <div className="admin-field">
            <label htmlFor="rdv-debut">Heure de début</label>
            <input
              id="rdv-debut"
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
            <label htmlFor="rdv-fin">Heure de fin</label>
            <input
              id="rdv-fin"
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
        {editingItem && (
          <div className="admin-field">
            <label htmlFor="rdv-statut">Statut</label>
            <select
              id="rdv-statut"
              className="admin-select"
              value={formData.statut}
              onChange={(e) =>
                setFormData({ ...formData, statut: e.target.value })
              }
            >
              <option value="en_attente">En attente</option>
              <option value="confirme">Confirmé</option>
              <option value="annule">Annulé</option>
              <option value="reporte">Reporté</option>
            </select>
          </div>
        )}
        <div className="admin-field">
          <label htmlFor="rdv-motif">Motif</label>
          <textarea
            id="rdv-motif"
            className="admin-textarea"
            value={formData.motif}
            onChange={(e) =>
              setFormData({ ...formData, motif: e.target.value })
            }
            style={{ minHeight: 60 }}
          />
        </div>
      </AdminFormModal>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Supprimer le rendez-vous"
        message={`Confirmez-vous la suppression du rendez-vous de ${getPersonName(deletingItem?.patient)} ?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
      />
    </div>
  );
};

export default AdminRendezVous;
