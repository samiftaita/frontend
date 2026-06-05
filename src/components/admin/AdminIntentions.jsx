import React, { useState, useEffect } from "react";
import { chatbotApi } from "../../services/api";
import ConfirmationModal from "../Common/ConfirmationModal";
import AdminLoading from "./AdminLoading";
import AdminError from "./AdminError";

const AdminIntentions = () => {
  const [intentions, setIntentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIntention, setSelectedIntention] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    reponse: "",
    categorie: "",
  });

  useEffect(() => {
    loadIntentions();
  }, []);

  const loadIntentions = async () => {
    try {
      const response = await chatbotApi.getIntentions();
      setIntentions(response.data.intentions_chatbot || []);
    } catch (error) {
      console.error("Erreur chargement intentions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedIntention) {
        await chatbotApi.updateIntention(selectedIntention.id, formData);
      } else {
        await chatbotApi.createIntention(formData);
      }
      await loadIntentions();
      setFormOpen(false);
      setFormData({ question: "", reponse: "", categorie: "" });
      setSelectedIntention(null);
      alert("Intention sauvegardée avec succès");
    } catch (error) {
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async () => {
    try {
      await chatbotApi.deleteIntention(selectedIntention.id);
      await loadIntentions();
      setModalOpen(false);
      alert("Intention supprimée avec succès");
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleEdit = (intention) => {
    setSelectedIntention(intention);
    setFormData({
      question: intention.question,
      reponse: intention.reponse,
      categorie: intention.categorie,
    });
    setFormOpen(true);
  };

  if (loading) return <AdminLoading text="Chargement des intentions..." />;

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-page-title">
            Gestion des intentions du chatbot
          </h2>
          <p className="admin-page-subtitle">
            Configurez les réponses du chatbot.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedIntention(null);
            setFormData({ question: "", reponse: "", categorie: "" });
            setFormOpen(true);
          }}
          className="btn btn-primary"
        >
          + Nouvelle intention
        </button>
      </div>

      <div className="admin-card">
        <div className="overflow-x-auto">
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
              {intentions.map((intention) => (
                <tr key={intention.id}>
                  <td>{intention.question}</td>
                  <td>{intention.reponse}</td>
                  <td>{intention.categorie}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(intention)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setSelectedIntention(intention);
                          setModalOpen(true);
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setFormOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setFormOpen(false)}
            ></div>
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedIntention
                  ? "Modifier l'intention"
                  : "Ajouter une intention"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="intention-question"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Question
                    </label>
                    <input
                      id="intention-question"
                      type="text"
                      required
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="intention-reponse"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Réponse
                    </label>
                    <textarea
                      id="intention-reponse"
                      required
                      rows="3"
                      value={formData.reponse}
                      onChange={(e) =>
                        setFormData({ ...formData, reponse: e.target.value })
                      }
                      className="admin-textarea"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="intention-categorie"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Catégorie
                    </label>
                    <input
                      id="intention-categorie"
                      type="text"
                      value={formData.categorie}
                      onChange={(e) =>
                        setFormData({ ...formData, categorie: e.target.value })
                      }
                      className="admin-input"
                      placeholder="ex: horaires, services, urgence"
                    />
                  </div>
                </div>
                <div className="admin-modal-actions" style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="btn"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer l'intention"
        message="Êtes-vous sûr de vouloir supprimer cette intention ?"
      />
    </div>
  );
};

export default AdminIntentions;
