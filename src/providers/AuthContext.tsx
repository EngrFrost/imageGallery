import { createContext } from "react";
import type { LoginCredentials } from "../components/core/Login/formhelper";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
