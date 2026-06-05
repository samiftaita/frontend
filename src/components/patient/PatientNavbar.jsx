import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/patient.css";

const PAGE_TITLES = {
  "/patient/dashboard": {
    title: "Tableau de bord",
    sub: "Vue d'ensemble de votre espace",
  },
  "/patient/profile": { title: "Mon profil", sub: "Informations personnelles" },
  "/patient/services": {
    title: "Services",
    sub: "Soins et prestations disponibles",
  },
  "/patient/disponibilites": {
    title: "Disponibilités",
    sub: "Créneaux horaires disponibles",
  },
  "/patient/rendez-vous": {
    title: "Mes rendez-vous",
    sub: "Suivi de vos consultations",
  },
  "/patient/dossier-medical": {
    title: "Dossier médical",
    sub: "Votre historique médical",
  },
  "/patient/historique-soins": {
    title: "Historique des soins",
    sub: "Actes et traitements reçus",
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

const PatientNavbar = ({ user, onToggleSidebar }) => {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || {
    title: "Espace Patient",
    sub: "Cabinet Dentaire",
  };

  const initials =
    `${user?.prenom?.[0] || ""}${user?.nom?.[0] || ""}`.toUpperCase() || "P";
  const fullName =
    `${user?.prenom || ""} ${user?.nom || ""}`.trim() || "Patient";

  return (
    <header className="patient-navbar">
      <div className="patient-navbar-left">
        <button
          type="button"
          className="patient-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon />
        </button>
        <div>
          <h1 className="patient-navbar-title">{page.title}</h1>
          <p className="patient-navbar-subtitle">{page.sub}</p>
        </div>
      </div>

      <div className="patient-navbar-right">
        <Link to="/patient/profile" style={{ textDecoration: "none" }}>
          <div className="patient-navbar-user">
            <div className="patient-avatar">{initials}</div>
            <div>
              <div className="patient-user-name">{fullName}</div>
              <div className="patient-user-role">Patient</div>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default PatientNavbar;
