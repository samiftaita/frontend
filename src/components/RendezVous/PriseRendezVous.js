import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  rendezVousApi,
  serviceApi,
  disponibiliteApi,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PriseRendezVous = ({ onSuccess }) => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [disponibilites, setDisponibilites] = useState([]);
  const [formData, setFormData] = useState({
    service_id: "",
    dentiste_id: "",
    date_rdv: new Date(),
    heure_debut: "",
    motif: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
    loadDisponibilites();
  }, []);

  const loadServices = async () => {
    try {
      const response = await serviceApi.getAll();
      setServices(response.data?.data?.services || []);
    } catch (error) {
      console.error("Erreur chargement services:", error);
    }
  };

  const loadDisponibilites = async () => {
    try {
      const response = await disponibiliteApi.getAll();
      setDisponibilites(response.data?.data?.disponibilites || []);
    } catch (error) {
      console.error("Erreur chargement disponibilités:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Trouver le service sélectionné pour obtenir sa durée
      const selectedService = services.find(
        (s) => s.id === parseInt(formData.service_id),
      );
      if (!selectedService) throw new Error("Service non sélectionné");

      // Calculer l'heure de fin
      const [hours, minutes] = formData.heure_debut.split(":").map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0);
      const endDate = new Date(
        startDate.getTime() + selectedService.duree * 60000,
      );
      const heure_fin = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

      // Formater la date localement pour éviter le décalage de fuseau horaire
      const year = formData.date_rdv.getFullYear();
      const month = String(formData.date_rdv.getMonth() + 1).padStart(2, "0");
      const day = String(formData.date_rdv.getDate()).padStart(2, "0");
      const dateFormatted = `${year}-${month}-${day}`;

      await rendezVousApi.create({
        ...formData,
        patient_id: user.patient?.id || user.id, // Utiliser l'ID patient si disponible
        date_rdv: dateFormatted,
        heure_fin: heure_fin,
      });
      alert("Rendez-vous pris avec succès !");
      setFormData({
        service_id: "",
        dentiste_id: "",
        date_rdv: new Date(),
        heure_debut: "",
        motif: "",
      });
      // Appeler le callback si fourni
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const data = error.response?.data;
      let message = data?.message || "Erreur lors de la prise de rendez-vous";
      if (data?.errors) {
        const detail = Object.values(data.errors).flat().join("\n");
        message += " :\n" + detail;
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Prendre un rendez-vous
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="prise-service"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Service
            </label>
            <select
              id="prise-service"
              name="service_id"
              required
              value={formData.service_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
            >
              <option value="">Sélectionner un service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nom} - {service.prix}€ ({service.duree} min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="prise-dentiste"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Dentiste
            </label>
            <select
              id="prise-dentiste"
              name="dentiste_id"
              required
              value={formData.dentiste_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
            >
              <option value="">Sélectionner un dentiste</option>
              {disponibilites.map((disp) => (
                <option key={disp.dentiste_id} value={disp.dentiste_id}>
                  Dr. {disp.dentiste?.user?.prenom} {disp.dentiste?.user?.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="prise-date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date
            </label>
            <DatePicker
              id="prise-date"
              selected={formData.date_rdv}
              onChange={(date) => setFormData({ ...formData, date_rdv: date })}
              minDate={new Date()}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div>
            <label
              htmlFor="prise-heure"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Heure
            </label>
            <input
              id="prise-heure"
              type="time"
              name="heure_debut"
              required
              value={formData.heure_debut}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="prise-motif"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Motif
            </label>
            <textarea
              id="prise-motif"
              name="motif"
              rows="3"
              value={formData.motif}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              placeholder="Décrivez brièvement le motif de votre consultation..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Prise en cours..." : "Prendre rendez-vous"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PriseRendezVous;

PriseRendezVous.propTypes = {
  onSuccess: PropTypes.func,
};

PriseRendezVous.defaultProps = {
  onSuccess: null,
};
