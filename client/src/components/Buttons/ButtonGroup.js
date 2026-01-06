// client/src/components/Buttons/ButtonGroup.js
import React from 'react';

const ButtonGroup = ({ children }) => {
  return (
    <div className="button-group">
      {children}
    </div>
  );
};

export const Button = ({ children, variant = 'primary', ...props }) => {
  return (
    <button
      className={`button button-${variant}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonGroup;
