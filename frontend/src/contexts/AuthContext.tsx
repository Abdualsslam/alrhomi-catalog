// src/contexts/AuthContext.tsx
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  ReactElement,
} from "react";
import { AuthContextValue } from "../types/context.types";
import { UserRole } from "../types/models.types";

// Create context with undefined as initial value to enforce proper usage
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  // Read accessToken, role, and username from localStorage with explicit types
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [role, setRole] = useState<UserRole | null>(
    localStorage.getItem("role") as UserRole | null
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  // Listen to localStorage changes (even from other tabs)
  useEffect(() => {
    function onStorage(): void {
      setAccessToken(localStorage.getItem("accessToken"));
      setRole(localStorage.getItem("role") as UserRole | null);
      setUsername(localStorage.getItem("username"));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value: AuthContextValue = {
    accessToken,
    role,
    username,
    setAccessToken,
    setRole,
    setUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook with proper type checking and undefined handling
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };
