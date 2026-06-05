import React from "react";

const CloseIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    viewBox="0 0 24 24"
    width="15"
    height="15"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AdminFormModal = ({
  isOpen,
  title,
  subtitle,
  onClose,
  onSubmit,
  submitLabel = "Enregistrer",
  children,
  size = "md",
}) => {
  if (!isOpen) return null;

  const maxWidth = size === "sm" ? 460 : size === "lg" ? 760 : 600;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17,24,39,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 1100,
        backdropFilter: "blur(6px)",
        animation: "fadeIn 0.15s ease-out both",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && e.stopPropagation()}
        style={{
          width: `min(${maxWidth}px, 100%)`,
          maxHeight: "calc(100vh - 32px)",
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* ── Header compact ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 18px",
            borderBottom: "1px solid #f3f4f6",
            flexShrink: 0,
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "#e0f2fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div>
              <h3
                id="form-modal-title"
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h3>
              {subtitle && (
                <p
                  style={{
                    margin: "1px 0 0",
                    fontSize: "0.72rem",
                    color: "#9ca3af",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6b7280",
              flexShrink: 0,
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fee2e2";
              e.currentTarget.style.color = "#ef4444";
              e.currentTarget.style.borderColor = "#fecaca";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.color = "#6b7280";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Body ── */}
        <form
          id="admin-form-modal-form"
          onSubmit={onSubmit}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {children}

          {/* ── Footer intégré dans le form ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
              paddingTop: 14,
              borderTop: "1px solid #f3f4f6",
              marginTop: 4,
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                width="14"
                height="14"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFormModal;
