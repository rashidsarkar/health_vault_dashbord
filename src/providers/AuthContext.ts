import { createContext } from "react";

export interface User {
  id: string;
  profileId: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
