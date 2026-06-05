import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../../styles/patient.css";

const Icons = {
  dashboard: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  profile: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  services: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  calendar: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  rdv: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 16 11 18 15 14" />
    </svg>
  ),
  folder: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  ),
  clipboard: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  ),
  logout: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  chevronL: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  chevronR: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  close: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const LINKS = [
  { to: "/patient/dashboard", label: "Tableau de bord", icon: Icons.dashboard },
  { to: "/patient/profile", label: "Mon profil", icon: Icons.profile },
  { to: "/patient/services", label: "Services", icon: Icons.services },
  {
    to: "/patient/disponibilites",
    label: "Disponibilités",
    icon: Icons.calendar,
  },
  { to: "/patient/rendez-vous", label: "Mes rendez-vous", icon: Icons.rdv },
  {
    to: "/patient/dossier-medical",
    label: "Dossier médical",
    icon: Icons.folder,
  },
  {
    to: "/patient/historique-soins",
    label: "Historique des soins",
    icon: Icons.clipboard,
  },
];

const ToothLogo = () => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
  >
    <path
      d="M32 8C24 8 16 15 16 25C16 33 20 40 22 48C24 56 24 64 24 73C24 78 26 82 30 82C34 82 36 78 38 73C40 68 42 64 50 64C58 64 60 68 62 73C64 78 66 82 70 82C74 82 76 78 76 73C76 64 76 56 78 48C80 40 84 33 84 25C84 15 76 8 68 8C63 8 57 11 50 11C43 11 37 8 32 8Z"
      fill="white"
    />
    <path
      d="M36 20C40 26 44 28 50 28C56 28 60 26 64 20"
      stroke="#bae6fd"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const PatientSidebar = ({
  onLogout,
  isOpen,
  onClose,
  collapsed = false,
  onToggleCollapse = () => {},
}) => {
  return (
    <>
      <aside
        className={`patient-sidebar ${isOpen ? "is-open" : ""} ${collapsed ? "collapsed" : ""}`}
      >
        {/* ── Header ── */}
        <div className="patient-sidebar-header">
          {collapsed ? (
            <button
              type="button"
              className="sidebar-collapse-btn sidebar-collapse-btn-center"
              onClick={onToggleCollapse}
              aria-label="Agrandir"
              title="Agrandir le menu"
            >
              {Icons.chevronR}
            </button>
          ) : (
            <>
              <Link
                to="/"
                style={{ textDecoration: "none" }}
                className="admin-brand"
              >
                <div className="admin-brand-icon">
                  <ToothLogo />
                </div>
                <div>
                  <h2 className="admin-brand-name">
                    <span>DENT</span>ORA
                  </h2>
                  <p className="admin-brand-subtitle">Espace patient</p>
                </div>
              </Link>
              <div className="sidebar-header-actions">
                <button
                  type="button"
                  className="sidebar-collapse-btn"
                  onClick={onToggleCollapse}
                  aria-label="Réduire"
                  title="Réduire le menu"
                >
                  {Icons.chevronL}
                </button>
                <button
                  type="button"
                  className="admin-sidebar-close"
                  onClick={onClose}
                  aria-label="Fermer"
                >
                  {Icons.close}
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="patient-sidebar-nav">
          <div className="patient-nav-section">Navigation</div>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `patient-sidebar-link ${isActive ? "active" : ""}`
              }
              title={collapsed ? link.label : undefined}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div className="patient-logout-btn">
          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? "Déconnexion" : undefined}
          >
            <span>{Icons.logout}</span>
            <span className="nav-label">Déconnexion</span>
          </button>
        </div>
      </aside>
      {isOpen && <button className="patient-sidebar-overlay" type="button" onClick={onClose} />}
    </>
  );
};

export default PatientSidebar;
