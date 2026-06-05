import React from "react";

const ConfirmModal = ({
  isOpen,
  title = "Confirmation",
  message,
  onClose,
  onConfirm,
  confirmLabel = "Confirmer",
}) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={onClose} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && e.stopPropagation()}
      >
        <h3 id="confirm-title">{title}</h3>
        <p>{message}</p>
        <div className="admin-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
