import React, { useState, useRef } from "react";
import PriseRendezVous from "../components/RendezVous/PriseRendezVous";
import ListeRendezVous from "../components/RendezVous/ListeRendezVous";

const RendezVousPage = () => {
  const [activeTab, setActiveTab] = useState("liste");
  const listeRendezVousRef = useRef(null);

  const handleRendezVousCreated = () => {
    // Recharger la liste et basculer sur l'onglet liste
    if (listeRendezVousRef.current) {
      listeRendezVousRef.current.reloadRendezVous();
    }
    setActiveTab("liste");
  };

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("liste")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "liste"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Mes rendez-vous
          </button>
          <button
            onClick={() => setActiveTab("nouveau")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "nouveau"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Nouveau rendez-vous
          </button>
        </nav>
      </div>

      {activeTab === "liste" ? (
        <ListeRendezVous ref={listeRendezVousRef} />
      ) : (
        <PriseRendezVous onSuccess={handleRendezVousCreated} />
      )}
    </div>
  );
};

export default RendezVousPage;
