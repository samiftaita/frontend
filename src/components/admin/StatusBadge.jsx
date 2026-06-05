import React from "react";

const STATUS_LABELS = {
  en_attente: "En attente",
  confirme: "Confirmé",
  annule: "Annulé",
  reporte: "Reporté",
};

const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();
  const label = STATUS_LABELS[normalized] || status || "Non renseigné";
  const className = `status-badge status-${normalized || "default"}`;

  return <span className={className}>{label}</span>;
};

export default StatusBadge;
