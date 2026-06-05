import React, { useCallback, useEffect, useMemo, useState } from "react";
import { dashboardApi } from "../../services/api";
import AdminLoading from "../../components/admin/AdminLoading";
import AdminError from "../../components/admin/AdminError";
import useAutoRefresh from "../../hooks/useAutoRefresh";

/* ══════════════════════════════════════════
   ICÔNES SVG inline
   ══════════════════════════════════════════ */
const Svg = ({ d, size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);
const PATHS = {
  people:
    "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  tooth:
    "M12 2C9.24 2 7 4.24 7 7c0 1.64.78 3.09 2 4.03V20c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-8.97C16.22 10.09 17 8.64 17 7c0-2.76-2.24-5-5-5z",
  calendar:
    "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-7-7h5v5h-5z",
  check: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  clock:
    "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
  cancel:
    "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z",
  trending:
    "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
};

/* ══════════════════════════════════════════
   STAT CARD — style image de référence
   ══════════════════════════════════════════ */
const COLORS = {
  green: { bg: "#ecfdf5", fg: "#059669", text: "#065f46" },
  blue: { bg: "#eff6ff", fg: "#2563eb", text: "#1e40af" },
  amber: { bg: "#fffbeb", fg: "#d97706", text: "#92400e" },
  red: { bg: "#fef2f2", fg: "#ef4444", text: "#7f1d1d" },
  violet: { bg: "#f5f3ff", fg: "#7c3aed", text: "#4c1d95" },
  teal: { bg: "#f0fdfa", fg: "#0d9488", text: "#134e4a" },
};

const StatCard = ({
  title,
  value,
  trend,
  trendLabel,
  iconKey,
  color,
  delay = 0,
}) => {
  const c = COLORS[color] || COLORS.green;
  const isUp = trend >= 0;
  return (
    <div
      className="animate-fadeInUp"
      style={{
        animationDelay: `${delay}ms`,
        background: "#fff",
        borderRadius: 14,
        padding: "20px 22px",
        border: "1px solid #e5e7eb",
        transition: "border-color 180ms, box-shadow 180ms",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#d1d5db";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Titre + icône */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            color: "#6b7280",
          }}
        >
          {title}
        </p>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: c.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Svg d={PATHS[iconKey]} size={18} color={c.fg} />
        </div>
      </div>

      {/* Valeur */}
      <p
        style={{
          margin: "0 0 10px",
          fontSize: "2rem",
          fontWeight: 800,
          color: "#111827",
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        {value}
      </p>

      {/* Trend badge */}
      {trend !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              background: isUp ? "#ecfdf5" : "#fef2f2",
              color: isUp ? "#059669" : "#ef4444",
              borderRadius: 999,
              padding: "2px 8px",
              fontSize: "0.7rem",
              fontWeight: 700,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path
                d={
                  isUp
                    ? PATHS.trending
                    : "M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"
                }
              />
            </svg>
            {Math.abs(trend)} %
          </span>
          {trendLabel && (
            <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   CARD WRAPPER
   ══════════════════════════════════════════ */
const Card = ({ title, subtitle, action, children, style = {}, delay = 0 }) => (
  <div
    className="animate-fadeInUp"
    style={{
      animationDelay: `${delay}ms`,
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #e5e7eb",
      padding: "20px 22px",
      ...style,
    }}
  >
    {(title || subtitle || action) && (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 18,
          gap: 12,
        }}
      >
        <div>
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "0.75rem",
                color: "#9ca3af",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    )}
    {children}
  </div>
);

/* ══════════════════════════════════════════
   STATUS BADGE
   ══════════════════════════════════════════ */
const STATUS_CFG = {
  confirme: {
    bg: "#ecfdf5",
    color: "#065f46",
    dot: "#10b981",
    label: "Confirmé",
  },
  en_attente: {
    bg: "#fffbeb",
    color: "#92400e",
    dot: "#f59e0b",
    label: "En attente",
  },
  annule: { bg: "#fef2f2", color: "#7f1d1d", dot: "#ef4444", label: "Annulé" },
  reporte: {
    bg: "#eff6ff",
    color: "#1e40af",
    dot: "#3b82f6",
    label: "Reporté",
  },
};
const RdvBadge = ({ statut }) => {
  const s = STATUS_CFG[statut] || {
    bg: "#f3f4f6",
    color: "#374151",
    dot: "#9ca3af",
    label: statut,
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        color: s.color,
        borderRadius: 999,
        padding: "3px 9px",
        fontSize: "0.65rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  );
};

/* ══════════════════════════════════════════
   BAR CHART — RDV par mois (style référence)
   Deux séries : Confirmés (vert) + Total (bleu)
   ══════════════════════════════════════════ */
const BarChartMois = ({ data, confirmes }) => {
  const [hov, setHov] = useState(null);
  const W = 560,
    H = 200,
    P = { t: 16, r: 16, b: 36, l: 36 };
  const iW = W - P.l - P.r,
    iH = H - P.t - P.b;
  const max = Math.max(...data.map((d) => d.total), 1);
  const bW = (iW / data.length) * 0.28;
  const gap = iW / data.length;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", overflow: "visible" }}
    >
      {/* Grille */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={P.l}
          x2={P.l + iW}
          y1={P.t + iH * (1 - t)}
          y2={P.t + iH * (1 - t)}
          stroke="#f3f4f6"
          strokeWidth="1"
        />
      ))}

      {/* Barres */}
      {data.map((d, i) => {
        const cx = P.l + i * gap + gap / 2;
        const bh = (d.total / max) * iH;
        const by = P.t + iH - bh;
        const isHov = hov === i;
        return (
          <g
            key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Barre principale */}
            <rect
              x={cx - bW / 2}
              y={by}
              width={bW}
              height={bh}
              rx={4}
              fill={isHov ? "#059669" : "#10b981"}
              style={{ transition: "fill 150ms" }}
            />
            {/* Tooltip */}
            {isHov && d.total > 0 && (
              <g>
                <rect
                  x={cx - 28}
                  y={by - 28}
                  width={56}
                  height={22}
                  rx={6}
                  fill="#111827"
                />
                <text
                  x={cx}
                  y={by - 13}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="10"
                  fontWeight="700"
                >
                  {d.total} RDV
                </text>
              </g>
            )}
            {/* Label mois */}
            <text
              x={cx}
              y={H - 6}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="10"
            >
              {d.mois}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* Légende du bar chart */
const ChartLegend = ({ items }) => (
  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 3,
            background: item.color,
            flexShrink: 0,
          }}
        />
        <span
          style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 }}
        >
          {item.label}
        </span>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════
   DONUT CHART — Répartition par statut
   ══════════════════════════════════════════ */
const DonutChart = ({ data }) => {
  const [hov, setHov] = useState(null);
  const total = data.reduce((s, d) => s + d.total, 0) || 1;
  const R = 70,
    r = 44,
    cx = 90,
    cy = 90;
  let angle = -Math.PI / 2;

  const slices = data.map((d) => {
    const sweep = (d.total / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle),
      y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle),
      y2 = cy + R * Math.sin(angle);
    const ix1 = cx + r * Math.cos(angle - sweep),
      iy1 = cy + r * Math.sin(angle - sweep);
    const ix2 = cx + r * Math.cos(angle),
      iy2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      ...d,
      path: `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${r},${r} 0 ${large},0 ${ix1},${iy1} Z`,
      pct: Math.round((d.total / total) * 100),
    };
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      {/* Donut */}
      <svg
        viewBox="0 0 180 180"
        style={{ width: 150, height: 150, flexShrink: 0 }}
      >
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.color}
            opacity={hov === null || hov === i ? 1 : 0.3}
            style={{ cursor: "pointer", transition: "opacity 180ms" }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          />
        ))}
        <circle cx={cx} cy={cy} r={r - 4} fill="#fff" />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill="#111827"
          fontSize="18"
          fontWeight="800"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="8"
          fontWeight="700"
          letterSpacing="1"
        >
          TOTAL
        </text>
      </svg>

      {/* Légende */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
          minWidth: 120,
        }}
      >
        {slices.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              opacity: hov === null || hov === i ? 1 : 0.35,
              transition: "opacity 180ms",
            }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: s.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "0.8rem", color: "#374151", flex: 1 }}>
              {s.statut}
            </span>
            <span
              style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}
            >
              {s.total}
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                color: "#9ca3af",
                minWidth: 30,
                textAlign: "right",
              }}
            >
              {s.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   TOP SERVICES — barres horizontales
   Style "Sales by countries" de l'image
   ══════════════════════════════════════════ */
const TopServices = ({ data }) => {
  const max = Math.max(...data.map((d) => d.total), 1);
  const total = data.reduce((s, d) => s + d.total, 0) || 1;
  const palette = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {data.map((d, i) => {
        const pct = Math.round((d.total / total) * 100);
        return (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            {/* Dot couleur */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: palette[i % palette.length],
                flexShrink: 0,
              }}
            />
            {/* Nom service */}
            <span
              style={{
                fontSize: "0.82rem",
                color: "#374151",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {d.service}
            </span>
            {/* Barre */}
            <div
              style={{
                width: 80,
                height: 5,
                background: "#f3f4f6",
                borderRadius: 999,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  background: palette[i % palette.length],
                  width: `${(d.total / max) * 100}%`,
                  transition: "width 700ms cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </div>
            {/* Pourcentage */}
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#111827",
                minWidth: 32,
                textAlign: "right",
              }}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════════
   BAR CHART JOURS — activité par jour
   ══════════════════════════════════════════ */
const BarChartJours = ({ data }) => {
  const [hov, setHov] = useState(null);
  const W = 380,
    H = 140,
    P = { t: 12, r: 8, b: 28, l: 28 };
  const iW = W - P.l - P.r,
    iH = H - P.t - P.b;
  const max = Math.max(...data.map((d) => d.total), 1);
  const bW = (iW / data.length) * 0.5;
  const gap = iW / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {[0, 0.5, 1].map((t, i) => (
        <line
          key={i}
          x1={P.l}
          x2={P.l + iW}
          y1={P.t + iH * (1 - t)}
          y2={P.t + iH * (1 - t)}
          stroke="#f3f4f6"
          strokeWidth="1"
        />
      ))}
      {data.map((d, i) => {
        const bh = (d.total / max) * iH;
        const bx = P.l + i * gap + (gap - bW) / 2;
        const by = P.t + iH - bh;
        return (
          <g
            key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={bx}
              y={by}
              width={bW}
              height={bh}
              rx={4}
              fill={hov === i ? "#059669" : "#10b981"}
              style={{ transition: "fill 150ms" }}
            />
            {hov === i && d.total > 0 && (
              <text
                x={bx + bW / 2}
                y={by - 4}
                textAnchor="middle"
                fill="#111827"
                fontSize="9"
                fontWeight="700"
              >
                {d.total}
              </text>
            )}
            <text
              x={bx + bW / 2}
              y={H - 6}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="9"
            >
              {d.jour}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ══════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ══════════════════════════════════════════ */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    try {
      const res = await dashboardApi.getStats();
      setStats(res.data?.data || null);
      setError("");
    } catch {
      setError("Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);
  useAutoRefresh(loadStats, 30000);

  const taux = useMemo(() => {
    if (!stats) return { confirme: 0, annule: 0, attente: 0 };
    const t = stats.nombre_rendez_vous || 1;
    return {
      confirme: Math.round(((stats.rendez_vous_confirmes || 0) / t) * 100),
      annule: Math.round(((stats.rendez_vous_annules || 0) / t) * 100),
      attente: Math.round(((stats.rendez_vous_en_attente || 0) / t) * 100),
    };
  }, [stats]);

  if (loading) return <AdminLoading text="Chargement du tableau de bord..." />;
  if (error) return <AdminError message={error} onRetry={loadStats} />;
  if (!stats) return null;

  /* ── Render ── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── En-tête de page ── */}
      <div
        className="animate-fadeInDown"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.03em",
            }}
          >
            Tableau de bord
          </h1>
          <p
            style={{ margin: "3px 0 0", fontSize: "0.82rem", color: "#9ca3af" }}
          >
            Vue d'ensemble du cabinet dentaire
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: 8,
              padding: "6px 12px",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#059669",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Système actif
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI Cards (4 principales comme l'image) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }}
      >
        <StatCard
          title="Total patients"
          value={stats.nombre_patients.toLocaleString("fr-FR")}
          trend={2.5}
          trendLabel="ce mois"
          iconKey="people"
          color="green"
          delay={0}
        />
        <StatCard
          title="Total dentistes"
          value={stats.nombre_dentistes.toLocaleString("fr-FR")}
          trend={0}
          trendLabel="actifs"
          iconKey="tooth"
          color="blue"
          delay={60}
        />
        <StatCard
          title="Total rendez-vous"
          value={stats.nombre_rendez_vous.toLocaleString("fr-FR")}
          trend={taux.confirme}
          trendLabel="confirmés"
          iconKey="calendar"
          color="violet"
          delay={120}
        />
        <StatCard
          title="En attente"
          value={stats.rendez_vous_en_attente.toLocaleString("fr-FR")}
          trend={-taux.attente}
          trendLabel="du total"
          iconKey="clock"
          color="amber"
          delay={180}
        />
      </div>

      {/* ── Ligne 2 : Bar chart mois + Donut statuts ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 16,
        }}
      >
        {/* Bar chart RDV par mois */}
        <Card
          title="Rendez-vous par mois"
          subtitle="6 derniers mois"
          action={
            <ChartLegend items={[{ color: "#10b981", label: "Rendez-vous" }]} />
          }
          delay={240}
        >
          {stats.rdv_par_mois?.length > 1 ? (
            <BarChartMois
              data={stats.rdv_par_mois}
              confirmes={stats.rendez_vous_confirmes}
            />
          ) : (
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.82rem",
                textAlign: "center",
                padding: "32px 0",
              }}
            >
              Pas encore assez de données
            </p>
          )}
        </Card>

        {/* Donut répartition statuts */}
        <Card
          title="Répartition par statut"
          subtitle="Tous les rendez-vous"
          delay={280}
        >
          <DonutChart data={stats.rdv_par_statut || []} />
        </Card>
      </div>

      {/* ── Ligne 3 : Activité par jour + Top services ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: 16,
        }}
      >
        {/* Bar chart jours */}
        <Card
          title="Activité par jour de la semaine"
          subtitle="Nombre de rendez-vous"
          delay={320}
        >
          <BarChartJours data={stats.rdv_par_jour || []} />
        </Card>

        {/* Top services — style "Sales by countries" */}
        <Card title="Top services" subtitle="Les plus demandés" delay={360}>
          {stats.top_services?.length ? (
            <TopServices data={stats.top_services} />
          ) : (
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.82rem",
                textAlign: "center",
                padding: "28px 0",
              }}
            >
              Aucun service
            </p>
          )}
        </Card>
      </div>

      {/* ── Tableau derniers rendez-vous ── */}
      <Card
        title="Derniers rendez-vous"
        subtitle="Les 8 consultations les plus récentes"
        delay={400}
      >
        {!stats.derniers_rdv?.length ? (
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.82rem",
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            Aucun rendez-vous
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.845rem",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  {[
                    "Patient",
                    "Dentiste",
                    "Service",
                    "Date",
                    "Heure",
                    "Statut",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 14px",
                        textAlign: "left",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#6b7280",
                        background: "#f9fafb",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.derniers_rdv.map((rdv, i) => (
                  <tr
                    key={rdv.id}
                    className="animate-fadeInUp"
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      animationDelay: `${420 + i * 30}ms`,
                      transition: "background 150ms",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f9fafb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "11px 14px",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "#ecfdf5",
                            color: "#059669",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {rdv.patient
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        {rdv.patient}
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px", color: "#374151" }}>
                      {rdv.dentiste}
                    </td>
                    <td style={{ padding: "11px 14px", color: "#374151" }}>
                      {rdv.service}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        color: "#374151",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(rdv.date_rdv).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding: "11px 14px", color: "#374151" }}>
                      {rdv.heure_debut}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <RdvBadge statut={rdv.statut} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
