import { useState, useEffect, type ReactNode } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("token"));

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleCookieChange = () => {
      setIsAuthenticated(!!Cookies.get("token"));
    };

    window.addEventListener("storage", handleCookieChange);
    return () => {
      window.removeEventListener("storage", handleCookieChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
