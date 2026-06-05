import React from "react";

const DentisteLoading = ({ text = "Chargement..." }) => {
  return (
    <div className="dentiste-loading">
      <div className="loader"></div>
      <p>{text}</p>
    </div>
  );
};

export default DentisteLoading;
