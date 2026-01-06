// client/src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Force light theme BEFORE React renders (ignore saved/system preference)
try {
  const initial = "light";
  if (typeof document !== "undefined") {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${initial}`);
  }
} catch (e) {
  // Fail silently
}

const container = document.getElementById("root");

if (!container) {
  console.error("Root container missing - #root not found in public/index.html");
} else {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

// Performance measuring (optional)
reportWebVitals();
