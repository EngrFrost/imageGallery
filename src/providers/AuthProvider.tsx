import React, { useState, type ReactNode, useEffect } from "react";
import * as authService from "../api/services/auth";
import type { LoginCredentials } from "../components/core/Login/formhelper";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { token } = await authService.login(credentials);
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const signup = async (credentials: LoginCredentials) => {
    const { token } = await authService.signup(credentials);
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
