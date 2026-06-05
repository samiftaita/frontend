import React from "react";
import {
  InboxIcon,
  FolderIcon,
  ClipboardIcon,
  ClockIcon,
  CalendarIcon,
  ToothIcon,
  AlertCircleIcon,
} from "../Common/Icons";

const iconMap = {
  inbox: <InboxIcon className="w-10 h-10" />,
  folder: <FolderIcon className="w-10 h-10" />,
  clipboard: <ClipboardIcon className="w-10 h-10" />,
  clock: <ClockIcon className="w-10 h-10" />,
  calendar: <CalendarIcon className="w-10 h-10" />,
  tooth: <ToothIcon className="w-10 h-10" />,
};

const DentisteEmptyState = ({ title, description, icon = "inbox" }) => {
  const iconEl = iconMap[icon] || <InboxIcon className="w-10 h-10" />;
  return (
    <div className="dentiste-empty-state">
      <div className="empty-icon" style={{ color: "var(--color-gray-300)" }}>
        {iconEl}
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
};

export default DentisteEmptyState;
