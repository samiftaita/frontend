import React from "react";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  const profileFields = [
    { label: "Prenom", value: user?.prenom },
    { label: "Nom", value: user?.nom },
    { label: "Email", value: user?.email },
    { label: "Telephone", value: user?.telephone },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon profil</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Informations utilisateur
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileFields.map((field) => (
            <div
              key={field.label}
              className="border border-gray-100 rounded-md p-4 bg-gray-50/60"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {field.label}
              </p>
              <p className="text-gray-900 font-medium mt-1">
                {field.value || "Non renseigne"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
