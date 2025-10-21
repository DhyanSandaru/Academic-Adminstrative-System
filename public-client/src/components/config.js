const getBackendURL = () => {
  // If you're running locally (localhost or 127.x), dynamically replace it with your LAN IP
  const isLocal = window.location.hostname === "localhost" || window.location.hostname.startsWith("127.");

  if (isLocal) {
    // During development — keep localhost for your own use
    return "http://localhost:8000";
  } else {
    // From mobile or another device — dynamically detect your computer's IP from the page origin
    const host = window.location.hostname;
    return `http://${host}:8000`;
  }
};

export const BACKEND_URL = getBackendURL();
