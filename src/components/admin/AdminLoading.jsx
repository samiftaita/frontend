import React from "react";

const AdminLoading = ({ text = "Chargement..." }) => {
  return (
    <div className="admin-state admin-loading">
      <div className="admin-state-spinner" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
};

export default AdminLoading;
