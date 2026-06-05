import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { rendezVousApi, dashboardApi } from "../../services/api";
import {
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import StatutBadge from "../Common/StatutBadge";

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState(null);
  const [rdvRecents, setRdvRecents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      if (hasRole(["admin", "dentiste"])) {
        const statsResponse = await dashboardApi.getStats();
        setStats(statsResponse.data?.data);
      }
      const rdvResponse = await rendezVousApi.getAll();
      setRdvRecents(rdvResponse.data?.data?.rendez_vous?.slice(0, 5) || []);
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [hasRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  const statsCards = stats
    ? [
        {
          title: "Patients",
          value: stats.nombre_patients,
          icon: UserGroupIcon,
          color: "text-sky-600 bg-sky-50",
        },
        {
          title: "Dentistes",
          value: stats.nombre_dentistes,
          icon: UserGroupIcon,
          color: "text-sky-600 bg-sky-50",
        },
        {
          title: "Services",
          value: stats.nombre_services,
          icon: ChartBarIcon,
          color: "text-sky-600 bg-sky-50",
        },
        {
          title: "Rendez-vous",
          value: stats.nombre_rendez_vous,
          icon: CalendarIcon,
          color: "text-sky-600 bg-sky-50",
        },
      ]
    : [];

  const statusSummary = stats
    ? [
        {
          label: "En attente",
          value: stats.rendez_vous_en_attente,
          className: "text-slate-700 bg-slate-50",
        },
        {
          label: "Confirmes",
          value: stats.rendez_vous_confirmes,
          className: "text-slate-700 bg-slate-50",
        },
        {
          label: "Annules",
          value: stats.rendez_vous_annules,
          className: "text-slate-700 bg-slate-50",
        },
        {
          label: "Reportes",
          value: stats.rendez_vous_reportes,
          className: "text-slate-700 bg-slate-50",
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Bienvenue, {user?.prenom} {user?.nom}
      </h1>

      {hasRole(["admin", "dentiste"]) && stats && (
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{card.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {card.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClockIcon className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Etat des rendez-vous
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statusSummary.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-lg px-4 py-3 ${item.className}`}
                >
                  <p className="text-xs uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Rendez-vous récents
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {rdvRecents.length === 0 ? (
            <div className="px-6 py-4 text-gray-500">
              Aucun rendez-vous trouvé
            </div>
          ) : (
            rdvRecents.map((rdv) => (
              <div
                key={rdv.id}
                className="px-6 py-4 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {rdv.motif || "Consultation"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(rdv.date_rdv).toLocaleDateString("fr-FR")} a{" "}
                    {rdv.heure_debut}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Service: {rdv.service?.nom || "Non defini"}
                  </p>
                  {hasRole(["admin", "dentiste"]) ? (
                    <p className="text-sm text-gray-500 mt-1">
                      Patient: {rdv.patient?.user?.prenom}{" "}
                      {rdv.patient?.user?.nom}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      Dentiste: Dr. {rdv.dentiste?.user?.prenom}{" "}
                      {rdv.dentiste?.user?.nom}
                    </p>
                  )}
                </div>
                <StatutBadge statut={rdv.statut} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
