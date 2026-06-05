import React from "react";

const PatientError = ({ message = "Une erreur est survenue.", onRetry }) => {
  return (
    <div className="patient-error">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Reessayer
        </button>
      )}
    </div>
  );
};

export default PatientError;
