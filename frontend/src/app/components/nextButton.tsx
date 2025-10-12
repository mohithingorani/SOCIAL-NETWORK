import React from "react";

const NextIcon = ({ size = 30, color = "currentColor", ...props }) => (
  <svg
  className="opacity-50 hover:opacity-100"
    aria-label="Next"
    role="img"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
    {...props}
  >
    <title>Next</title>
    <path d="M12.005.503a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm3.707 12.22-4.5 4.488A1 1 0 0 1 9.8 15.795l3.792-3.783L9.798 8.21a1 1 0 1 1 1.416-1.412l4.5 4.511a1 1 0 0 1-.002 1.414Z" />
  </svg>
);

export default NextIcon;
