import React from "react";

const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  isDangerous = false,
}) => {
  return (
    <div className="modal-overlay" onClick={onCancel} onKeyDown={(e) => e.key === "Escape" && onCancel()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === "Escape" && e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn ${isDangerous ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
