import React, { useCallback, useEffect, useState } from "react";
import { rendezVousApi, serviceApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import DentisteLoading from "../../components/dentiste/DentisteLoading";
import DentisteError from "../../components/dentiste/DentisteError";
import DentisteEmptyState from "../../components/dentiste/DentisteEmptyState";
import StatusBadge from "../../components/dentiste/StatusBadge";
import { getApiMessage, notifyError } from "../../utils/notifications";

const getDentisteId = (user) => user?.dentiste?.id || null;

const getPatientDisplayName = (patient) => {
  const source = patient?.user || patient;
  const prenom = source?.prenom || source?.first_name || "";
  const nom = source?.nom || source?.last_name || "";

  return `${prenom} ${nom}`.trim() || "Patient inconnu";
};

const DentisteRendezVous = () => {
  const { user } = useAuth();
  const [rendezVous, setRendezVous] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    dateRdv: "",
    statut: "",
    serviceId: "",
  });

  const dentisteId = getDentisteId(user);

  const loadData = useCallback(async () => {
    if (!dentisteId) {
      setError("Dentiste introuvable pour cet utilisateur.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const rdvResponse = await rendezVousApi.getAll({
        dentiste_id: dentisteId,
      });
      setRendezVous(rdvResponse.data?.data?.rendez_vous || []);

      const servicesResponse = await serviceApi.getAll();
      setServices(servicesResponse.data?.data?.services || []);
    } catch (err) {
      setError(
        getApiMessage(
          err.response?.data,
          "Impossible de charger les rendez-vous.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [dentisteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRendezVous = rendezVous.filter((rdv) => {
    if (filters.dateRdv && rdv.date_rdv !== filters.dateRdv) return false;
    if (filters.statut && rdv.statut !== filters.statut) return false;
    if (filters.serviceId && rdv.service_id !== parseInt(filters.serviceId))
      return false;
    return true;
  });

  if (loading) return <DentisteLoading text="Chargement des rendez-vous..." />;
  if (error) return <DentisteError message={error} onRetry={loadData} />;

  return (
    <div className="dentiste-rendez-vous animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary-900">Mes Rendez-vous</h2>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label
            htmlFor="dentiste-filter-date"
            className="text-xs font-bold text-primary-500 uppercase tracking-widest"
          >
            Date
          </label>
          <input
            id="dentiste-filter-date"
            type="date"
            className="w-full px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
            value={filters.dateRdv}
            onChange={(e) =>
              setFilters({ ...filters, dateRdv: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="dentiste-filter-statut"
            className="text-xs font-bold text-primary-500 uppercase tracking-widest"
          >
            Statut
          </label>
          <select
            id="dentiste-filter-statut"
            className="w-full px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
            value={filters.statut}
            onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
          >
            <option value="">Tous</option>
            <option value="en_attente">En attente</option>
            <option value="confirme">Confirmé</option>
            <option value="annule">Annulé</option>
            <option value="reporte">Reporté</option>
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="dentiste-filter-service"
            className="text-xs font-bold text-primary-500 uppercase tracking-widest"
          >
            Service
          </label>
          <select
            id="dentiste-filter-service"
            className="w-full px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
            value={filters.serviceId}
            onChange={(e) =>
              setFilters({ ...filters, serviceId: e.target.value })
            }
          >
            <option value="">Tous</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nom}
              </option>
            ))}
          </select>
        </div>
        <button
          className="px-6 py-2 bg-primary-100 text-primary-700 rounded-xl font-bold hover:bg-primary-200 transition-all h-[42px]"
          onClick={() => setFilters({ dateRdv: "", statut: "", serviceId: "" })}
        >
          Réinitialiser
        </button>
      </div>

      {/* Liste */}
      {filteredRendezVous.length === 0 ? (
        <DentisteEmptyState
          title="Aucun rendez-vous trouvé"
          description="Aucun rendez-vous ne correspond à vos critères."
          icon="calendar"
        />
      ) : (
        <div className="bg-white rounded-[2rem] border border-primary-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-50">
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Patient
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Service
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Heure
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Statut
                </th>
                <th className="px-6 py-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                  Motif
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50">
              {filteredRendezVous.map((rdv) => (
                <tr
                  key={rdv.id}
                  className="hover:bg-primary-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary-900">
                      {getPatientDisplayName(rdv.patient)}
                    </div>
                    {rdv.patient?.telephone && (
                      <div className="text-xs text-primary-400">
                        {rdv.patient.telephone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-primary-700 font-medium">
                    {rdv.service?.nom || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-primary-700">
                    {new Date(rdv.date_rdv).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-primary-700">
                    {rdv.heure_debut} - {rdv.heure_fin}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={rdv.statut} />
                  </td>
                  <td className="px-6 py-4 text-primary-500 italic text-sm">
                    {rdv.motif || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DentisteRendezVous;
