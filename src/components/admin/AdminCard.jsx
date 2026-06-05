import React from "react";

const colorMap = {
  blue: { bg: "#e0f2fe", fg: "#0077b6" },
  green: { bg: "#dcfce7", fg: "#16a34a" },
  amber: { bg: "#fef3c7", fg: "#d97706" },
  red: { bg: "#fee2e2", fg: "#dc2626" },
  teal: { bg: "#f0fdfa", fg: "#0d9488" },
  violet: { bg: "#ede9fe", fg: "#7c3aed" },
};

const AdminCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  children,
  delay = 0,
}) => {
  const c = colorMap[color] || colorMap.blue;

  if (children) {
    return (
      <div className="admin-card" style={{ animationDelay: `${delay}ms` }}>
        {title && (
          <p className="admin-card-title" style={{ marginBottom: 14 }}>
            {title}
          </p>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="admin-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="admin-card-head">
        <div style={{ flex: 1 }}>
          <p className="admin-card-title">{title}</p>
          <p className="admin-card-value">{value}</p>
          {subtitle && <p className="admin-card-subtitle">{subtitle}</p>}
        </div>
        {icon && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: c.bg,
              color: c.fg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCard;
