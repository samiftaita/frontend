import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  disponibiliteApi,
  rendezVousApi,
  serviceApi,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import PatientLoading from "../../components/patient/PatientLoading";
import PatientError from "../../components/patient/PatientError";
import StatusBadge from "../../components/patient/StatusBadge";

const WEEK_DAYS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];
const getPatientId = (user) => user?.patient?.id || null;
const fmt = (t) => (t ? t.substring(0, 5) : "");

/** "2026-06-09" → "lundi" */
const getDayName = (d) => {
  if (!d) return "";
  const dt = new Date(`${d}T12:00:00`);
  return isNaN(dt) ? "" : WEEK_DAYS[dt.getDay()];
};

/** Renvoie la date min pour l'input date (aujourd'hui) */
const todayStr = () => new Date().toISOString().split("T")[0];

/**
 * Ajoute `minutes` à une heure "HH:MM" et retourne "HH:MM".
 * Gère le dépassement à minuit (23:50 + 30 = 00:20).
 */
const addMinutes = (timeStr, minutes) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const total  = h * 60 + m + minutes;
  const hh     = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm     = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

/**
 * Calcule la prochaine heure de début libre pour un dentiste ce jour-là.
 * On prend la fin du dernier RDV non annulé de ce dentiste sur ce créneau,
 * ou l'heure de début du créneau s'il n'y a aucun RDV.
 *
 * @param {object} slot          - La disponibilité (avec heure_debut, heure_fin, dentiste_id)
 * @param {Array}  allRdv        - Tous les RDV du jour (allRendezVous)
 * @returns {string}             - "HH:MM"
 */
const getNextAvailableStart = (slot, allRdv) => {
  const slotStart = fmt(slot.heure_debut);
  const slotEnd   = fmt(slot.heure_fin);

  // RDV non annulés pour ce dentiste qui chevauchent ce créneau
  const rdvForSlot = allRdv
    .filter(
      (rdv) =>
        rdv.dentiste_id === slot.dentiste_id &&
        rdv.statut !== "annule" &&
        fmt(rdv.heure_debut) >= slotStart &&
        fmt(rdv.heure_fin)   <= slotEnd,
    )
    .sort((a, b) => fmt(a.heure_fin).localeCompare(fmt(b.heure_fin)));

  if (rdvForSlot.length === 0) return slotStart;

  // La prochaine heure dispo = fin du dernier RDV
  const nextStart = fmt(rdvForSlot[rdvForSlot.length - 1].heure_fin);

  // Si dépassement de la fin du créneau → plus de place
  return nextStart >= slotEnd ? null : nextStart;
};
const Field = ({ label, children, full }) => (
  <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
    <label
      style={{
        display: "block",
        marginBottom: 5,
        fontSize: "0.78rem",
        fontWeight: 600,
        color: "#374151",
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

/* ── Badge "créneau libre / pris" ── */
const SlotBadge = ({ free }) =>
  free ? (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 99,
        fontSize: "0.7rem",
        fontWeight: 700,
        background: "#d1fae5",
        color: "#065f46",
      }}
    >
      ✓ Libre
    </span>
  ) : (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 99,
        fontSize: "0.7rem",
        fontWeight: 700,
        background: "#fee2e2",
        color: "#991b1b",
      }}
    >
      ✕ Pris
    </span>
  );

