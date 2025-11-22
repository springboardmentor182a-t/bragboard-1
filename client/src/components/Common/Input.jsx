
import React, { useState } from "react";

export default function Input({ label, name, type="text", value, onChange, placeholder, error, hint, required }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className="field">
      {label && <label className="label" htmlFor={name}>{label}{required ? " *" : ""}</label>}
      <div className="input-with-icon">
        <input
          id={name}
          name={name}
          className={"input" + (error ? " error" : "")}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
        />
        {isPassword && (
          <button type="button" className="input-icon-btn" onClick={() => setVisible(v => !v)} aria-label={visible ? "Hide password" : "Show password"}>
            {visible ? "👁️" : "👁️‍🗨️"}
          </button>
        )}
      </div>
      {hint && !error && <div className="hint">{hint}</div>}
      {error && <div className="error" role="alert">{error}</div>}
    </div>
  );
}
