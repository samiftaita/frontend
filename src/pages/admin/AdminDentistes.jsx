import React, { useEffect, useMemo, useState } from "react";
import { dentisteApi } from "../../services/api";
import AdminLoading from "../../components/admin/AdminLoading";
import AdminError from "../../components/admin/AdminError";
import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminFormModal from "../../components/admin/AdminFormModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import {
  getApiErrorMessage,
  safeText,
} from "../../components/admin/adminHelpers";
import useAutoRefresh from "../../hooks/useAutoRefresh";

const emptyForm = {
  prenom: "",
  nom: "",
  email: "",
  password: "",
  specialite: "",
  telephone: "",
};

const AdminDentistes = () => {
  const [dentistes, setDentistes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadDentistes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await dentisteApi.getAll();
      setDentistes(response.data?.data?.dentistes || []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossible de charger les dentistes."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDentistes();
  }, []);
  useAutoRefresh(loadDentistes, 30000);

  const filteredDentistes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return dentistes;
    return dentistes.filter((d) => {
      const fullName = `${d.user?.prenom} ${d.user?.nom}`.toLowerCase();
      return (
        fullName.includes(query) ||
        d.user?.email.toLowerCase().includes(query) ||
        safeText(d.specialite).toLowerCase().includes(query)
      );
    });
  }, [search, dentistes]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (dentiste) => {
    setEditingItem(dentiste);
    setFormData({
      prenom: dentiste.user?.prenom || "",
      nom: dentiste.user?.nom || "",
      email: dentiste.user?.email || "",
      password: "", // On ne remplit pas le mot de passe pour l'édition par sécurité
      specialite: dentiste.specialite || "",
      telephone: dentiste.telephone || "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingItem) {
        await dentisteApi.update(editingItem.id, formData);
        setSuccess("Dentiste modifié avec succès.");
      } else {
        if (!formData.password) {
          setError("Le mot de passe est obligatoire pour un nouveau dentiste.");
          return;
        }
        await dentisteApi.create(formData);
        setSuccess("Dentiste ajouté avec succès.");
      }

      setFormOpen(false);
      await loadDentistes();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l’enregistrement."));
    }
  };

  const askDelete = (dentiste) => {
    setDeletingItem(dentiste);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await dentisteApi.delete(deletingItem.id);
      setDentistes((prev) => prev.filter((d) => d.id !== deletingItem.id));
      setSuccess("Dentiste supprimé avec succès.");
      setConfirmOpen(false);
      setDeletingItem(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de la suppression."));
    }
  };

  if (loading) return <AdminLoading text="Chargement des dentistes..." />;
  if (error && !dentistes.length)
    return <AdminError message={error} onRetry={loadDentistes} />;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-primary-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-primary-900">Dentistes</h2>
          <p className="text-primary-500 mt-1">
            Gérez l'équipe médicale du cabinet
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
          Nouveau Dentiste
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
            placeholder="Rechercher par nom, email ou spécialité..."
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
        {filteredDentistes.length === 0 ? (
          <AdminEmptyState
            title="Aucun dentiste"
            message={
              search
                ? "Aucun dentiste ne correspond à votre recherche."
                : "Aucun dentiste enregistré."
            }
            actionLabel="Ajouter un dentiste"
            onAction={openCreate}
          />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-50 border-b border-primary-100">
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Dentiste
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Spécialité
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Contact
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50">
              {filteredDentistes.map((dentiste) => (
                <tr
                  key={dentiste.id}
                  className="hover:bg-primary-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold">
                        {dentiste.user?.prenom?.charAt(0)}
                        {dentiste.user?.nom?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-primary-900 group-hover:text-brand-600 transition-colors">
                          Dr. {dentiste.user?.prenom} {dentiste.user?.nom}
                        </div>
                        <div className="text-xs text-primary-400">
                          {dentiste.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-lg font-medium text-sm">
                      {dentiste.specialite || "Généraliste"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-primary-600">
                      {dentiste.telephone || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="p-2 text-primary-400 hover:text-brand-600 transition-colors"
                        onClick={() => openEdit(dentiste)}
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
                        onClick={() => askDelete(dentiste)}
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
        title={editingItem ? "Modifier le dentiste" : "Ajouter un dentiste"}
        submitLabel={editingItem ? "Mettre à jour" : "Ajouter le dentiste"}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4 p-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="dentiste-prenom"
                className="text-[10px] font-bold text-primary-500 uppercase tracking-widest"
              >
                Prénom *
              </label>
              <input
                id="dentiste-prenom"
                className="w-full px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="dentiste-nom"
                className="text-[10px] font-bold text-primary-500 uppercase tracking-widest"
              >
                Nom *
              </label>
              <input
                id="dentiste-nom"
                className="w-full px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="dentiste-email"
              className="text-[10px] font-bold text-primary-500 uppercase tracking-widest"
            >
              Email *
            </label>
            <input
              id="dentiste-email"
              type="email"
              className="w-full px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="dentiste-password"
              className="text-[10px] font-bold text-primary-500 uppercase tracking-widest"
            >
              Mot de passe{" "}
              {editingItem ? "(laisser vide pour ne pas changer)" : "*"}
            </label>
            <input
              id="dentiste-password"
              type="password"
              className="w-full px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!editingItem}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="dentiste-specialite"
              className="text-[10px] font-bold text-primary-500 uppercase tracking-widest"
            >
              Spécialité
            </label>
            <input
              id="dentiste-specialite"
              className="w-full px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
              value={formData.specialite}
              onChange={(e) =>
                setFormData({ ...formData, specialite: e.target.value })
              }
              placeholder="Ex: Orthodontie"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="dentiste-telephone"
              className="text-[10px] font-bold text-primary-500 uppercase tracking-widest"
            >
              Téléphone
            </label>
            <input
              id="dentiste-telephone"
              className="w-full px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
              value={formData.telephone}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
            />
          </div>
        </div>
      </AdminFormModal>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Supprimer le dentiste"
        message={`Confirmez-vous la suppression du Dr. ${deletingItem?.user?.nom} ? Cela supprimera également son compte utilisateur.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Supprimer définitivement"
      />
    </div>
  );
};

export default AdminDentistes;
