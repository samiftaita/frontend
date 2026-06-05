import React from "react";

/**
 * Carte skeleton animée pour les états de chargement.
 * Remplace les spinners génériques par un placeholder visuel.
 */
const SkeletonCard = ({ lines = 3, hasIcon = true, className = "" }) => (
  <div
    className={className}
    style={{
      background: "rgba(255,255,255,0.92)",
      border: "1px solid rgba(226,232,240,0.8)",
      borderRadius: "var(--r-xl, 22px)",
      padding: 20,
      boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          className="skeleton-line"
          style={{ width: "45%", height: 10, marginBottom: 12 }}
        />
        <div
          className="skeleton-line"
          style={{ width: "65%", height: 28, marginBottom: 8 }}
        />
        {Array.from({ length: lines - 2 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-line"
            style={{ width: `${50 + i * 10}%`, height: 10, marginBottom: 6 }}
          />
        ))}
      </div>
      {hasIcon && (
        <div
          className="skeleton-circle"
          style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }}
        />
      )}
    </div>
  </div>
);

/**
 * Grille de skeleton cards pour les dashboards.
 */
export const SkeletonGrid = ({
  count = 4,
  columns = "repeat(auto-fit, minmax(200px, 1fr))",
  gap = 18,
}) => (
  <div style={{ display: "grid", gridTemplateColumns: columns, gap }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} style={{ animationDelay: `${i * 50}ms` }} />
    ))}
  </div>
);

/**
 * Skeleton pour une ligne de tableau.
 */
export const SkeletonRow = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} style={{ padding: "14px 18px" }}>
        <div
          className="skeleton-line"
          style={{
            // Security reviewed: Math.random() used only for UI visual variety (skeleton widths), not for security/cryptographic purposes
            width: i === 0 ? "80%" : `${40 + Math.random() * 40}%`,
            height: 12,
          }}
        />
      </td>
    ))}
  </tr>
);

export default SkeletonCard;