const PatientRendezVous = () => {
  const { user } = useAuth();
  const patientId = getPatientId(user);

  const [rendezVous, setRendezVous]       = useState([]);
  const [allRendezVous, setAllRendezVous] = useState([]); // tous les RDV du jour choisi (pour vérifier les créneaux pris)
  const [services, setServices]           = useState([]);
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [rdvDayLoading, setRdvDayLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError]                 = useState("");
  const [success, setSuccess]             = useState("");
  const [valErrors, setValErrors]         = useState([]);
  const [actionId, setActionId]           = useState(null);
  const [reportTarget, setReportTarget]   = useState(null);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [pending, setPending]             = useState(null);
  const [reportForm, setReportForm]       = useState({ date_rdv: "", heure_debut: "", heure_fin: "" });
  const [filterDate, setFilterDate]       = useState("");
  const [filterStatus, setFilterStatus]   = useState("");
  const [showForm, setShowForm]           = useState(false);

  const initForm = {
    date_rdv: "",
    disponibilite_id: "",
    dentiste_id: "",
    service_id: "",
    heure_debut: "",
    heure_fin: "",
    motif: "",
  };
  const [form, setForm] = useState(initForm);

  /* ───────────── Chargement initial ───────────── */
  const loadData = useCallback(async () => {
    if (!patientId) {
      setError("Patient introuvable.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [rdvRes, svcRes, dispoRes] = await Promise.all([
        rendezVousApi.getAll({ patient_id: patientId }),
        serviceApi.getAll(),
        disponibiliteApi.getAll(),
      ]);
      setRendezVous(rdvRes.data?.data?.rendez_vous || []);
      setServices(svcRes.data?.data?.services || []);
      setDisponibilites(dispoRes.data?.data?.disponibilites || []);
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ───────────── Quand la date change : charger les RDV de ce jour ───────────── */
  useEffect(() => {
    if (!form.date_rdv) {
      setAllRendezVous([]);
      setForm((p) => ({ ...p, disponibilite_id: "", dentiste_id: "", heure_debut: "", heure_fin: "" }));
      return;
    }
    let cancelled = false;
    const fetchDayRdv = async () => {
      setRdvDayLoading(true);
      try {
        // getOccupancy retourne les créneaux de TOUS les patients ce jour-là
        // (seulement dentiste_id + heures, aucune donnée personnelle)
        const res = await rendezVousApi.getOccupancy(form.date_rdv);
        if (!cancelled) setAllRendezVous(res.data?.data?.slots || []);
      } catch {
        if (!cancelled) setAllRendezVous([]);
      } finally {
        if (!cancelled) setRdvDayLoading(false);
      }
    };
    fetchDayRdv();
    setForm((p) => ({ ...p, disponibilite_id: "", dentiste_id: "", heure_debut: "", heure_fin: "" }));
    return () => { cancelled = true; };
  }, [form.date_rdv]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ───────────── Calcul des créneaux disponibles pour la date choisie ───────────── */
  const slotsForDate = useMemo(() => {
    if (!form.date_rdv) return [];
    const dayName = getDayName(form.date_rdv);
    if (!dayName) return [];

    return disponibilites
      .filter((d) => d.est_disponible && d.jour_semaine === dayName)
      .map((slot) => {
        const nextStart = getNextAvailableStart(slot, allRendezVous);
        // Complet = plus aucune minute disponible dans le créneau
        const isTaken = nextStart === null;
        return { ...slot, isTaken, nextStart };
      })
      .sort((a, b) => {
        if (a.isTaken !== b.isTaken) return a.isTaken ? 1 : -1;
        return fmt(a.heure_debut).localeCompare(fmt(b.heure_debut));
      });
  }, [form.date_rdv, disponibilites, allRendezVous]);

  const freeSlots  = useMemo(() => slotsForDate.filter((s) => !s.isTaken), [slotsForDate]);
  const takenSlots = useMemo(() => slotsForDate.filter((s) => s.isTaken), [slotsForDate]);

  /* ───────────── Sélection d'un créneau ───────────── */
  const onSlotChange = (val) => {
    const s = slotsForDate.find((x) => String(x.id) === val);
    if (!s) {
      setForm((p) => ({ ...p, disponibilite_id: "", dentiste_id: "", heure_debut: "", heure_fin: "" }));
      return;
    }
    // Utiliser la prochaine heure disponible (fin du dernier RDV ou début du créneau)
    const heureDebut = s.nextStart || fmt(s.heure_debut);
    const svc = services.find((sv) => String(sv.id) === form.service_id);
    const heureFin = svc
      ? addMinutes(heureDebut, Number(svc.duree))
      : fmt(s.heure_fin);
    setForm((p) => ({
      ...p,
      disponibilite_id: val,
      dentiste_id:      String(s.dentiste_id),
      heure_debut:      heureDebut,
      heure_fin:        heureFin,
    }));
  };

  /* ───────────── Filtres tableau ───────────── */
  const filtered = useMemo(
    () =>
      rendezVous.filter((r) => {
        if (filterDate   && r.date_rdv !== filterDate)     return false;
        if (filterStatus && r.statut   !== filterStatus)   return false;
        return true;
      }),
    [rendezVous, filterDate, filterStatus],
  );

  const statusOptions = useMemo(
    () => [...new Set(rendezVous.map((r) => r.statut))],
    [rendezVous],
  );

  /* ───────────── Soumission formulaire ───────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setValErrors([]);
    const svc  = services.find((s) => String(s.id) === form.service_id);
    const slot = slotsForDate.find((s) => String(s.id) === form.disponibilite_id);
    if (!svc || !slot) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }
    if (slot.isTaken) {
      setError("Ce créneau est déjà réservé. Veuillez en choisir un autre.");
      return;
    }
    // Vérifier que heure_debut est dans la plage du créneau
    const minTime = slot.nextStart || fmt(slot.heure_debut);
    const maxTime = fmt(slot.heure_fin);
    if (form.heure_debut < minTime) {
      setError(`L'heure de début ne peut pas être avant ${minTime}.`);
      return;
    }
    if (form.heure_fin > maxTime) {
      setError(`L'heure de fin (${form.heure_fin}) dépasse la fin du créneau du dentiste (${maxTime}). Choisissez une heure de début plus tôt ou un service plus court.`);
      return;
    }
    setPending({
      service:     svc,
      dentiste:    slot.dentiste,
      date_rdv:    form.date_rdv,
      heure_debut: form.heure_debut,
      heure_fin:   form.heure_fin,
      motif:       form.motif || "(Aucun motif)",
    });
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!pending || !patientId) return;
    setSubmitLoading(true);
    setError("");
    setValErrors([]);
    try {
      await rendezVousApi.create({
        patient_id:  Number(patientId),
        dentiste_id: Number(form.dentiste_id),
        service_id:  Number(form.service_id),
        date_rdv:    form.date_rdv,
        heure_debut: fmt(form.heure_debut),
        heure_fin:   fmt(form.heure_fin),
        motif:       form.motif,
      });
      setSuccess("Rendez-vous créé avec succès.");
      setForm(initForm);
      setShowConfirm(false);
      setPending(null);
      setShowForm(false);
      await loadData();
    } catch (err) {
      if (err.response?.status === 422)
        setValErrors(Object.values(err.response.data?.errors || {}).flat());
      else
        setError(err.response?.data?.message || err.message || "Erreur lors de la création.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = async (item) => {
    if (!window.confirm("Confirmer l'annulation ?")) return;
    setActionId(item.id);
    setError("");
    setSuccess("");
    try {
      try {
        await rendezVousApi.update(item.id, { ...item, statut: "annule" });
      } catch (e) {
        if (e.response?.status === 403) await rendezVousApi.delete(item.id);
        else throw e;
      }
      setSuccess("Rendez-vous annulé avec succès.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'annulation.");
    } finally {
      setActionId(null);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;
    setActionId(reportTarget.id);
    setError("");
    setSuccess("");
    try {
      await rendezVousApi.update(reportTarget.id, {
        ...reportTarget,
        statut: "reporte",
        date_rdv: reportForm.date_rdv,
        heure_debut: reportForm.heure_debut,
        heure_fin: reportForm.heure_fin,
      });
      setSuccess("Rendez-vous reporté avec succès.");
      setReportTarget(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du report.");
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <PatientLoading text="Chargement des rendez-vous..." />;
  if (error && rendezVous.length === 0)
    return <PatientError message={error} onRetry={loadData} />;

  const inp = { className: "patient-search", style: { height: 38 } };
  const dayName = getDayName(form.date_rdv);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── En-tête ── */}
      <div
        className="animate-fadeInDown"
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>
            Mes rendez-vous
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "#9ca3af" }}>
            {rendezVous.length} rendez-vous au total
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => { setShowForm((v) => !v); setError(""); setSuccess(""); }}
        >
          {showForm ? "✕ Fermer" : "+ Nouveau rendez-vous"}
        </button>
      </div>

      {/* ── Messages ── */}
      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-danger">{error}</div>}
      {valErrors.length > 0 && (
        <div className="alert alert-danger">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {valErrors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* ══════════════════════════════════════════
          FORMULAIRE NOUVEAU RDV — date d'abord
      ══════════════════════════════════════════ */}
      {showForm && (
        <div
          className="animate-scaleIn"
          style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "24px" }}
        >
          <h3 style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
            Prendre un rendez-vous
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: "0.8rem", color: "#6b7280" }}>
            Choisissez d'abord la date souhaitée — les dentistes disponibles ce jour s'afficheront automatiquement.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 14 }}>

              {/* ── ÉTAPE 1 : Date ── */}
              <Field label="① Date du rendez-vous">
                <input
                  type="date"
                  value={form.date_rdv}
                  min={todayStr()}
                  onChange={(e) => setForm((p) => ({ ...p, date_rdv: e.target.value }))}
                  required
                  {...inp}
                />
              </Field>

              {/* ── ÉTAPE 2 : Créneau (conditionnel à la date) ── */}
              <Field label={`② Créneau${dayName ? ` — ${dayName}` : ""}`}>
                {!form.date_rdv ? (
                  <div style={{
                    height: 38, display: "flex", alignItems: "center",
                    padding: "0 12px", borderRadius: 8, background: "#f9fafb",
                    border: "1.5px dashed #d1d5db", color: "#9ca3af", fontSize: "0.82rem",
                  }}>
                    Choisissez d'abord une date
                  </div>
                ) : rdvDayLoading ? (
                  <div style={{
                    height: 38, display: "flex", alignItems: "center", gap: 8,
                    padding: "0 12px", borderRadius: 8, background: "#f0f9ff",
                    border: "1.5px solid #bae6fd", color: "#0284c7", fontSize: "0.82rem",
                  }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #bae6fd", borderTopColor: "#0284c7", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                    Chargement des créneaux...
                  </div>
                ) : slotsForDate.length === 0 ? (
                  <div style={{
                    height: 38, display: "flex", alignItems: "center",
                    padding: "0 12px", borderRadius: 8, background: "#fef3c7",
                    border: "1.5px solid #fcd34d", color: "#92400e", fontSize: "0.82rem",
                  }}>
                    Aucun dentiste disponible ce jour
                  </div>
                ) : (
                  <select
                    value={form.disponibilite_id}
                    onChange={(e) => onSlotChange(e.target.value)}
                    required
                    style={{ width: "100%" }}
                  >
                    <option value="">Sélectionner un créneau</option>
                    {freeSlots.length > 0 && (
                      <optgroup label="✓ Créneaux libres">
                        {freeSlots.map((s) => (
                          <option key={s.id} value={s.id}>
                            Dr. {s.dentiste?.user?.prenom} {s.dentiste?.user?.nom}
                            {s.dentiste?.specialite ? ` (${s.dentiste.specialite})` : ""}
                            {" — "}{s.nextStart || fmt(s.heure_debut)}–{fmt(s.heure_fin)}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {takenSlots.length > 0 && (
                      <optgroup label="✕ Déjà réservés (indisponibles)">
                        {takenSlots.map((s) => (
                          <option key={s.id} value={s.id} disabled>
                            Dr. {s.dentiste?.user?.prenom} {s.dentiste?.user?.nom}
                            {" — "}{fmt(s.heure_debut)}–{fmt(s.heure_fin)} (complet)
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                )}
              </Field>

              {/* ── ÉTAPE 3 : Service ── */}
              <Field label="③ Service">
                <select
                  value={form.service_id}
                  onChange={(e) => {
                    const svcId = e.target.value;
                    const svc   = services.find((s) => String(s.id) === svcId);
                    // heure_debut = nextStart du slot sélectionné (déjà dans form.heure_debut)
                    const fin   = svc && form.heure_debut
                      ? addMinutes(form.heure_debut, Number(svc.duree))
                      : form.heure_fin;
                    setForm((p) => ({ ...p, service_id: svcId, heure_fin: fin || p.heure_fin }));
                  }}
                  required
                  style={{ width: "100%" }}
                  disabled={!form.disponibilite_id}
                >
                  <option value="">Sélectionner un service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nom} — {s.duree} min
                    </option>
                  ))}
                </select>
              </Field>

              {/* Heure début — modifiable, contrainte dans la plage du créneau */}
              {form.heure_debut && (() => {
                const slot = slotsForDate.find((x) => String(x.id) === form.disponibilite_id);
                const minTime = slot ? (slot.nextStart || fmt(slot.heure_debut)) : "";
                const maxTime = slot ? fmt(slot.heure_fin) : "";
                return (
                  <>
                    <Field label="④ Heure de début">
                      <input
                        type="time"
                        value={form.heure_debut}
                        min={minTime}
                        max={maxTime}
                        onChange={(e) => {
                          const newDebut = e.target.value;
                          const svc = services.find((sv) => String(sv.id) === form.service_id);
                          const newFin = svc ? addMinutes(newDebut, Number(svc.duree)) : form.heure_fin;
                          setForm((p) => ({ ...p, heure_debut: newDebut, heure_fin: newFin }));
                        }}
                        required
                        {...inp}
                        style={{ ...inp.style, border: "1.5px solid #e5e7eb" }}
                      />
                      {minTime && maxTime && (
                        <span style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: 3, display: "block" }}>
                          Disponible de {minTime} à {maxTime}
                        </span>
                      )}
                    </Field>

                    <Field label="Heure de fin (calculée)">
                      <input
                        type="time"
                        value={form.heure_fin}
                        readOnly
                        {...inp}
                        style={{ ...inp.style, background: "#f0f9ff", border: "1.5px solid #bae6fd", color: "#0369a1", fontWeight: 600 }}
                      />
                      {!form.service_id && (
                        <span style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 3, display: "block" }}>
                          Choisissez un service pour calculer automatiquement
                        </span>
                      )}
                    </Field>
                  </>
                );
              })()}

              {/* Motif */}
              <Field label="Motif (optionnel)" full>
                <textarea
                  value={form.motif}
                  onChange={(e) => setForm((p) => ({ ...p, motif: e.target.value }))}
                  placeholder="Décrivez votre besoin..."
                  style={{
                    width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb",
                    borderRadius: 10, fontFamily: "inherit", fontSize: "0.855rem",
                    resize: "vertical", minHeight: 80, boxSizing: "border-box", outline: "none",
                  }}
                />
              </Field>
            </div>

            {/* Récapitulatif du dentiste choisi */}
            {form.disponibilite_id && (() => {
              const s = slotsForDate.find((x) => String(x.id) === form.disponibilite_id);
              if (!s) return null;
              return (
                <div style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                  borderRadius: 10, background: "#f0f9ff", border: "1.5px solid #bae6fd",
                  marginBottom: 16, flexWrap: "wrap",
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, background: "#0284c7",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0c4a6e" }}>
                      Dr. {s.dentiste?.user?.prenom} {s.dentiste?.user?.nom}
                      {s.dentiste?.specialite && (
                        <span style={{ marginLeft: 6, fontSize: "0.75rem", color: "#0369a1", fontWeight: 500 }}>
                          — {s.dentiste.specialite}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#0369a1", marginTop: 2 }}>
                      {form.date_rdv && new Date(`${form.date_rdv}T12:00:00`).toLocaleDateString("fr-FR", {
                        weekday: "long", day: "numeric", month: "long", year: "numeric",
                      })} &bull; {form.heure_debut} – {form.heure_fin || fmt(s.heure_fin)}
                      {form.service_id && (() => {
                        const svc = services.find((sv) => String(sv.id) === form.service_id);
                        return svc
                          ? <span style={{ marginLeft: 6, opacity: 0.75 }}>({svc.duree} min)</span>
                          : null;
                      })()}
                    </div>
                  </div>
                  <SlotBadge free={!s.isTaken} />
                </div>
              );
            })()}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitLoading || showConfirm || !form.disponibilite_id || !form.service_id}
              >
                {submitLoading ? "Envoi..." : "Confirmer le rendez-vous"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setShowForm(false); setForm(initForm); }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Formulaire report ── */}
      {reportTarget && (
        <div
          className="animate-scaleIn"
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #bae6fd",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Reporter le rendez-vous
            </h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setReportTarget(null)}
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleReport}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <Field label="Nouvelle date">
                <input
                  type="date"
                  value={reportForm.date_rdv}
                  onChange={(e) =>
                    setReportForm((p) => ({ ...p, date_rdv: e.target.value }))
                  }
                  required
                  {...inp}
                />
              </Field>
              <Field label="Nouvelle heure début">
                <input
                  type="time"
                  value={reportForm.heure_debut}
                  onChange={(e) =>
                    setReportForm((p) => ({
                      ...p,
                      heure_debut: e.target.value,
                    }))
                  }
                  required
                  {...inp}
                />
              </Field>
              <Field label="Nouvelle heure fin">
                <input
                  type="time"
                  value={reportForm.heure_fin}
                  onChange={(e) =>
                    setReportForm((p) => ({ ...p, heure_fin: e.target.value }))
                  }
                  required
                  {...inp}
                />
              </Field>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={actionId === reportTarget.id}
              >
                {actionId === reportTarget.id
                  ? "Envoi..."
                  : "Valider le report"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setReportTarget(null)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filtres ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          padding: "16px 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            alignItems: "end",
          }}
        >
          <Field label="Filtrer par date">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              {...inp}
            />
          </Field>
          <Field label="Filtrer par statut">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">Tous les statuts</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          {(filterDate || filterStatus) && (
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setFilterDate("");
                  setFilterStatus("");
                }}
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Tableau ── */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              width="26"
              height="26"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 700,
              color: "#374151",
            }}
          >
            Aucun rendez-vous
          </p>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "0.875rem",
              color: "#9ca3af",
            }}
          >
            Aucun rendez-vous ne correspond aux filtres.
          </p>
        </div>
      ) : (
        <div
          className="animate-fadeInUp"
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.845rem",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Service",
                    "Dentiste",
                    "Date",
                    "Heure",
                    "Statut",
                    "Motif",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.09em",
                        color: "#0284c7",
                        background: "#f0f9ff",
                        borderBottom: "2px solid #bae6fd",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      background: i % 2 === 1 ? "#fafbfc" : "#fff",
                      transition: "background 150ms",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f9ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        i % 2 === 1 ? "#fafbfc" : "#fff")
                    }
                  >
                    <td
                      style={{
                        padding: "11px 16px",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {item.service?.nom || "—"}
                    </td>
                    <td style={{ padding: "11px 16px", color: "#374151" }}>
                      Dr. {item.dentiste?.user?.prenom}{" "}
                      {item.dentiste?.user?.nom}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(item.date_rdv).toLocaleDateString("fr-FR")}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmt(item.heure_debut)} – {fmt(item.heure_fin)}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <StatusBadge status={item.statut} />
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        color: item.motif ? "#374151" : "#9ca3af",
                        maxWidth: 160,
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                        }}
                      >
                        {item.motif || "Sans motif"}
                      </span>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}
                      >
                        {item.statut === "en_attente" && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            disabled={actionId === item.id}
                            onClick={() => handleCancel(item)}
                          >
                            {actionId === item.id ? "..." : "Annuler"}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          disabled={actionId === item.id}
                          onClick={() => {
                            setReportTarget(item);
                            setReportForm({
                              date_rdv: item.date_rdv || "",
                              heure_debut: fmt(item.heure_debut),
                              heure_fin: fmt(item.heure_fin),
                            });
                          }}
                        >
                          Reporter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal confirmation ── */}
      {showConfirm && pending && (
        <div className="patient-confirmation-overlay">
          <div className="patient-confirmation-modal animate-scaleIn">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#e0f2fe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  Confirmer le rendez-vous
                </h4>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "0.78rem",
                    color: "#9ca3af",
                  }}
                >
                  Vérifiez les informations avant de confirmer
                </p>
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                padding: "16px",
                marginBottom: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                { label: "Service", value: pending.service.nom },
                {
                  label: "Dentiste",
                  value: `Dr. ${pending.dentiste?.user?.prenom} ${pending.dentiste?.user?.nom}`,
                },
                {
                  label: "Date",
                  value: new Date(pending.date_rdv).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  ),
                },
                {
                  label: "Heure",
                  value: `${pending.heure_debut} – ${pending.heure_fin}`,
                },
                { label: "Motif", value: pending.motif },
              ].map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      flexShrink: 0,
                    }}
                  >
                    {f.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.845rem",
                      fontWeight: 600,
                      color: "#111827",
                      textAlign: "right",
                    }}
                  >
                    {f.value}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                type="button"
                className="btn btn-primary"
                disabled={submitLoading}
                onClick={handleConfirm}
              >
                {submitLoading ? "Traitement..." : "Confirmer"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={submitLoading}
                onClick={() => {
                  setShowConfirm(false);
                  setPending(null);
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRendezVous;
