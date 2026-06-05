import React from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

const RoleRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) return null;

  if (!allowedRoles.includes(user.role)) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f7fb",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "500px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <NoSymbolIcon className="w-16 h-16 text-red-500" />
          </div>
          <h1
            style={{
              margin: "0 0 16px 0",
              color: "#1f2937",
              fontSize: "1.5rem",
            }}
          >
            Accès Refusé
          </h1>
          <p
            style={{
              margin: "0 0 12px 0",
              color: "#6b7280",
              lineHeight: "1.6",
            }}
          >
            Cette page n'est accessible que pour les{" "}
            <strong>{allowedRoles.join(" ou ")}</strong>.
          </p>
          <p
            style={{
              margin: "0 0 24px 0",
              color: "#9ca3af",
              fontSize: "0.9rem",
            }}
          >
            Vous êtes actuellement connecté en tant que:{" "}
            <strong>{user.role}</strong>
          </p>

          <div
            style={{
              background: "#fef3c7",
              border: "1px solid #fcd34d",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "24px",
              color: "#92400e",
              fontSize: "0.9rem",
            }}
          >
            <p style={{ margin: 0 }}>
              Si vous pensez avoir accès à cette page, veuillez contacter
              l'administrateur.
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "10px 24px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#2563eb")}
            onFocus={(e) => (e.target.style.background = "#2563eb")}
            onMouseOut={(e) => (e.target.style.background = "#3b82f6")}
            onBlur={(e) => (e.target.style.background = "#3b82f6")}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

RoleRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

RoleRoute.defaultProps = {
  allowedRoles: [],
};

export default RoleRoute;
