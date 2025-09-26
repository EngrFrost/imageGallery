import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "./AuthContext";
import { setGlobalLogoutHandler } from "../api/apiUtils";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("token"));
  const navigate = useNavigate();

  const logout = useCallback(() => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    // Register logout handler with API utilities
    setGlobalLogoutHandler(logout);
    
    const handleCookieChange = () => {
      setIsAuthenticated(!!Cookies.get("token"));
    };

    window.addEventListener("storage", handleCookieChange);
    return () => {
      window.removeEventListener("storage", handleCookieChange);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
