import React, { useEffect, useMemo, useState } from "react";
import { serviceApi } from "../../services/api";
import AdminLoading from "../../components/admin/AdminLoading";
import AdminError from "../../components/admin/AdminError";
import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminFormModal from "../../components/admin/AdminFormModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import {
  getApiErrorMessage,
  safeText,
} from "../../components/admin/adminHelpers";

const emptyForm = { nom: "", description: "", prix: "", duree: "" };

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadServices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await serviceApi.getAll();
      setServices(response.data?.data?.services || []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossible de charger les services."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return services;
    return services.filter((service) => {
      return [service.nom, service.description].some((value) =>
        safeText(value, "").toLowerCase().includes(query),
      );
    });
  }, [search, services]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (service) => {
    setEditingItem(service);
    setFormData({
      nom: service.nom || "",
      description: service.description || "",
      prix: service.prix ?? "",
      duree: service.duree ?? "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        nom: formData.nom,
        description: formData.description,
        prix: formData.prix,
        duree: formData.duree,
      };

      if (editingItem) {
        await serviceApi.update(editingItem.id, payload);
        setSuccess("Service modifié avec succès.");
      } else {
        await serviceApi.create(payload);
        setSuccess("Service ajouté avec succès.");
      }

      setFormOpen(false);
      await loadServices();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l’enregistrement."));
    }
  };

  const askDelete = (service) => {
    setDeletingItem(service);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await serviceApi.delete(deletingItem.id);
      setServices((prev) => prev.filter((s) => s.id !== deletingItem.id));
      setSuccess("Service supprimé avec succès.");
      setConfirmOpen(false);
      setDeletingItem(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de la suppression."));
    }
  };

  if (loading) return <AdminLoading text="Chargement des services..." />;
  if (error && !services.length)
    return <AdminError message={error} onRetry={loadServices} />;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-primary-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-primary-900">Services</h2>
          <p className="text-primary-500 mt-1">
            Gérez le catalogue des prestations du cabinet
          </p>
        </div>
        <button
          type="button"
          className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 flex items-center gap-2"
          onClick={openCreate}
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
          Nouveau Service
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            placeholder="Rechercher par nom ou description..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 font-medium animate-slide-up">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium animate-slide-up">
          {error}
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-primary-100 shadow-sm overflow-hidden">
        {filteredServices.length === 0 ? (
          <AdminEmptyState
            title="Aucun service"
            message={
              search
                ? "Aucun service ne correspond à votre recherche."
                : "Aucun service enregistré."
            }
            actionLabel="Ajouter un service"
            onAction={openCreate}
          />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-50 border-b border-primary-100">
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Nom
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Description
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Prix
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Durée
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50">
              {filteredServices.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-primary-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 text-primary-400 font-mono text-xs">
                    {service.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary-900 group-hover:text-brand-600 transition-colors">
                      {service.nom}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-primary-500 line-clamp-1 max-w-xs">
                      {service.description || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg font-bold text-sm">
                      {Number(service.prix).toFixed(2)} DH
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-primary-600">
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
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        {service.duree} min
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="p-2 text-primary-400 hover:text-brand-600 transition-colors"
                        onClick={() => openEdit(service)}
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-2 text-primary-400 hover:text-red-500 transition-colors"
                        onClick={() => askDelete(service)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminFormModal
        isOpen={formOpen}
        title={editingItem ? "Modifier le service" : "Ajouter un service"}
        submitLabel={editingItem ? "Mettre à jour" : "Ajouter le service"}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6 p-2">
          <div className="space-y-2">
            <label
              htmlFor="service-nom"
              className="text-xs font-bold text-primary-500 uppercase tracking-widest"
            >
              Nom du service *
            </label>
            <input
              id="service-nom"
              className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.nom}
              onChange={(event) =>
                setFormData({ ...formData, nom: event.target.value })
              }
              placeholder="Ex: Détartrage complet"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="service-description"
              className="text-xs font-bold text-primary-500 uppercase tracking-widest"
            >
              Description
            </label>
            <textarea
              id="service-description"
              className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
              placeholder="Décrivez les détails de la prestation..."
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="service-prix"
                className="text-xs font-bold text-primary-500 uppercase tracking-widest"
              >
                Prix (DH) *
              </label>
              <input
                id="service-prix"
                type="number"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.prix}
                onChange={(event) =>
                  setFormData({ ...formData, prix: event.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="service-duree"
                className="text-xs font-bold text-primary-500 uppercase tracking-widest"
              >
                Durée (min) *
              </label>
              <input
                id="service-duree"
                type="number"
                min="1"
                className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.duree}
                onChange={(event) =>
                  setFormData({ ...formData, duree: event.target.value })
                }
                required
              />
            </div>
          </div>
        </div>
      </AdminFormModal>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Supprimer le service"
        message={`Confirmez-vous la suppression du service ${deletingItem?.nom || ""} ? Cette action est irréversible.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Supprimer définitivement"
      />
    </div>
  );
};

export default AdminServices;
