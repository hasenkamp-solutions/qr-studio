import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Lokal gehostete Schriften (Fontsource) — keine Google-Fonts-CDN nötig
import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";

import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
