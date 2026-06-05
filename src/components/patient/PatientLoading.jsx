import React from "react";

const PatientLoading = ({ text = "Chargement..." }) => {
  return (
    <div className="patient-loading">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
};

export default PatientLoading;
