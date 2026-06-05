import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ListeDossiers from "../components/DossierMedical/ListeDossiers";

const DossiersPage = () => {
  const { hasRole } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {hasRole("patient") ? "Mon dossier médical" : "Dossiers patients"}
      </h1>
      <ListeDossiers />
    </div>
  );
};

export default DossiersPage;
