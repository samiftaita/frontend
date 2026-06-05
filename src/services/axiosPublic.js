/**
 * Instance axios publique — sans token d'authentification.
 * Utilisée pour les endpoints accessibles sans connexion (ex: chatbot).
 */
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosPublic;
