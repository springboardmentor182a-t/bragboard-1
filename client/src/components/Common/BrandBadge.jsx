
import React from "react";


export default function BrandBadge({ text = "BragBoard", href = "/" }) {
  return (
    <a
      href={href}
      className="brand-badge"
      aria-label={`${text} - go to home`}
      role="link"
    >
      {text}
    </a>
  );
}
