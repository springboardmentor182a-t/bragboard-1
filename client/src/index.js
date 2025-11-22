// client/src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; 

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
