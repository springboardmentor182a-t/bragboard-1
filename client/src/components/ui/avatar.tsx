import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Avatar({ src, alt = "", className = "", children }: AvatarProps) {
  // If image source is provided → show image
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`w-10 h-10 rounded-full object-cover ${className}`}
      />
    );
  }

  // Otherwise show fallback container
  return (
    <div
      className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold ${className}`}
    >
      {children}
    </div>
  );
}

interface AvatarFallbackProps {
  name?: string;
  className?: string;
}

export function AvatarFallback({ name = "", className = "" }: AvatarFallbackProps) {
  // Convert full name → initials (ex: "Priya Sharma" → "PS")
  const initials = name
    .trim()
    .split(" ")
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

  return <span className={`text-sm ${className}`}>{initials}</span>;
}
