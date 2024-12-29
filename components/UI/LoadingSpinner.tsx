import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

export default function LoadingSpinner({
  size = "small",
  color = "currentColor",
}: LoadingSpinnerProps) {
  const sizeClass = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  }[size];

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-primary ${sizeClass}`}
      style={{ borderColor: color }}
    ></div>
  );
}
