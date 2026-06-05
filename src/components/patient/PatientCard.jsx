import React from "react";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
  SparklesIcon,
  BeakerIcon,
  FaceSmileIcon,
  StarIcon,
  UsersIcon,
  TrophyIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  HandRaisedIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const PatientCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  children,
  delay = 0,
}) => {
  const colors = {
    blue: { bg: "rgba(14,165,233,0.1)", text: "#0ea5e9", bar: "#0ea5e9" },
    green: { bg: "rgba(16,185,129,0.1)", text: "#10b981", bar: "#10b981" },
    amber: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", bar: "#f59e0b" },
    red: { bg: "rgba(239,68,68,0.1)", text: "#ef4444", bar: "#ef4444" },
    teal: { bg: "rgba(20,184,166,0.1)", text: "#14b8a6", bar: "#14b8a6" },
    violet: { bg: "rgba(139,92,246,0.1)", text: "#8b5cf6", bar: "#8b5cf6" },
  };
  const c = colors[color] || colors.blue;

  const iconMap = {
    calendar: <CalendarIcon className="w-5 h-5" />,
    clock: <ClockIcon className="w-5 h-5" />,
    checkCircle: <CheckCircleIcon className="w-5 h-5" />,
    xCircle: <XCircleIcon className="w-5 h-5" />,
    cog: <Cog6ToothIcon className="w-5 h-5" />,
    sparkles: <SparklesIcon className="w-5 h-5" />,
    beaker: <BeakerIcon className="w-5 h-5" />,
    faceSmile: <FaceSmileIcon className="w-5 h-5" />,
    star: <StarIcon className="w-5 h-5" />,
    users: <UsersIcon className="w-5 h-5" />,
    trophy: <TrophyIcon className="w-5 h-5" />,
    chatBubble: <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />,
    heart: <HeartIcon className="w-5 h-5" />,
    handRaised: <HandRaisedIcon className="w-5 h-5" />,
    magnifyingGlass: <MagnifyingGlassIcon className="w-5 h-5" />,
  };

  const resolvedIcon = typeof icon === "string" ? iconMap[icon] || icon : icon;

  if (children) {
    return (
      <div
        className="patient-card"
        style={{
          position: "relative",
          animationDelay: `${delay}ms`,
        }}
      >
        {title && <p className="patient-card-title">{title}</p>}
        {children}
      </div>
    );
  }

  return (
    <div
      className="patient-card"
      style={{
        position: "relative",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <p className="patient-card-title">{title}</p>
        {resolvedIcon && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: c.bg,
              color: c.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "transform 250ms cubic-bezier(0.16,1,0.3,1)",
            }}
            className="patient-card-icon-inner"
          >
            {resolvedIcon}
          </div>
        )}
      </div>
      <p className="patient-card-value">{value}</p>
      {subtitle && <p className="patient-card-subtitle">{subtitle}</p>}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${c.bar}, transparent)`,
          borderRadius: "0 0 var(--radius-xl) var(--radius-xl)",
          opacity: 0.5,
        }}
      />
    </div>
  );
};

export default PatientCard;
