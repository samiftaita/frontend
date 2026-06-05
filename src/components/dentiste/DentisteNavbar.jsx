import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/dentiste.css";

const PAGE_TITLES = {
  "/dentiste/dashboard": {
    title: "Tableau de bord",
    sub: "Vue d'ensemble de votre activité",
  },
  "/dentiste/profile": { title: "Mon profil", sub: "Informations du compte" },
  "/dentiste/rendez-vous": {
    title: "Mes rendez-vous",
    sub: "Suivi et gestion des consultations",
  },
  "/dentiste/dossiers-medicaux": {
    title: "Dossiers médicaux",
    sub: "Historique médical des patients",
  },
  "/dentiste/fiches-soins": {
    title: "Fiches de soins",
    sub: "Actes et traitements réalisés",
  },
  "/dentiste/disponibilites": {
    title: "Disponibilités",
    sub: "Gestion de vos créneaux horaires",
  },
};

const MenuIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const ChevronDown = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    width="12"
    height="12"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const getDentisteDisplayName = (user) => {
  const p = user?.prenom || user?.first_name || "";
  const n = user?.nom || user?.last_name || "";
  return `${p} ${n}`.trim() || "Dentiste";
};

const DentisteNavbar = ({ user, onToggleSidebar, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const page = PAGE_TITLES[location.pathname] || {
    title: "Espace Dentiste",
    sub: "Cabinet Dentaire",
  };
  const initials =
    `${user?.prenom?.[0] || ""}${user?.nom?.[0] || ""}`.toUpperCase() || "DR";
  const fullName = getDentisteDisplayName(user);

  return (
    <header className="dentiste-navbar">
      <div className="dentiste-navbar-left">
        <button
          type="button"
          className="dentiste-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon />
        </button>
        <div className="dentiste-navbar-title">
          <h1>{page.title}</h1>
          <p className="dentiste-user-role">{page.sub}</p>
        </div>
      </div>

      <div className="dentiste-navbar-right">
        <div className="dentiste-user-info">
          <button
            type="button"
            className="user-button"
            onClick={() => setShowMenu((v) => !v)}
          >
            <div className="dentiste-user-avatar">{initials}</div>
            <div className="dentiste-user-details">
              <p className="dentiste-user-name">{fullName}</p>
              <p className="dentiste-user-role">Dentiste</p>
            </div>
            <span className="dropdown-arrow">
              <ChevronDown />
            </span>
          </button>

          {showMenu && (
            <>
              {/* Backdrop */}
              <div
                style={{ position: "fixed", inset: 0, zIndex: 999 }}
                onClick={() => setShowMenu(false)}
                onKeyDown={(e) => e.key === "Escape" && setShowMenu(false)}
              />
              <div className="user-dropdown-menu" style={{ zIndex: 1000 }}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/dentiste/profile");
                    setShowMenu(false);
                  }}
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Mon profil
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item danger"
                  onClick={() => {
                    setShowMenu(false);
                    onLogout?.();
                  }}
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DentisteNavbar;
