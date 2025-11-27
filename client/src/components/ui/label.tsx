import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ className = "", ...props }) => {
  return (
    <label className={`block mb-1 font-medium ${className}`} {...props} />
  );
};
