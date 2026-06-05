import React from "react";

const AdminError = ({ message, onRetry }) => {
  return (
    <div className="admin-state admin-error">
      <p className="admin-state-message">{message}</p>
      {onRetry ? (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Réessayer
        </button>
      ) : null}
    </div>
  );
};

export default AdminError;
