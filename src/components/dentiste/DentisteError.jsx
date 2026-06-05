import React from "react";
import { AlertTriangleIcon } from "../Common/Icons";

const DentisteError = ({ message, onRetry }) => {
  return (
    <div className="dentiste-error">
      <div className="error-icon" style={{ color: "var(--color-danger)" }}>
        <AlertTriangleIcon className="w-10 h-10" />
      </div>
      <h3>Une erreur s'est produite</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Réessayer
        </button>
      )}
    </div>
  );
};

export default DentisteError;
