import { useEffect, useState } from "react";

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
      location: "src/hooks/useLocalStorage.js",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    // #region agent log
    debugLog("H3", "useLocalStorage initializer start", { key });
    // #endregion
    const item = localStorage.getItem(key);
    if (!item) return initialValue;
    try {
      return JSON.parse(item);
    } catch (error) {
      // #region agent log
      debugLog("H3", "localStorage JSON parse failed", { key, error: String(error) });
      // #endregion
      throw error;
    }
  });

  useEffect(() => {
    // #region agent log
    debugLog("H6", "useLocalStorage persist", { key });
    // #endregion
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
