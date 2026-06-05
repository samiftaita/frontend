import React from "react";
import PropTypes from "prop-types";

const StatutBadge = ({ statut }) => {
  const normalized = (statut || "").toLowerCase();

  const styles = {
    confirme: "bg-green-100 text-green-800",
    confirmé: "bg-green-100 text-green-800",
    en_attente: "bg-yellow-100 text-yellow-800",
    annule: "bg-red-100 text-red-800",
    annulé: "bg-red-100 text-red-800",
    reporte: "bg-blue-100 text-blue-800",
    terminé: "bg-blue-100 text-blue-800",
  };

  const labels = {
    confirme: "Confirme",
    confirmé: "Confirme",
    en_attente: "En attente",
    annule: "Annule",
    annulé: "Annulé",
    reporte: "Reporte",
    terminé: "Terminé",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${styles[normalized] || "bg-gray-100 text-gray-800"}`}
    >
      {labels[normalized] || statut}
    </span>
  );
};

StatutBadge.propTypes = {
  statut: PropTypes.string,
};

StatutBadge.defaultProps = {
  statut: "",
};

export default StatutBadge;
