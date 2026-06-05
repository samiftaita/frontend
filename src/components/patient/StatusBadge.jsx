import React from "react";

const statusMap = {
  en_attente: { label: "En attente", className: "status-en-attente" },
  confirme: { label: "Confirme", className: "status-confirme" },
  annule: { label: "Annule", className: "status-annule" },
  reporte: { label: "Reporte", className: "status-reporte" },
};

const StatusBadge = ({ status }) => {
  const key = (status || "").toLowerCase();
  const config = statusMap[key] || {
    label: status || "Inconnu",
    className: "status-default",
  };

  return (
    <span className={`status-badge ${config.className}`}>{config.label}</span>
  );
};

export default StatusBadge;
