import React from "react";

const AdminEmptyState = ({
  title = "Aucun élément",
  message = "Aucune donnée à afficher.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="admin-state admin-empty">
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default AdminEmptyState;
