import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeGoogleAnalytics } from "./lib/analytics";
import "./index.css";

initializeGoogleAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
