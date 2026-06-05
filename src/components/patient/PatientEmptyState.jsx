import React from "react";

const PatientEmptyState = ({
  title = "Aucune donnee",
  message = "Aucun element a afficher.",
}) => {
  return (
    <div className="patient-empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
};

export default PatientEmptyState;
