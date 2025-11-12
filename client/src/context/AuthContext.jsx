import { createContext, useState, useEffect } from "react";

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

  useEffect(() => {
    // This ensures we only render after initial check
    setAuthChecked(true);
  }, []);

  const login = (userData) => {
    try {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
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

  // If initial auth check not done, render nothing
  if (!authChecked) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
