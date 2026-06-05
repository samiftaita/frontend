import React from "react";

/**
 * Realistic tooth SVG icon — two roots, crown with groove.
 * Props: className, width, height, color (stroke color, default currentColor)
 */
const ToothIcon = ({
  className = "w-5 h-5",
  width,
  height,
  color = "currentColor",
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Crown */}
    <path d="M8 3C6 3 4 5 4 7.5C4 9.5 5 11 5.5 13C6 15 6 17 6 19C6 20.1 6.4 21 7.5 21C8.5 21 9 20 9.5 18.5C10 17 10.5 16 12 16C13.5 16 14 17 14.5 18.5C15 20 15.5 21 16.5 21C17.6 21 18 20.1 18 19C18 17 18 15 18.5 13C19 11 20 9.5 20 7.5C20 5 18 3 16 3C14.8 3 13.5 3.8 12 3.8C10.5 3.8 9.2 3 8 3Z" />
    {/* Crown groove */}
    <path
      d="M10 6C10.5 7 11.2 7.5 12 7.5C12.8 7.5 13.5 7 14 6"
      strokeWidth="1.4"
      opacity="0.6"
    />
  </svg>
);

export default ToothIcon;
