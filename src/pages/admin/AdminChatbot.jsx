import React, { useEffect, useMemo, useState } from "react";
import axios from "../../services/axios";
import { chatbotApi } from "../../services/api";
import AdminLoading from "../../components/admin/AdminLoading";
import AdminError from "../../components/admin/AdminError";
import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminFormModal from "../../components/admin/AdminFormModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { getApiErrorMessage } from "../../components/admin/adminHelpers";

const emptyForm = { question: "", reponse: "", categorie: "" };

const quickTests = [
  "Comment prendre un rendez-vous ?",
  "Quels sont les services disponibles ?",
  "Quelles sont les disponibilités ?",
  "J’ai une urgence dentaire",
];

const AdminChatbot = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [testMessage, setTestMessage] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testOutput, setTestOutput] = useState("");

  const loadItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await chatbotApi.getIntentions();
      setItems(response.data?.intentions_chatbot || []);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Impossible de charger les intentions chatbot.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      [item.question, item.categorie].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [items, search]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      question: item.question || "",
      reponse: item.reponse || "",
      categorie: item.categorie || "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingItem) {
        await chatbotApi.updateIntention(editingItem.id, formData);
        setSuccess("Intention modifiée avec succès.");
      } else {
        await chatbotApi.createIntention(formData);
        setSuccess("Intention ajoutée avec succès.");
      }
      setFormOpen(false);
      await loadItems();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l’enregistrement."));
    }
  };

  const askDelete = (item) => {
    setDeletingItem(item);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await chatbotApi.deleteIntention(deletingItem.id);
      setSuccess("Intention supprimée avec succès.");
      setConfirmOpen(false);
      setDeletingItem(null);
      await loadItems();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de la suppression."));
    }
  };

  const runTest = async (message) => {
    const value = message.trim();
    if (!value) return;
    setTestLoading(true);
    setTestOutput("");
    try {
      const response = await axios.post("/chatbot/groq", { message: value });
      setTestOutput(response.data?.reponse || "Aucune réponse reçue.");
    } catch (err) {
      setTestOutput(getApiErrorMessage(err, "Le chatbot est indisponible."));
    } finally {
      setTestLoading(false);
    }
  };

  if (loading) return <AdminLoading text="Chargement du chatbot..." />;
  if (error && !items.length)
    return <AdminError message={error} onRetry={loadItems} />;

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-page-title">Chatbot / FAQ</h2>
          <p className="admin-page-subtitle">
            Gérez les intentions et testez la réponse Groq.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + Nouvelle intention
        </button>
      </div>

      <div
        className="admin-grid"
        style={{ gridTemplateColumns: "2fr 1fr", marginBottom: 16 }}
      >
        <div className="admin-card">
          <input
            className="admin-search"
            placeholder="Rechercher par question ou catégorie"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-test-box">
          <strong>Test rapide du chatbot</strong>
          <input
            className="admin-input"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Écrivez une question"
          />
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={testLoading}
              onClick={() => runTest(testMessage)}
            >
              {testLoading ? "Envoi..." : "Tester"}
            </button>
          </div>
          <div className="admin-actions">
            {quickTests.map((item) => (
              <button
                key={item}
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => runTest(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="admin-test-output">
            {testOutput || "La réponse du chatbot apparaîtra ici."}
          </div>
        </div>
      </div>

      {success ? (
        <div className="admin-message success" style={{ marginBottom: 16 }}>
          {success}
        </div>
      ) : null}
      {error ? (
        <div className="admin-message error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      ) : null}

      <div className="admin-table-wrapper">
        {filteredItems.length === 0 ? (
          <AdminEmptyState
            title="Aucune intention"
            message="Aucune FAQ ne correspond à la recherche."
            actionLabel="Ajouter une intention"
            onAction={openCreate}
          />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Réponse</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.question}</td>
                  <td>{item.reponse}</td>
                  <td>{item.categorie || "—"}</td>
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
        title={editingItem ? "Modifier l’intention" : "Ajouter une intention"}
        submitLabel={editingItem ? "Modifier" : "Ajouter"}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="admin-field">
          <label htmlFor="question">Question</label>
          <input
            id="question"
            className="admin-input"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="reponse">Réponse</label>
          <textarea
            id="reponse"
            className="admin-textarea"
            value={formData.reponse}
            onChange={(e) =>
              setFormData({ ...formData, reponse: e.target.value })
            }
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="categorie">Catégorie</label>
          <input
            id="categorie"
            className="admin-input"
            value={formData.categorie}
            onChange={(e) =>
              setFormData({ ...formData, categorie: e.target.value })
            }
          />
        </div>
      </AdminFormModal>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Supprimer l’intention"
        message={`Confirmez-vous la suppression de la question : ${deletingItem?.question || ""} ?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
      />
    </div>
  );
};

export default AdminChatbot;
