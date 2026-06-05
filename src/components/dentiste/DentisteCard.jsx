import React from "react";

const DentisteCard = ({ title, value, icon, color = "default" }) => {
  return (
    <div className={`dentiste-card card-${color}`}>
      <div className="card-icon">{icon && <span>{icon}</span>}</div>
      <h3>{title}</h3>
      <p className="card-value">{value}</p>
    </div>
  );
};

export default DentisteCard;
