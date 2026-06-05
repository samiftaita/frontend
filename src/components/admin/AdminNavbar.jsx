import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/admin.css";

/* Map route → titre de page */
const PAGE_TITLES = {
  "/admin/dashboard": {
    title: "Tableau de bord",
    sub: "Vue d'ensemble du cabinet",
  },
  "/admin/dentistes": {
    title: "Dentistes",
    sub: "Gestion de l'équipe médicale",
  },
  "/admin/services": {
    title: "Services",
    sub: "Soins et prestations proposés",
  },
  "/admin/disponibilites": {
    title: "Disponibilités",
    sub: "Créneaux horaires des dentistes",
  },
  "/admin/rendez-vous": {
    title: "Rendez-vous",
    sub: "Suivi et gestion des consultations",
  },
  "/admin/dossiers-medicaux": {
    title: "Dossiers médicaux",
    sub: "Historique médical des patients",
  },
  "/admin/fiches-soins": {
    title: "Fiches de soins",
    sub: "Actes et traitements réalisés",
  },
  "/admin/profile": {
    title: "Mon profil",
    sub: "Informations du compte administrateur",
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

const CalendarIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    width="14"
    height="14"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const getDisplayName = (user) => {
  if (!user) return "Administrateur";
  const prenom = user.prenom || user.first_name || "";
  const nom = user.nom || user.last_name || "";
  return (
    `${prenom} ${nom}`.trim() || user.name || user.email || "Administrateur"
  );
};

const getInitials = (user) => {
  const name = getDisplayName(user);
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "AD"
  );
};

const AdminNavbar = ({ user, onMenuClick = () => {} }) => {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || {
    title: "Administration",
    sub: "Cabinet Dentaire",
  };

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-left">
        <button
          type="button"
          className="admin-menu-btn"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <MenuIcon />
        </button>
        <div className="admin-navbar-title-wrap">
          <div className="admin-navbar-title">{page.title}</div>
          <p className="admin-navbar-role">{page.sub}</p>
        </div>
      </div>

      <div className="admin-navbar-right">
        {/* Sélecteur de période (décoratif, style référence) */}
        <button type="button" className="admin-period-btn">
          <CalendarIcon />
          <span>{today}</span>
        </button>

        {/* Chip utilisateur */}
        {user && (
          <Link to="/admin/profile" style={{ textDecoration: "none" }}>
            <div className="admin-user-chip">
              <div className="admin-user-avatar">{getInitials(user)}</div>
              <div className="admin-user-details">
                <p className="admin-user-name">{getDisplayName(user)}</p>
                <p className="admin-user-role">Administrateur</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
