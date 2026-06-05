import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PatientSidebar from "../components/patient/PatientSidebar";
import PatientNavbar from "../components/patient/PatientNavbar";
import PageTransition from "../components/Common/PageTransition";
import "../styles/patient.css";

const PatientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="patient-layout">
      {sidebarOpen && (
        <div
          className="patient-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        />
      )}
      <PatientSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <div
        className={`patient-main ${collapsed ? "patient-main-collapsed" : ""}`}
      >
        <PatientNavbar
          user={user}
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <main className="patient-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
