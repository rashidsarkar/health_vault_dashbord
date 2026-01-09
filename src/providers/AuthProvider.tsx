import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  profileId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("access-token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      try {
        // Decode token
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp <= currentTime) {
          // Token expired
          logout();
        } else if (decodedToken.role !== "ADMIN") {
          // User is not admin
          console.warn("User is not admin. Logging out...");
          logout();
        } else {
          // Token valid and role is ADMIN
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser({
              id: decodedToken.id,
              profileId: decodedToken.profileId,
              email: decodedToken.email,
              role: decodedToken.role,
            });
          }
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        logout();
      }
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = (userData: any, accessToken: string) => {
    if (userData.role !== "ADMIN") {
      console.warn("Only ADMIN users can log in.");
      logout();
      return;
    }

    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("access-token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    document.cookie = `access-token=${accessToken}; path=/; secure; samesite=strict`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access-token");
    localStorage.removeItem("user");
    document.cookie =
      "access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const isAuthenticated = !!token && !!user;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, isAuthenticated, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
