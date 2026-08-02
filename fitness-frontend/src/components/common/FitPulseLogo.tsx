import React from "react";

interface FitPulseLogoProps {
  className?: string;
  variant?: "full" | "markOnly";
  markColor?: string;
  bgColor?: string;
}

export const FitPulseLogo: React.FC<FitPulseLogoProps> = ({
  className = "w-10 h-10",
  variant = "full",
  markColor = "#D8FC00",
  bgColor = "#0B0E17",
}) => {
  if (variant === "markOnly") {
    return (
      <svg
        viewBox="0 0 512 512"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill={markColor}>
          <polygon points="152,192 196,192 170,328 126,328" />
          <polygon points="234,140 278,140 238,376 194,376" />
          <polygon points="296,236 362,236 348,300 282,300" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Container squircle */}
      <rect x="32" y="32" width="448" height="448" rx="112" ry="112" fill={bgColor} />
      {/* Geometric Mark */}
      <g fill={markColor}>
        <polygon points="152,192 196,192 170,328 126,328" />
        <polygon points="234,140 278,140 238,376 194,376" />
        <polygon points="296,236 362,236 348,300 282,300" />
      </g>
    </svg>
  );
};
