import React from "react";

const StatusBadge = ({ status }) => {
  let displayText = "";
  let className = "status-badge";

  switch (status) {
    case "en_attente":
      displayText = "En attente";
      className += " status-attente";
      break;
    case "confirme":
      displayText = "Confirmé";
      className += " status-confirme";
      break;
    case "annule":
      displayText = "Annulé";
      className += " status-annule";
      break;
    case "reporte":
      displayText = "Reporté";
      className += " status-reporte";
      break;
    default:
      displayText = status;
  }

  return <span className={className}>{displayText}</span>;
};

export default StatusBadge;
