import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DentisteSidebar from "../components/dentiste/DentisteSidebar";
import DentisteNavbar from "../components/dentiste/DentisteNavbar";
import PageTransition from "../components/Common/PageTransition";
import "../styles/dentiste.css";

const DentisteLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dentiste-layout">
      {sidebarOpen && (
        <div
          className="dentiste-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        />
      )}
      <DentisteSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <div
        className={`dentiste-main ${collapsed ? "dentiste-main-collapsed" : ""}`}
      >
        <DentisteNavbar
          user={user}
          onToggleSidebar={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />
        <main className="dentiste-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default DentisteLayout;
