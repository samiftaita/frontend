import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Dashboard from "../components/Dashboard/Dashboard";

const DashboardPage = () => {
  const { user } = useAuth();

  // Redirection vers les dashboards spécialisés si disponibles
  if (user?.role === "patient") {
    return <Navigate to="/patient/dashboard" replace />;
  }
  if (user?.role === "dentiste") {
    return <Navigate to="/dentiste/dashboard" replace />;
  }
  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Fallback vers le dashboard générique si nécessaire
  return <Dashboard />;
};

export default DashboardPage;
