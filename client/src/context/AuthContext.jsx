import { createContext, useState, useEffect, useRef } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error("Error reading user from localStorage:", err);
      localStorage.removeItem("user"); // clean corrupted value
      return null;
    }
  });


  const [authChecked, setAuthChecked] = useState(false); // Ensure initial check done
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const pollingRef = useRef(null);

  useEffect(() => {
    // This ensures we only render after initial check
    setAuthChecked(true);
  }, []);

  const login = (userData) => {
    try {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log(`Admin creds added ${userData.id}`)
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Fetch and update pending requests count
  const refreshPendingRequests = async () => {
    try {
      const res = await fetch('/api/requests/view-requests');
      if (!res.ok) return;
      const data = await res.json();
      const count = Array.isArray(data) ? data.length : 0;
      setPendingRequestsCount(count);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  };

  // Start/stop polling when `user` presence changes
  useEffect(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    if (user) {
      // refresh immediately and then poll
      refreshPendingRequests();
      pollingRef.current = setInterval(refreshPendingRequests, 15000);
    } else {
      setPendingRequestsCount(0);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [user]);

  // If initial auth check not done, render nothing
  if (!authChecked) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, pendingRequestsCount, refreshPendingRequests }}>
      {children}
    </AuthContext.Provider>
  );
}
