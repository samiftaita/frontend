import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  rendezVousApi,
  ficheSoinApi,
  disponibiliteApi,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import DentisteLoading from "../../components/dentiste/DentisteLoading";
import DentisteError from "../../components/dentiste/DentisteError";
import DentisteEmptyState from "../../components/dentiste/DentisteEmptyState";
import StatusBadge from "../../components/dentiste/StatusBadge";

const getDentisteId = (user) => user?.dentiste?.id || null;

const getPatientDisplayName = (patient) => {
  const source = patient?.user || patient;
  const prenom = source?.prenom || source?.first_name || "";
  const nom = source?.nom || source?.last_name || "";

  return `${prenom} ${nom}`.trim() || "Patient inconnu";
};

const STAT_COLORS = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
};

const StatCard = ({ title, value, icon, color }) => {
  const c = STAT_COLORS[color] || STAT_COLORS.blue;
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-primary-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-primary-500 uppercase tracking-widest">
          {title}
        </h3>
        <div className={`p-2 rounded-lg ${c.bg} ${c.text}`}>{icon}</div>
      </div>
      <div className="text-3xl font-black text-primary-900 group-hover:text-brand-600 transition-colors">
        {value}
      </div>
    </div>
  );
};

const DentisteDashboard = () => {
  const { user } = useAuth();
  const [rendezVous, setRendezVous] = useState([]);
  const [fichesSoins, setFichesSoins] = useState([]);
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dentisteId = getDentisteId(user);

  const loadDashboard = useCallback(async () => {
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

      const fichesResponse = await ficheSoinApi.getAll();
      const fichesFiltered =
        fichesResponse.data?.data?.fiches_soins?.filter(
          (f) => f.dentiste_id === dentisteId,
        ) || [];
      setFichesSoins(fichesFiltered);

      const dispResponse = await disponibiliteApi.getAll();
      const dispFiltered =
        dispResponse.data?.data?.disponibilites?.filter(
          (d) => d.dentiste_id === dentisteId,
        ) || [];
      setDisponibilites(dispFiltered);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de charger le tableau de bord.",
      );
    } finally {
      setLoading(false);
    }
  }, [dentisteId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const totalRdv = rendezVous.length;
    const enAttente = rendezVous.filter(
      (item) => item.statut === "en_attente",
    ).length;
    const confirmes = rendezVous.filter(
      (item) => item.statut === "confirme",
    ).length;

    const now = new Date();
    const upcoming = rendezVous
      .filter((item) => item.statut !== "annule")
      .map((item) => ({
        ...item,
        _datetime: new Date(`${item.date_rdv}T${item.heure_debut}`),
      }))
      .filter(
        (item) =>
          !Number.isNaN(item._datetime.getTime()) && item._datetime >= now,
      )
      .sort((a, b) => a._datetime - b._datetime)[0];

    return {
      totalRdv,
      enAttente,
      confirmes,
      upcoming,
      totalFiches: fichesSoins.length,
      totalDisponibilites: disponibilites.length,
    };
  }, [rendezVous, fichesSoins, disponibilites]);

  if (loading)
    return <DentisteLoading text="Chargement du tableau de bord..." />;
  if (error) return <DentisteError message={error} onRetry={loadDashboard} />;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-primary-900 mb-2">
          Bonjour Dr. {user?.nom || "Dentiste"}
        </h2>
        <p className="text-primary-500 text-lg">
          Voici un aperçu de votre activité aujourd'hui.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Rendez-vous"
          value={stats.totalRdv}
          color="blue"
          icon={
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <StatCard
          title="En attente"
          value={stats.enAttente}
          color="orange"
          icon={
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Confirmés"
          value={stats.confirmes}
          color="green"
          icon={
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          }
        />
        <StatCard
          title="Fiches Soins"
          value={stats.totalFiches}
          color="purple"
          icon={
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-primary-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-primary-900">
                Rendez-vous récents
              </h3>
              <a
                href="/dentiste/rendez-vous"
                className="text-brand-600 font-bold text-sm hover:underline"
              >
                Voir tout
              </a>
            </div>

            {rendezVous.length === 0 ? (
              <DentisteEmptyState
                title="Aucun rendez-vous"
                description="Vous n'avez pas encore de rendez-vous enregistrés."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-primary-50">
                      <th className="pb-4 text-xs font-bold text-primary-400 uppercase tracking-widest">
                        Patient
                      </th>
                      <th className="pb-4 text-xs font-bold text-primary-400 uppercase tracking-widest">
                        Service
                      </th>
                      <th className="pb-4 text-xs font-bold text-primary-400 uppercase tracking-widest">
                        Heure
                      </th>
                      <th className="pb-4 text-xs font-bold text-primary-400 uppercase tracking-widest text-right">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-50">
                    {rendezVous.slice(0, 5).map((rdv) => (
                      <tr key={rdv.id} className="group">
                        <td className="py-4">
                          <div className="font-bold text-primary-900 group-hover:text-brand-600 transition-colors">
                            {getPatientDisplayName(rdv.patient)}
                          </div>
                        </td>
                        <td className="py-4 text-sm text-primary-600">
                          {rdv.service?.nom}
                        </td>
                        <td className="py-4 text-sm text-primary-600">
                          {rdv.heure_debut}
                        </td>
                        <td className="py-4 text-right">
                          <StatusBadge status={rdv.statut} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-primary-900 text-white p-8 rounded-[2rem] shadow-xl">
            <h3 className="text-xl font-bold mb-6">Prochain patient</h3>
            {!stats.upcoming ? (
              <p className="text-primary-300 text-sm italic">
                Aucun rendez-vous à venir
              </p>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center font-black text-xl">
                    {getPatientDisplayName(stats.upcoming.patient).charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      {getPatientDisplayName(stats.upcoming.patient)}
                    </p>
                    <p className="text-brand-400 text-xs font-bold uppercase tracking-widest">
                      {stats.upcoming.service?.nom}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary-400">Heure</span>
                    <span className="font-bold">
                      {stats.upcoming.heure_debut}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary-400">Date</span>
                    <span className="font-bold">
                      {new Date(stats.upcoming.date_rdv).toLocaleDateString(
                        "fr-FR",
                      )}
                    </span>
                  </div>
                </div>

                <button className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-900/50">
                  Ouvrir le dossier
                </button>
              </div>
            )}
          </div>

          <div className="bg-brand-50 p-8 rounded-[2rem] border border-brand-100">
            <h3 className="text-lg font-bold text-primary-900 mb-2">
              Disponibilités
            </h3>
            <p className="text-primary-500 text-sm mb-4">
              Vous avez {stats.totalDisponibilites} créneaux configurés.
            </p>
            <a
              href="/dentiste/disponibilites"
              className="inline-block px-6 py-2 bg-white text-brand-600 border border-brand-200 rounded-xl font-bold text-sm hover:bg-brand-100 transition-all"
            >
              Gérer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentisteDashboard;
