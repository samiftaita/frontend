import axios from "./axios";
import axiosPublic from "./axiosPublic";

const withSuppressedToast = (config = {}) => ({
  ...config,
  suppressToast: config.suppressToast ?? true,
});

const withShowToast = (config = {}) => ({
  ...config,
  showToast: config.showToast ?? true,
});

// Services API
export const serviceApi = {
  getAll: (config = {}) => axios.get("/services", withSuppressedToast(config)),
  getOne: (id, config = {}) =>
    axios.get(`/services/${id}`, withSuppressedToast(config)),
  create: (data, config = {}) =>
    axios.post("/services", data, withShowToast(config)),
  update: (id, data, config = {}) =>
    axios.put(`/services/${id}`, data, withShowToast(config)),
  delete: (id, config = {}) =>
    axios.delete(`/services/${id}`, withShowToast(config)),
};

// Dentistes API
export const dentisteApi = {
  getAll: (config = {}) => axios.get("/dentistes", withSuppressedToast(config)),
  getOne: (id, config = {}) =>
    axios.get(`/dentistes/${id}`, withSuppressedToast(config)),
  create: (data, config = {}) =>
    axios.post("/dentistes", data, withShowToast(config)),
  update: (id, data, config = {}) =>
    axios.put(`/dentistes/${id}`, data, withShowToast(config)),
  delete: (id, config = {}) =>
    axios.delete(`/dentistes/${id}`, withShowToast(config)),
};

// Rendez-vous API
export const rendezVousApi = {
  getAll: (params = {}, config = {}) =>
    axios.get("/rendez-vous", { ...withSuppressedToast(config), params }),
  getOne: (id, config = {}) =>
    axios.get(`/rendez-vous/${id}`, withSuppressedToast(config)),
  create: (data, config = {}) =>
    axios.post("/rendez-vous", data, withShowToast(config)),
  update: (id, data, config = {}) =>
    axios.put(`/rendez-vous/${id}`, data, withShowToast(config)),
  delete: (id, config = {}) =>
    axios.delete(`/rendez-vous/${id}`, withShowToast(config)),
  /** Créneaux occupés d'une date (dentiste_id + heures seulement, sans données personnelles) */
  getOccupancy: (date_rdv, config = {}) =>
    axios.get("/rendez-vous/occupancy", { ...withSuppressedToast(config), params: { date_rdv } }),
};

// Disponibilités API
export const disponibiliteApi = {
  getAll: (config = {}) =>
    axios.get("/disponibilites", withSuppressedToast(config)),
  getOne: (id, config = {}) =>
    axios.get(`/disponibilites/${id}`, withSuppressedToast(config)),
  create: (data, config = {}) =>
    axios.post("/disponibilites", data, withShowToast(config)),
  update: (id, data, config = {}) =>
    axios.put(`/disponibilites/${id}`, data, withShowToast(config)),
  delete: (id, config = {}) =>
    axios.delete(`/disponibilites/${id}`, withShowToast(config)),
};

// Dossiers médicaux API
export const dossierMedicalApi = {
  getAll: (config = {}) =>
    axios.get("/dossiers-medicaux", withSuppressedToast(config)),
  getOne: (id, config = {}) =>
    axios.get(`/dossiers-medicaux/${id}`, withSuppressedToast(config)),
  create: (data, config = {}) =>
    axios.post("/dossiers-medicaux", data, withShowToast(config)),
  update: (id, data, config = {}) =>
    axios.put(`/dossiers-medicaux/${id}`, data, withShowToast(config)),
  delete: (id, config = {}) =>
    axios.delete(`/dossiers-medicaux/${id}`, withShowToast(config)),
};

// Fiches de soin API
export const ficheSoinApi = {
  getAll: (config = {}) =>
    axios.get("/fiches-soins", withSuppressedToast(config)),
  getOne: (id, config = {}) =>
    axios.get(`/fiches-soins/${id}`, withSuppressedToast(config)),
  create: (data, config = {}) =>
    axios.post("/fiches-soins", data, withShowToast(config)),
  update: (id, data, config = {}) =>
    axios.put(`/fiches-soins/${id}`, data, withShowToast(config)),
  delete: (id, config = {}) =>
    axios.delete(`/fiches-soins/${id}`, withShowToast(config)),
};

// Chatbot API — axiosPublic pour accès sans authentification
export const chatbotApi = {
  sendMessage: (message, config = {}) =>
    axiosPublic.post("/chatbot/groq", { message }, config),
  getIntentions: (config = {}) =>
    axios.get("/intentions-chatbot", withSuppressedToast(config)),
  getIntention: (id, config = {}) =>
    axios.get(`/intentions-chatbot/${id}`, withSuppressedToast(config)),
  createIntention: (data, config = {}) =>
    axios.post("/intentions-chatbot", data, withShowToast(config)),
  updateIntention: (id, data, config = {}) =>
    axios.put(`/intentions-chatbot/${id}`, data, withShowToast(config)),
  deleteIntention: (id, config = {}) =>
    axios.delete(`/intentions-chatbot/${id}`, withShowToast(config)),
};

// Dashboard API (admin seulement)
export const dashboardApi = {
  getStats: (config = {}) =>
    axios.get("/dashboard/statistiques", withSuppressedToast(config)),
};
