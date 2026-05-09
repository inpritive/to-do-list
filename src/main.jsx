import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

const debugLog = (hypothesisId, message, data = {}, runId = "pre-fix") => {
  fetch("http://127.0.0.1:7843/ingest/7a4d52b4-ee87-4a24-94ae-4ee7a73399c7", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "acbfb6",
    },
    body: JSON.stringify({
      sessionId: "acbfb6",
      runId,
      hypothesisId,
      location: "src/main.jsx",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
};

// #region agent log
debugLog("H5", "main module evaluated", { hasRoot: Boolean(document.getElementById("root")) });
// #endregion

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <Toaster position="top-right" />
    </ThemeProvider>
  </React.StrictMode>
);
