// If we are running in the browser with the local/dev server or on our AI Studio preview server,
// we should use relative paths ("") so it connects to the local Express server on port 3000.
// This prevents "Server connection failed" or JSON parse issues from pulling outdated state from Render.
const isDev = import.meta.env.DEV || 
              (typeof window !== "undefined" && (
                window.location.hostname.includes("run.app") || 
                window.location.hostname.includes("localhost") || 
                window.location.hostname.includes("127.0.0.1")
              ));

export const API = isDev ? "" : (import.meta.env.VITE_API_URL || "");

