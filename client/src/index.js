// client/src/index.js
import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/shoutouts.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");

if (!container) {
  console.error("Root container missing - #root not found in public/index.html");
} else {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// If you want to start measuring performance, pass a function:
// e.g. reportWebVitals(console.log);
reportWebVitals();
